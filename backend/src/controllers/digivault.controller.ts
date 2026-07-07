import { Request, Response } from 'express';
import { PrismaClient } from '../generated/client';
import { GeminiService } from '../services/gemini.service';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

export class DigiVaultController {
  /**
   * 1. Upload Document & Parse with OCR & Explainer
   */
  static async uploadDocument(req: Request, res: Response) {
    try {
      const { userId, targetLanguage } = req.body;
      const file = req.file;

      if (!userId || !file) {
        return res.status(400).json({ error: 'User ID and document file are required.' });
      }

      // Calculate SHA-256 Hash of the file to prevent duplicate storage / fraud check
      const hash = crypto.createHash('sha256').update(file.buffer).digest('hex');

      // Check if document already exists
      const existingDoc = await prisma.digiVaultDocument.findFirst({
        where: { userId, documentHash: hash }
      });

      if (existingDoc) {
        return res.status(200).json({
          message: 'Document already uploaded and verified in your DigiVault.',
          document: existingDoc
        });
      }

      // In production, upload the file to Firebase Storage/S3
      const fileUrl = `https://storage.googleapis.com/nagrik-os-bucket/vault/${userId}_${Date.now()}_${file.originalname}`;

      // Call Gemini model for document intelligence (OCR + Jargon Buster)
      const parsedDetails = await GeminiService.parseAndExplainDocument(
        file.buffer,
        file.mimetype,
        targetLanguage || 'Hindi'
      );

      // Create Document in Database
      const newDoc = await prisma.digiVaultDocument.create({
        data: {
          userId,
          documentType: parsedDetails.documentType || 'OTHER',
          documentHash: hash,
          fileUrl,
          isVerified: parsedDetails.validationScore > 0.7,
          extractedMetadata: parsedDetails.extractedDetails || {},
          expiryDate: parsedDetails.isExpired ? new Date() : null
        }
      });

      // Retrieve dynamic user profile values and check if we should auto-fill/update them
      if (parsedDetails.documentType === 'INCOME_CERTIFICATE' && parsedDetails.extractedDetails?.annualIncome) {
        await prisma.userProfile.update({
          where: { userId },
          data: {
            annualIncome: parseFloat(parsedDetails.extractedDetails.annualIncome)
          }
        });
      }

      return res.status(201).json({
        message: 'Document processed successfully and stored in secure DigiVault.',
        document: newDoc,
        explanation: parsedDetails.simpleExplanation,
        validity: parsedDetails.validationScore
      });
    } catch (error) {
      console.error('Error uploading document to DigiVault:', error);
      res.status(500).json({ error: 'Failed to process document upload.' });
    }
  }

  /**
   * 2. Get Citizen DigiVault Documents list
   */
  static async getUserDocuments(req: Request, res: Response) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
      }

      const documents = await prisma.digiVaultDocument.findMany({
        where: { userId: userId as string },
        orderBy: { createdAt: 'desc' }
      });

      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve vault documents.' });
    }
  }

  /**
   * 3. Explains a generic government circular or notification letter
   */
  static async explainCircular(req: Request, res: Response) {
    try {
      const { targetLanguage } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'Government circular letter file is required.' });
      }

      const explanationResult = await GeminiService.parseAndExplainDocument(
        file.buffer,
        file.mimetype,
        targetLanguage || 'Hindi'
      );

      res.json({
        documentName: file.originalname,
        summary: explanationResult.simpleExplanation,
        metadata: explanationResult.extractedDetails
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to explain government circular.' });
    }
  }
}
