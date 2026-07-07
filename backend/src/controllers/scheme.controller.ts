import { Request, Response } from 'express';
import { PrismaClient } from '../generated/client';
import { GeminiService } from '../services/gemini.service';

const prisma = new PrismaClient();

export class SchemeController {
  /**
   * 1. Get Scheme Recommendations
   * Fetches user profile from database, queries available schemes, and runs Gemini-based eligibility RAG matching.
   */
  static async getRecommendations(req: Request, res: Response) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
      }

      // Fetch user and profile details
      const userProfile = await prisma.userProfile.findUnique({
        where: { userId: userId as string },
        include: { user: true }
      });

      if (!userProfile) {
        return res.status(404).json({ error: 'User profile details not found. Please complete profile setup.' });
      }

      // Fetch all available schemes from database
      const schemesList = await prisma.scheme.findMany();

      if (schemesList.length === 0) {
        return res.json([]);
      }

      // Call Gemini eligibility prediction engine
      const evaluatedList = await GeminiService.evaluateSchemeEligibility(userProfile, schemesList);

      // Map dynamic scores back to schemes data
      const recommendedSchemes = evaluatedList.map((evaluation: any) => {
        const originalScheme = schemesList.find(s => s.id === evaluation.schemeId);
        return {
          ...originalScheme,
          eligibilityStatus: evaluation.eligibility, // 'ELIGIBLE', 'CONDITIONAL', 'INELIGIBLE'
          matchScore: evaluation.matchScore,
          reasonSummary: evaluation.reasonSummary,
          missingDocuments: evaluation.missingDocuments
        };
      }).sort((a: any, b: any) => b.matchScore - a.matchScore);

      res.json(recommendedSchemes);
    } catch (error) {
      console.error('Error fetching scheme recommendations:', error);
      res.status(500).json({ error: 'Failed to process recommendations engine.' });
    }
  }

  /**
   * 2. Submit Scheme Application with pre-filled AI bundle
   */
  static async applyForScheme(req: Request, res: Response) {
    try {
      const { userId, schemeId, submittedData } = req.body;

      if (!userId || !schemeId || !submittedData) {
        return res.status(400).json({ error: 'Missing required parameters.' });
      }

      // Verify documents in DigiVault before allowing submission
      const activeDocs = await prisma.digiVaultDocument.findMany({
        where: { userId, isVerified: true }
      });

      const userDocs = activeDocs.map(d => d.documentType);

      // Perform transaction write
      const application = await prisma.schemeApplication.create({
        data: {
          userId,
          schemeId,
          status: 'submitted',
          submittedData,
          aiEligibilityScore: 90.0, // Assumed score based on recommendation
          remarks: `Documents attached: ${userDocs.join(', ')}`
        }
      });

      res.status(201).json({
        message: 'Application successfully pre-filled and transmitted to the regional department pipeline.',
        application
      });
    } catch (error) {
      console.error('Error applying for scheme:', error);
      res.status(500).json({ error: 'Failed to submit scheme application.' });
    }
  }

  /**
   * 3. Seed Schemes (Utility helper for hackathon setup)
   */
  static async seedSchemes(req: Request, res: Response) {
    try {
      const sampleSchemes = [
        {
          title: "PM Fasal Bima Yojana (Crop Insurance)",
          ministry: "Ministry of Agriculture",
          description: "Financial assistance to farmers experiencing crop failure due to natural calamities, pests, or diseases.",
          benefitsSummary: "Up to ₹50,000 per hectare compensation for rain/drought damages.",
          eligibilityCriteria: { incomeLimit: 500000, maxLandHectares: 5.0 }
        },
        {
          title: "Pradhan Mantri Mudra Yojana (PMMY)",
          ministry: "Ministry of Finance",
          description: "Provides loans up to ₹10 Lakh to non-corporate, non-farm small/micro enterprises.",
          benefitsSummary: "Collateral-free business expansion funding.",
          eligibilityCriteria: { ageLimitMin: 18, isBusinessOwner: true }
        },
        {
          title: "Lakhpati Didi Scheme",
          ministry: "Ministry of Rural Development",
          description: "Empowers women in Self-Help Groups (SHGs) to earn sustainable annual income of over ₹1 Lakh.",
          benefitsSummary: "Skill development, micro-credits, and financial literacy camps.",
          eligibilityCriteria: { gender: "female", casteCategory: "ALL" }
        }
      ];

      await prisma.scheme.deleteMany({});
      
      const seeded = await Promise.all(sampleSchemes.map(s => {
        return prisma.scheme.create({
          data: {
            title: s.title,
            ministry: s.ministry,
            description: s.description,
            benefitsSummary: s.benefitsSummary,
            eligibilityCriteria: s.eligibilityCriteria
          }
        });
      }));

      res.json({ message: 'Seeded successfully', seededCount: seeded.length });
    } catch (error) {
      res.status(500).json({ error: 'Failed to seed sample schemes.' });
    }
  }
}
