import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { GeminiService } from '../services/gemini.service';

const prisma = new PrismaClient();

export class GrievanceController {
  /**
   * 1. Create a grievance with Edge-Vision parsing, fraud/duplication checks, and vulnerability priority scoring.
   */
  static async reportGrievance(req: Request, res: Response) {
    try {
      const { reporterId, category, description, latitude, longitude, formattedAddress } = req.body;
      const file = req.file;

      if (!reporterId || !latitude || !longitude) {
        return res.status(400).json({ error: 'Reporter ID, Latitude, and Longitude are required.' });
      }

      const latVal = parseFloat(latitude);
      const lngVal = parseFloat(longitude);

      let aiResult = {
        category: category || 'other',
        severity: 3,
        isRealImage: true,
        localizedDescription: 'No media uploaded. Standard processing.',
        priorityFactor: 0.3
      };

      let fileUrl = '';
      if (file) {
        // In production, upload file to Firebase storage
        fileUrl = `https://storage.googleapis.com/nagrik-os-bucket/grievances/${Date.now()}_${file.originalname}`;
        
        // Analyze image/video with Gemini Vision API
        aiResult = await GeminiService.analyzeGrievance(file.buffer, file.mimetype, description || '');
      }

      // Check if image is flagged as fake or download
      if (!aiResult.isRealImage) {
        return res.status(400).json({
          error: 'Report Rejected: AI Fraud Detection flagged the media as an internet download, stock image, or mock-up. Please capture live imagery.'
        });
      }

      // 2. Spatial Deduplication Check
      // Look for active complaints of the same category within ~25 meters (~0.00025 degrees latitude/longitude approximation)
      const duplicateWindow = 0.00025;
      const nearGrievances = await prisma.grievance.findFirst({
        where: {
          category: aiResult.category,
          status: {
            in: ['REPORTED', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS']
          },
          latitude: {
            gte: latVal - duplicateWindow,
            lte: latVal + duplicateWindow
          },
          longitude: {
            gte: lngVal - duplicateWindow,
            lte: lngVal + duplicateWindow
          }
        }
      });

      if (nearGrievances) {
        // Link as duplicate
        const createdGrievance = await prisma.grievance.create({
          data: {
            reporterId,
            category: aiResult.category,
            description: `${description} (Deduplicated Match: ${nearGrievances.id})`,
            mediaUrl: fileUrl,
            latitude: latVal,
            longitude: lngVal,
            formattedAddress,
            status: 'DUPLICATE',
            priorityScore: 0.0, // Duplicate issues get lowest action priority
            sentimentScore: 0.0
          }
        });

        return res.status(200).json({
          message: 'Grievance registered. Our spatial clustering has identified this as a duplicate of an existing reported issue. We have grouped your report to expedite repair operations.',
          grievance: createdGrievance,
          duplicateOfId: nearGrievances.id
        });
      }

      // 3. Vulnerability Prioritization Calculation
      // Pull user profile details to assess neighborhood/citizen socio-economic vulnerability factors
      const reporterProfile = await prisma.userProfile.findUnique({
        where: { userId: reporterId }
      });

      let socioWeight = 0.0;
      if (reporterProfile) {
        if (reporterProfile.hasBplCard) socioWeight += 0.2;
        if (reporterProfile.isDifferentlyAbled) socioWeight += 0.2;
        if (reporterProfile.annualIncome.toNumber() < 120000) socioWeight += 0.1;
      }

      // Final priority score combining structural severity, AI-predicted priority, and social vulnerability weight
      const priorityScore = Math.min(
        10.0,
        (aiResult.severity * 0.5) + (aiResult.priorityFactor * 3.0) + (socioWeight * 2.0)
      );

      // Save Grievance
      const newGrievance = await prisma.grievance.create({
        data: {
          reporterId,
          category: aiResult.category,
          description: description || aiResult.localizedDescription,
          mediaUrl: fileUrl,
          latitude: latVal,
          longitude: lngVal,
          formattedAddress,
          status: 'VERIFIED',
          priorityScore,
          sentimentScore: 0.5 // Standard initial sentiment
        }
      });

      return res.status(201).json({
        message: 'Grievance submitted and verified successfully.',
        grievance: newGrievance,
        aiAnalysis: aiResult
      });
    } catch (error: any) {
      console.error('Error reporting grievance:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }

  /**
   * 2. Get list of active grievances
   */
  static async listGrievances(req: Request, res: Response) {
    try {
      const grievances = await prisma.grievance.findMany({
        orderBy: { priorityScore: 'desc' }
      });
      res.json(grievances);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve grievances.' });
    }
  }

  /**
   * 3. AI-powered route optimization for reporting field officers.
   * Employs traveling salesperson solver sorted by geographical location + priority weights.
   */
  static async getOptimizedRouteForOfficer(req: Request, res: Response) {
    try {
      const { officerId, currentLat, currentLng } = req.query;

      if (!officerId || !currentLat || !currentLng) {
        return res.status(400).json({ error: 'Missing officerId, currentLat, or currentLng parameters.' });
      }

      const officerLatitude = parseFloat(currentLat as string);
      const officerLongitude = parseFloat(currentLng as string);

      // Get assigned or unassigned verified tasks for this category/ward
      const tasks = await prisma.grievance.findMany({
        where: {
          status: {
            in: ['VERIFIED', 'ASSIGNED', 'IN_PROGRESS']
          }
        }
      });

      if (tasks.length === 0) {
        return res.json({ route: [], totalDistanceMeters: 0 });
      }

      // Distance calculation utility (haversine)
      const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI/180;
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c; // in metres
      };

      // Sort with Greedy Nearest-Neighbor, modified by Priority Weights
      // Cost function: Cost = DistanceMeters / (1 + priorityScore * 0.2)
      let unvisited = [...tasks];
      let currentLoc = { lat: officerLatitude, lng: officerLongitude };
      let optimizedRoute: any[] = [];
      let totalDistance = 0;

      while (unvisited.length > 0) {
        let bestIndex = 0;
        let lowestCost = Infinity;
        let travelDistance = 0;

        for (let i = 0; i < unvisited.length; i++) {
          const dist = calculateDistance(currentLoc.lat, currentLoc.lng, unvisited[i].latitude, unvisited[i].longitude);
          const priority = unvisited[i].priorityScore;
          const cost = dist / (1 + priority * 0.15); // Heavily prioritize close AND urgent tasks

          if (cost < lowestCost) {
            lowestCost = cost;
            bestIndex = i;
            travelDistance = dist;
          }
        }

        const nextTask = unvisited.splice(bestIndex, 1)[0];
        optimizedRoute.push(nextTask);
        totalDistance += travelDistance;
        currentLoc = { lat: nextTask.latitude, lng: nextTask.longitude };
      }

      res.json({
        officerId,
        startingLocation: { latitude: officerLatitude, longitude: officerLongitude },
        route: optimizedRoute,
        totalDistanceMeters: Math.round(totalDistance)
      });
    } catch (error) {
      console.error('Error optimizing officer route:', error);
      res.status(500).json({ error: 'Failed to compute route optimization.' });
    }
  }
}
