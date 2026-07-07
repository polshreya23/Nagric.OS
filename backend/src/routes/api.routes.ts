import { Router } from 'express';
import multer from 'multer';
import { GrievanceController } from '../controllers/grievance.controller';
import { SchemeController } from '../controllers/scheme.controller';
import { DigiVaultController } from '../controllers/digivault.controller';
import { ScamController } from '../controllers/scam.controller';
import { PrismaClient } from '../generated/client';

const router = Router();
const prisma = new PrismaClient();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// 1. Grievance Routes
router.post('/grievances', upload.single('media'), GrievanceController.reportGrievance);
router.get('/grievances', GrievanceController.listGrievances);
router.get('/grievances/optimize-route', GrievanceController.getOptimizedRouteForOfficer);

// 2. Scheme Routes
router.get('/schemes/recommendations', SchemeController.getRecommendations);
router.post('/schemes/apply', SchemeController.applyForScheme);
router.post('/schemes/seed', SchemeController.seedSchemes);

// 3. DigiVault Routes
router.post('/digivault/upload', upload.single('document'), DigiVaultController.uploadDocument);
router.get('/digivault/documents', DigiVaultController.getUserDocuments);
router.post('/digivault/explain-circular', upload.single('circular'), DigiVaultController.explainCircular);

// 4. Scam Shield Routes
router.post('/scam-shield/evaluate', ScamController.evaluateScam);
router.get('/scam-shield/alerts', ScamController.getScamAlerts);

// 5. User & Profile Setup Routes (For Hackathon Demo onboarding)
router.post('/users/register', async (req, res) => {
  try {
    const { phone_number, full_name, aadhaar_hash, date_of_birth, gender, role } = req.body;

    const user = await prisma.user.create({
      data: {
        phoneNumber: phone_number,
        fullName: full_name,
        aadhaarHash: aadhaar_hash,
        dateOfBirth: new Date(date_of_birth),
        gender,
        role: role || 'CITIZEN'
      }
    });

    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to register user', details: error.message });
  }
});

router.post('/users/profile', async (req, res) => {
  try {
    const { userId, annualIncome, occupation, isDifferentlyAbled, casteCategory, hasBplCard, landHoldingHectares, latitude, longitude, state, district } = req.body;

    const profile = await prisma.userProfile.create({
      data: {
        userId,
        annualIncome,
        occupation,
        isDifferentlyAbled,
        casteCategory,
        hasBplCard,
        landHoldingHectares,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        state,
        district
      }
    });

    res.status(201).json(profile);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create profile', details: error.message });
  }
});

export default router;
