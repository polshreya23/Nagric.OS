import { Request, Response } from 'express';
import { PrismaClient } from '../generated/client';
import { GeminiService } from '../services/gemini.service';

const prisma = new PrismaClient();

export class ScamController {
  /**
   * 1. Analyze reported URL or SMS text for scam signs
   */
  static async evaluateScam(req: Request, res: Response) {
    try {
      const { content, userId } = req.body;

      if (!content) {
        return res.status(400).json({ error: 'Content text or URL is required for evaluation.' });
      }

      // Check for known scam keywords as a fast local fallback
      const suspiciousKeywords = ['double your money', 'lottery prize win', 'free subsidy direct transfer fee', 'deposit cash to lock scheme'];
      let keywordTriggered = false;
      for (const keyword of suspiciousKeywords) {
        if (content.toLowerCase().includes(keyword)) {
          keywordTriggered = true;
          break;
        }
      }

      // Call Gemini Scam Guard model
      const result = await GeminiService.evaluateScamRisk(content);

      if (keywordTriggered && result.verdict === 'SAFE') {
        result.verdict = 'SUSPICIOUS';
        result.riskScore = Math.max(result.riskScore, 65);
        result.warningLabel = 'चेतावनी: संदेहास्पद शब्दावली! / Warning: Suspicious Terminology Detected!';
      }

      // Log to database
      const alertLog = await prisma.scamAlert.create({
        data: {
          reportedContent: content,
          verdict: result.verdict,
          aiReasoning: result.scamMechanics,
          reportedById: userId || null
        }
      });

      res.json({
        message: 'Content evaluated successfully.',
        verdict: result.verdict,
        riskScore: result.riskScore,
        mechanics: result.scamMechanics,
        warningLabel: result.warningLabel,
        logId: alertLog.id
      });
    } catch (error) {
      console.error('Error analyzing scam risk:', error);
      res.status(500).json({ error: 'Failed to process scam evaluation.' });
    }
  }

  /**
   * 2. Fetch recent scam warnings for public alert board
   */
  static async getScamAlerts(req: Request, res: Response) {
    try {
      const alerts = await prisma.scamAlert.findMany({
        where: {
          verdict: {
            in: ['SCAM', 'SUSPICIOUS']
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      });
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve public scam alerts.' });
    }
  }
}
