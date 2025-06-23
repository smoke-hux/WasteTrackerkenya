import { 
  users, pickupRequests, collections, illegalDumpingReports, wasteMetrics,
  type User, type InsertUser, type PickupRequest, type InsertPickupRequest,
  type Collection, type InsertCollection, type IllegalDumpingReport, type InsertIllegalDumpingReport,
  type WasteMetrics, type InsertWasteMetrics, UserRole, PickupStatus
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Pickup request operations
  getPickupRequests(filters?: { residentId?: number; collectorId?: number; status?: string }): Promise<PickupRequest[]>;
  getPickupRequest(id: number): Promise<PickupRequest | undefined>;
  createPickupRequest(request: InsertPickupRequest): Promise<PickupRequest>;
  updatePickupRequest(id: number, updates: Partial<PickupRequest>): Promise<PickupRequest | undefined>;
  
  // Collection operations
  getCollections(filters?: { userId?: number; period?: string }): Promise<Collection[]>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  
  // Illegal dumping report operations
  getIllegalDumpingReports(filters?: { reporterId?: number; status?: string }): Promise<IllegalDumpingReport[]>;
  createIllegalDumpingReport(report: InsertIllegalDumpingReport): Promise<IllegalDumpingReport>;
  
  // Waste metrics operations
  getWasteMetrics(userId: number, period?: string): Promise<WasteMetrics[]>;
  upsertWasteMetrics(metrics: InsertWasteMetrics): Promise<WasteMetrics>;
  
  // Dashboard data
  getResidentDashboardData(userId: number): Promise<{
    totalCollected: number;
    totalEarnings: number;
    co2Saved: number;
    recyclingRate: number;
    activePickups: PickupRequest[];
    recentCollections: Collection[];
  }>;
  
  getCollectorDashboardData(userId: number): Promise<{
    todayJobs: number;
    todayWeight: number;
    todayEarnings: number;
    availableJobs: PickupRequest[];
    activeJob: PickupRequest | null;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getPickupRequests(filters?: { residentId?: number; collectorId?: number; status?: string }): Promise<PickupRequest[]> {
    const conditions = [];
    if (filters?.residentId) {
      conditions.push(eq(pickupRequests.residentId, filters.residentId));
    }
    if (filters?.collectorId) {
      conditions.push(eq(pickupRequests.collectorId, filters.collectorId));
    }
    if (filters?.status) {
      conditions.push(eq(pickupRequests.status, filters.status));
    }
    
    const requests = conditions.length > 0 
      ? await db.select().from(pickupRequests).where(and(...conditions))
      : await db.select().from(pickupRequests);
    
    return requests.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getPickupRequest(id: number): Promise<PickupRequest | undefined> {
    const [request] = await db.select().from(pickupRequests).where(eq(pickupRequests.id, id));
    return request || undefined;
  }

  async createPickupRequest(insertRequest: InsertPickupRequest): Promise<PickupRequest> {
    const [request] = await db
      .insert(pickupRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async updatePickupRequest(id: number, updates: Partial<PickupRequest>): Promise<PickupRequest | undefined> {
    const [request] = await db
      .update(pickupRequests)
      .set(updates)
      .where(eq(pickupRequests.id, id))
      .returning();
    return request || undefined;
  }

  async getCollections(filters?: { userId?: number; period?: string }): Promise<Collection[]> {
    const results = filters?.userId 
      ? await db.select().from(collections).where(
          and(
            eq(collections.residentId, filters.userId),
            eq(collections.collectorId, filters.userId)
          )
        )
      : await db.select().from(collections);
    
    return results.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createCollection(insertCollection: InsertCollection): Promise<Collection> {
    const [collection] = await db
      .insert(collections)
      .values(insertCollection)
      .returning();
    return collection;
  }

  async getIllegalDumpingReports(filters?: { reporterId?: number; status?: string }): Promise<IllegalDumpingReport[]> {
    const conditions = [];
    if (filters?.reporterId) {
      conditions.push(eq(illegalDumpingReports.reporterId, filters.reporterId));
    }
    if (filters?.status) {
      conditions.push(eq(illegalDumpingReports.status, filters.status));
    }
    
    const reports = conditions.length > 0 
      ? await db.select().from(illegalDumpingReports).where(and(...conditions))
      : await db.select().from(illegalDumpingReports);
    
    return reports.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createIllegalDumpingReport(insertReport: InsertIllegalDumpingReport): Promise<IllegalDumpingReport> {
    const [report] = await db
      .insert(illegalDumpingReports)
      .values(insertReport)
      .returning();
    return report;
  }

  async getWasteMetrics(userId: number, period?: string): Promise<WasteMetrics[]> {
    const conditions = [eq(wasteMetrics.userId, userId)];
    
    if (period) {
      conditions.push(eq(wasteMetrics.period, period));
    }
    
    const metrics = await db.select().from(wasteMetrics).where(and(...conditions));
    return metrics.sort((a, b) => b.periodDate.getTime() - a.periodDate.getTime());
  }

  async upsertWasteMetrics(insertMetrics: InsertWasteMetrics): Promise<WasteMetrics> {
    // Try to find existing metric
    const [existing] = await db
      .select()
      .from(wasteMetrics)
      .where(and(
        eq(wasteMetrics.userId, insertMetrics.userId),
        eq(wasteMetrics.period, insertMetrics.period),
        eq(wasteMetrics.periodDate, insertMetrics.periodDate)
      ))
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(wasteMetrics)
        .set(insertMetrics)
        .where(eq(wasteMetrics.id, existing.id))
        .returning();
      return updated;
    } else {
      const [newMetrics] = await db
        .insert(wasteMetrics)
        .values(insertMetrics)
        .returning();
      return newMetrics;
    }
  }

  async getResidentDashboardData(userId: number) {
    const userCollections = await this.getCollections({ userId });
    const activePickups = await this.getPickupRequests({ 
      residentId: userId, 
      status: PickupStatus.PENDING 
    });

    const totalCollected = userCollections.reduce((sum, c) => sum + parseFloat(c.weight || '0'), 0);
    const totalEarnings = userCollections.reduce((sum, c) => sum + parseFloat(c.price || '0'), 0);
    const co2Saved = userCollections.reduce((sum, c) => sum + parseFloat(c.co2Saved || '0'), 0);
    
    // Calculate recycling rate (simplified - percentage of non-organic waste)
    const totalOrganic = userCollections.reduce((sum, c) => {
      return sum + (c.wasteTypes.includes('organic') ? parseFloat(c.weight || '0') : 0);
    }, 0);
    const recyclingRate = totalCollected > 0 ? ((totalCollected - totalOrganic) / totalCollected) * 100 : 0;

    return {
      totalCollected,
      totalEarnings,
      co2Saved,
      recyclingRate,
      activePickups: activePickups.slice(0, 5),
      recentCollections: userCollections.slice(0, 10)
    };
  }

  async getCollectorDashboardData(userId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCollections = await db
      .select()
      .from(collections)
      .where(and(
        eq(collections.collectorId, userId),
        gte(collections.createdAt, today)
      ));

    const availableJobs = await this.getPickupRequests({ status: PickupStatus.PENDING });
    const activeJob = (await this.getPickupRequests({ 
      collectorId: userId, 
      status: PickupStatus.ACCEPTED 
    }))[0] || null;

    const todayJobs = todayCollections.length;
    const todayWeight = todayCollections.reduce((sum, c) => sum + parseFloat(c.weight || '0'), 0);
    const todayEarnings = todayCollections.reduce((sum, c) => sum + parseFloat(c.price || '0'), 0);

    return {
      todayJobs,
      todayWeight,
      todayEarnings,
      availableJobs: availableJobs.slice(0, 10),
      activeJob
    };
  }
}

export const storage = new DatabaseStorage();
