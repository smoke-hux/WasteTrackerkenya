import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { AuthService } from "./auth";
import { 
  insertUserSchema, insertPickupRequestSchema, insertCollectionSchema, 
  insertIllegalDumpingReportSchema, insertWasteMetricsSchema,
  PickupStatus, WasteType
} from "@shared/schema";
import { EnvironmentalService } from "./environmental-service";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth endpoints
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      console.log('Login attempt for:', email); // Debug log
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await AuthService.loginUser({ email, password });
      console.log('Login successful for:', user.email); // Debug log
      res.json({ user });
    } catch (error) {
      console.error('Login error:', error); // Debug log
      const message = error instanceof Error ? error.message : "Login failed";
      res.status(401).json({ message });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, fullName, phone, location, role } = req.body;
      
      // Validate required fields
      if (!email || !password || !fullName || !role) {
        return res.status(400).json({ 
          message: "Email, password, full name, and role are required" 
        });
      }

      // Validate role
      if (!['resident', 'collector', 'admin'].includes(role)) {
        return res.status(400).json({ message: "Role must be 'resident', 'collector', or 'admin'" });
      }

      const user = await AuthService.registerUser({
        email,
        password,
        fullName,
        phone: phone || '',
        location: location || '',
        role
      });

      res.status(201).json({ user });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      res.status(400).json({ message });
    }
  });

  // Dashboard endpoints
  app.get("/api/dashboard/resident/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const data = await storage.getResidentDashboardData(userId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  app.get("/api/dashboard/collector/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const data = await storage.getCollectorDashboardData(userId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Pickup request endpoints
  app.get("/api/pickup-requests", async (req, res) => {
    try {
      const { residentId, collectorId, status } = req.query;
      const requests = await storage.getPickupRequests({
        residentId: residentId ? parseInt(residentId as string) : undefined,
        collectorId: collectorId ? parseInt(collectorId as string) : undefined,
        status: status as string
      });
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pickup requests" });
    }
  });

  app.post("/api/pickup-requests", async (req, res) => {
    try {
      console.log('Pickup request received:', req.body); // Debug log
      
      // Convert scheduledTime string to Date if needed
      if (req.body.scheduledTime && typeof req.body.scheduledTime === 'string') {
        req.body.scheduledTime = new Date(req.body.scheduledTime);
      }
      
      const requestData = insertPickupRequestSchema.parse(req.body);
      
      // Calculate pricing based on waste types and weight
      const basePrice = calculateWastePrice(requestData.wasteTypes, parseFloat(requestData.estimatedWeight));
      const collectionFee = 30; // KSh 30 collection fee
      const totalPrice = basePrice + collectionFee;
      
      const request = await storage.createPickupRequest({
        ...requestData,
        totalPrice: totalPrice.toString(),
        status: PickupStatus.PENDING
      });
      
      console.log('Pickup request created:', request); // Debug log
      res.json(request);
    } catch (error) {
      console.error('Pickup request error:', error); // Debug log
      if (error instanceof Error) {
        res.status(400).json({ message: error.message, details: error.stack });
      } else {
        res.status(400).json({ message: "Failed to create pickup request", error: String(error) });
      }
    }
  });

  app.patch("/api/pickup-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const request = await storage.updatePickupRequest(id, updates);
      
      if (!request) {
        return res.status(404).json({ message: "Pickup request not found" });
      }
      
      res.json(request);
    } catch (error) {
      res.status(400).json({ message: "Failed to update pickup request" });
    }
  });

  // Collection endpoints
  app.get("/api/collections", async (req, res) => {
    try {
      const { userId } = req.query;
      const collections = await storage.getCollections({
        userId: userId ? parseInt(userId as string) : undefined
      });
      res.json(collections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collections" });
    }
  });

  app.post("/api/collections", async (req, res) => {
    try {
      const collectionData = insertCollectionSchema.parse(req.body);
      
      // Calculate CO2 saved based on waste type and weight
      const co2Saved = calculateCO2Saved(collectionData.wasteTypes, parseFloat(collectionData.weight));
      
      const collection = await storage.createCollection({
        ...collectionData,
        co2Saved: co2Saved.toString()
      });
      
      // Update pickup request status to completed
      if (collection.pickupRequestId) {
        await storage.updatePickupRequest(collection.pickupRequestId, {
          status: PickupStatus.COMPLETED,
          actualWeight: collectionData.weight,
          completedAt: new Date()
        });
      }

      // Update environmental progress and check for achievements
      await EnvironmentalService.updateUserProgress(collection.residentId, {
        weight: parseFloat(collectionData.weight),
        co2Saved: co2Saved
      });
      
      res.json(collection);
    } catch (error) {
      res.status(400).json({ message: "Failed to create collection" });
    }
  });

  // Illegal dumping report endpoints
  app.get("/api/dumping-reports", async (req, res) => {
    try {
      const { reporterId, status } = req.query;
      const reports = await storage.getIllegalDumpingReports({
        reporterId: reporterId ? parseInt(reporterId as string) : undefined,
        status: status as string
      });
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dumping reports" });
    }
  });

  app.post("/api/dumping-reports", async (req, res) => {
    try {
      const reportData = insertIllegalDumpingReportSchema.parse(req.body);
      const report = await storage.createIllegalDumpingReport(reportData);
      res.json(report);
    } catch (error) {
      res.status(400).json({ message: "Failed to create dumping report" });
    }
  });

  // Waste metrics endpoints
  app.get("/api/waste-metrics/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { period } = req.query;
      const metrics = await storage.getWasteMetrics(userId, period as string);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch waste metrics" });
    }
  });

  app.post("/api/waste-metrics", async (req, res) => {
    try {
      const metricsData = insertWasteMetricsSchema.parse(req.body);
      const metrics = await storage.upsertWasteMetrics(metricsData);
      res.json(metrics);
    } catch (error) {
      res.status(400).json({ message: "Failed to save waste metrics" });
    }
  });

  // Pricing calculator endpoint
  app.post("/api/calculate-price", async (req, res) => {
    try {
      const { wasteTypes, weight } = req.body;
      const basePrice = calculateWastePrice(wasteTypes, weight);
      const collectionFee = 30;
      const totalPrice = basePrice + collectionFee;
      
      res.json({
        basePrice,
        collectionFee,
        totalPrice,
        breakdown: wasteTypes.map((type: string) => ({
          type,
          price: getWasteTypePrice(type) * weight
        }))
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to calculate price" });
    }
  });

  // Environmental achievement endpoints
  app.get("/api/environmental/achievements/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const achievements = await EnvironmentalService.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get("/api/environmental/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await EnvironmentalService.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch environmental progress" });
    }
  });

  app.get("/api/environmental/info/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const userProgress = await EnvironmentalService.getUserProgress(userId);
      const userLevel = Math.floor((userProgress?.achievementPoints || 0) / 10); // Level = points / 10
      const environmentalInfo = await EnvironmentalService.getAvailableEnvironmentalInfo(userLevel);
      res.json(environmentalInfo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch environmental information" });
    }
  });

  // Admin endpoints - CRUD operations for all tables
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/pickup-requests", async (req, res) => {
    try {
      const requests = await storage.getAllPickupRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pickup requests" });
    }
  });

  app.get("/api/admin/collections", async (req, res) => {
    try {
      const collections = await storage.getAllCollections();
      res.json(collections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collections" });
    }
  });

  app.get("/api/admin/dumping-reports", async (req, res) => {
    try {
      const reports = await storage.getAllDumpingReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dumping reports" });
    }
  });

  app.get("/api/admin/environmental-achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllEnvironmentalAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch environmental achievements" });
    }
  });

  app.put("/api/admin/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.updateUser(id, req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteUser(id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete user" });
    }
  });

  app.put("/api/admin/pickup-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const request = await storage.updatePickupRequest(id, req.body);
      res.json(request);
    } catch (error) {
      res.status(400).json({ message: "Failed to update pickup request" });
    }
  });

  app.delete("/api/admin/pickup-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePickupRequest(id);
      res.json({ message: "Pickup request deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete pickup request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions
function calculateWastePrice(wasteTypes: string[], weight: number): number {
  let totalPrice = 0;
  for (const type of wasteTypes) {
    totalPrice += getWasteTypePrice(type) * weight;
  }
  return totalPrice;
}

function getWasteTypePrice(wasteType: string): number {
  const prices: Record<string, number> = {
    [WasteType.ORGANIC]: 8,     // KSh 8 per kg
    [WasteType.PLASTIC]: 12,    // KSh 12 per kg
    [WasteType.PAPER]: 6,       // KSh 6 per kg
    [WasteType.METAL]: 15,      // KSh 15 per kg
    [WasteType.GLASS]: 10,      // KSh 10 per kg
    [WasteType.ELECTRONIC]: 25, // KSh 25 per kg
  };
  return prices[wasteType] || 8;
}

function calculateCO2Saved(wasteTypes: string[], weight: number): number {
  // Simplified CO2 calculation - different waste types save different amounts
  const co2Factors: Record<string, number> = {
    [WasteType.ORGANIC]: 0.1,    // 0.1 kg CO2 per kg
    [WasteType.PLASTIC]: 2.0,    // 2.0 kg CO2 per kg
    [WasteType.PAPER]: 1.5,      // 1.5 kg CO2 per kg
    [WasteType.METAL]: 3.0,      // 3.0 kg CO2 per kg
    [WasteType.GLASS]: 0.8,      // 0.8 kg CO2 per kg
    [WasteType.ELECTRONIC]: 5.0, // 5.0 kg CO2 per kg
  };
  
  let totalCO2 = 0;
  for (const type of wasteTypes) {
    totalCO2 += (co2Factors[type] || 0.1) * weight;
  }
  return totalCO2;
}
