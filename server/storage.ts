import { 
  users, pickupRequests, collections, illegalDumpingReports, wasteMetrics,
  type User, type InsertUser, type PickupRequest, type InsertPickupRequest,
  type Collection, type InsertCollection, type IllegalDumpingReport, type InsertIllegalDumpingReport,
  type WasteMetrics, type InsertWasteMetrics, UserRole, PickupStatus
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pickupRequests: Map<number, PickupRequest>;
  private collections: Map<number, Collection>;
  private illegalDumpingReports: Map<number, IllegalDumpingReport>;
  private wasteMetrics: Map<number, WasteMetrics>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.pickupRequests = new Map();
    this.collections = new Map();
    this.illegalDumpingReports = new Map();
    this.wasteMetrics = new Map();
    this.currentId = 1;

    // Initialize with sample users
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create sample resident
    await this.createUser({
      username: "john_kamau",
      password: "password123",
      role: UserRole.RESIDENT,
      fullName: "John Kamau",
      phone: "+254712345678",
      location: "Westlands, Nairobi"
    });

    // Create sample collector
    await this.createUser({
      username: "david_mwangi",
      password: "password123",
      role: UserRole.COLLECTOR,
      fullName: "David Mwangi",
      phone: "+254798765432",
      location: "Nairobi"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getPickupRequests(filters?: { residentId?: number; collectorId?: number; status?: string }): Promise<PickupRequest[]> {
    let requests = Array.from(this.pickupRequests.values());
    
    if (filters?.residentId) {
      requests = requests.filter(r => r.residentId === filters.residentId);
    }
    if (filters?.collectorId) {
      requests = requests.filter(r => r.collectorId === filters.collectorId);
    }
    if (filters?.status) {
      requests = requests.filter(r => r.status === filters.status);
    }
    
    return requests.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getPickupRequest(id: number): Promise<PickupRequest | undefined> {
    return this.pickupRequests.get(id);
  }

  async createPickupRequest(insertRequest: InsertPickupRequest): Promise<PickupRequest> {
    const id = this.currentId++;
    const request: PickupRequest = {
      ...insertRequest,
      id,
      createdAt: new Date()
    };
    this.pickupRequests.set(id, request);
    return request;
  }

  async updatePickupRequest(id: number, updates: Partial<PickupRequest>): Promise<PickupRequest | undefined> {
    const request = this.pickupRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, ...updates };
    this.pickupRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  async getCollections(filters?: { userId?: number; period?: string }): Promise<Collection[]> {
    let collections = Array.from(this.collections.values());
    
    if (filters?.userId) {
      collections = collections.filter(c => c.residentId === filters.userId || c.collectorId === filters.userId);
    }
    
    return collections.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createCollection(insertCollection: InsertCollection): Promise<Collection> {
    const id = this.currentId++;
    const collection: Collection = {
      ...insertCollection,
      id,
      createdAt: new Date()
    };
    this.collections.set(id, collection);
    return collection;
  }

  async getIllegalDumpingReports(filters?: { reporterId?: number; status?: string }): Promise<IllegalDumpingReport[]> {
    let reports = Array.from(this.illegalDumpingReports.values());
    
    if (filters?.reporterId) {
      reports = reports.filter(r => r.reporterId === filters.reporterId);
    }
    if (filters?.status) {
      reports = reports.filter(r => r.status === filters.status);
    }
    
    return reports.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createIllegalDumpingReport(insertReport: InsertIllegalDumpingReport): Promise<IllegalDumpingReport> {
    const id = this.currentId++;
    const report: IllegalDumpingReport = {
      ...insertReport,
      id,
      createdAt: new Date()
    };
    this.illegalDumpingReports.set(id, report);
    return report;
  }

  async getWasteMetrics(userId: number, period?: string): Promise<WasteMetrics[]> {
    let metrics = Array.from(this.wasteMetrics.values()).filter(m => m.userId === userId);
    
    if (period) {
      metrics = metrics.filter(m => m.period === period);
    }
    
    return metrics.sort((a, b) => b.periodDate.getTime() - a.periodDate.getTime());
  }

  async upsertWasteMetrics(insertMetrics: InsertWasteMetrics): Promise<WasteMetrics> {
    // Find existing metric for the same user and period
    const existing = Array.from(this.wasteMetrics.values()).find(
      m => m.userId === insertMetrics.userId && 
           m.period === insertMetrics.period &&
           m.periodDate.getTime() === insertMetrics.periodDate.getTime()
    );

    if (existing) {
      const updated = { ...existing, ...insertMetrics };
      this.wasteMetrics.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentId++;
      const metrics: WasteMetrics = { ...insertMetrics, id };
      this.wasteMetrics.set(id, metrics);
      return metrics;
    }
  }

  async getResidentDashboardData(userId: number) {
    const collections = await this.getCollections({ userId });
    const activePickups = await this.getPickupRequests({ 
      residentId: userId, 
      status: PickupStatus.PENDING 
    });

    const totalCollected = collections.reduce((sum, c) => sum + parseFloat(c.weight || '0'), 0);
    const totalEarnings = collections.reduce((sum, c) => sum + parseFloat(c.price || '0'), 0);
    const co2Saved = collections.reduce((sum, c) => sum + parseFloat(c.co2Saved || '0'), 0);
    
    // Calculate recycling rate (simplified - percentage of non-organic waste)
    const totalOrganic = collections.reduce((sum, c) => {
      return sum + (c.wasteTypes.includes('organic') ? parseFloat(c.weight || '0') : 0);
    }, 0);
    const recyclingRate = totalCollected > 0 ? ((totalCollected - totalOrganic) / totalCollected) * 100 : 0;

    return {
      totalCollected,
      totalEarnings,
      co2Saved,
      recyclingRate,
      activePickups: activePickups.slice(0, 5),
      recentCollections: collections.slice(0, 10)
    };
  }

  async getCollectorDashboardData(userId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCollections = Array.from(this.collections.values()).filter(
      c => c.collectorId === userId && 
           c.createdAt && 
           c.createdAt >= today
    );

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

export const storage = new MemStorage();
