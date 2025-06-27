import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // This will store hashed passwords
  role: varchar("role", { length: 20 }).notNull(), // 'resident' or 'collector'
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  location: text("location"),
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pickupRequests = pgTable("pickup_requests", {
  id: serial("id").primaryKey(),
  residentId: integer("resident_id").references(() => users.id).notNull(),
  collectorId: integer("collector_id").references(() => users.id),
  location: text("location").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  wasteTypes: text("waste_types").array().notNull(), // ['organic', 'plastic', 'paper', 'metal', 'glass', 'electronic']
  estimatedWeight: decimal("estimated_weight", { precision: 8, scale: 2 }).notNull(),
  actualWeight: decimal("actual_weight", { precision: 8, scale: 2 }),
  status: varchar("status", { length: 20 }).notNull().default('pending'), // 'pending', 'accepted', 'collecting', 'completed', 'cancelled'
  scheduledTime: timestamp("scheduled_time"),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  pickupRequestId: integer("pickup_request_id").references(() => pickupRequests.id).notNull(),
  collectorId: integer("collector_id").references(() => users.id).notNull(),
  residentId: integer("resident_id").references(() => users.id).notNull(),
  wasteTypes: text("waste_types").array().notNull(),
  weight: decimal("weight", { precision: 8, scale: 2 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  rating: integer("rating"), // 1-5 stars
  feedback: text("feedback"),
  co2Saved: decimal("co2_saved", { precision: 8, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const illegalDumpingReports = pgTable("illegal_dumping_reports", {
  id: serial("id").primaryKey(),
  reporterId: integer("reporter_id").references(() => users.id).notNull(),
  location: text("location").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  description: text("description").notNull(),
  wasteType: varchar("waste_type", { length: 50 }).notNull(), // 'household', 'construction', 'electronic', 'hazardous'
  urgency: varchar("urgency", { length: 20 }).notNull(), // 'low', 'medium', 'high'
  photoUrl: text("photo_url"),
  status: varchar("status", { length: 20 }).notNull().default('reported'), // 'reported', 'investigating', 'resolved'
  createdAt: timestamp("created_at").defaultNow(),
});

export const wasteMetrics = pgTable("waste_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  period: varchar("period", { length: 20 }).notNull(), // 'daily', 'weekly', 'monthly'
  periodDate: timestamp("period_date").notNull(),
  organicWeight: decimal("organic_weight", { precision: 8, scale: 2 }).default('0'),
  plasticWeight: decimal("plastic_weight", { precision: 8, scale: 2 }).default('0'),
  paperWeight: decimal("paper_weight", { precision: 8, scale: 2 }).default('0'),
  metalWeight: decimal("metal_weight", { precision: 8, scale: 2 }).default('0'),
  glassWeight: decimal("glass_weight", { precision: 8, scale: 2 }).default('0'),
  electronicWeight: decimal("electronic_weight", { precision: 8, scale: 2 }).default('0'),
  totalWeight: decimal("total_weight", { precision: 8, scale: 2 }).default('0'),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default('0'),
  co2Saved: decimal("co2_saved", { precision: 8, scale: 2 }).default('0'),
  recyclingRate: decimal("recycling_rate", { precision: 5, scale: 2 }).default('0'),
});

export const environmentalAchievements = pgTable("environmental_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  achievementType: varchar("achievement_type", { length: 50 }).notNull(), // 'waste_milestone', 'co2_milestone', 'consistency', 'diversity'
  level: integer("level").notNull(), // 1-10 achievement levels
  title: text("title").notNull(),
  description: text("description").notNull(),
  environmentalInfo: text("environmental_info").notNull(), // The educational content unlocked
  iconUrl: text("icon_url"),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  wasteThreshold: decimal("waste_threshold", { precision: 8, scale: 2 }), // kg threshold for this achievement
  co2Threshold: decimal("co2_threshold", { precision: 8, scale: 2 }), // CO2 threshold for this achievement
});

export const userEnvironmentalProgress = pgTable("user_environmental_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  totalWasteCollected: decimal("total_waste_collected", { precision: 10, scale: 2 }).default('0'),
  totalCo2Saved: decimal("total_co2_saved", { precision: 10, scale: 2 }).default('0'),
  currentStreak: integer("current_streak").default(0), // days of consecutive waste collection
  longestStreak: integer("longest_streak").default(0),
  lastCollectionDate: timestamp("last_collection_date"),
  achievementPoints: integer("achievement_points").default(0),
  unlockedInfoCount: integer("unlocked_info_count").default(0), // number of environmental info pieces unlocked
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const environmentalInfoLibrary = pgTable("environmental_info_library", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 50 }).notNull(), // 'recycling', 'climate', 'wildlife', 'pollution', 'conservation'
  title: text("title").notNull(),
  content: text("content").notNull(),
  difficulty: varchar("difficulty", { length: 20 }).notNull(), // 'beginner', 'intermediate', 'advanced'
  unlockLevel: integer("unlock_level").notNull(), // Achievement level required to unlock
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  sources: text("sources").array(), // Array of source URLs/references
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPickupRequestSchema = createInsertSchema(pickupRequests).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertCollectionSchema = createInsertSchema(collections).omit({
  id: true,
  createdAt: true,
});

export const insertIllegalDumpingReportSchema = createInsertSchema(illegalDumpingReports).omit({
  id: true,
  createdAt: true,
});

export const insertWasteMetricsSchema = createInsertSchema(wasteMetrics).omit({
  id: true,
});

// Insert schemas for environmental tables (must be after table definitions)
export const insertEnvironmentalAchievementSchema = createInsertSchema(environmentalAchievements).omit({
  id: true,
  unlockedAt: true,
});

export const insertUserEnvironmentalProgressSchema = createInsertSchema(userEnvironmentalProgress).omit({
  id: true,
  updatedAt: true,
});

export const insertEnvironmentalInfoLibrarySchema = createInsertSchema(environmentalInfoLibrary).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type PickupRequest = typeof pickupRequests.$inferSelect;
export type InsertPickupRequest = z.infer<typeof insertPickupRequestSchema>;
export type Collection = typeof collections.$inferSelect;
export type InsertCollection = z.infer<typeof insertCollectionSchema>;
export type IllegalDumpingReport = typeof illegalDumpingReports.$inferSelect;
export type InsertIllegalDumpingReport = z.infer<typeof insertIllegalDumpingReportSchema>;
export type WasteMetrics = typeof wasteMetrics.$inferSelect;
export type InsertWasteMetrics = z.infer<typeof insertWasteMetricsSchema>;
export type EnvironmentalAchievement = typeof environmentalAchievements.$inferSelect;
export type InsertEnvironmentalAchievement = z.infer<typeof insertEnvironmentalAchievementSchema>;
export type UserEnvironmentalProgress = typeof userEnvironmentalProgress.$inferSelect;
export type InsertUserEnvironmentalProgress = z.infer<typeof insertUserEnvironmentalProgressSchema>;
export type EnvironmentalInfoLibrary = typeof environmentalInfoLibrary.$inferSelect;
export type InsertEnvironmentalInfoLibrary = z.infer<typeof insertEnvironmentalInfoLibrarySchema>;

// Enums for type safety
export const UserRole = {
  RESIDENT: 'resident' as const,
  COLLECTOR: 'collector' as const,
  ADMIN: 'admin' as const,
} as const;

export const PickupStatus = {
  PENDING: 'pending' as const,
  ACCEPTED: 'accepted' as const,
  COLLECTING: 'collecting' as const,
  COMPLETED: 'completed' as const,
  CANCELLED: 'cancelled' as const,
} as const;

export const WasteType = {
  ORGANIC: 'organic' as const,
  PLASTIC: 'plastic' as const,
  PAPER: 'paper' as const,
  METAL: 'metal' as const,
  GLASS: 'glass' as const,
  ELECTRONIC: 'electronic' as const,
} as const;

export const UrgencyLevel = {
  LOW: 'low' as const,
  MEDIUM: 'medium' as const,
  HIGH: 'high' as const,
} as const;

export const AchievementType = {
  WASTE_MILESTONE: 'waste_milestone' as const,
  CO2_MILESTONE: 'co2_milestone' as const,
  CONSISTENCY: 'consistency' as const,
  DIVERSITY: 'diversity' as const,
} as const;

export const InfoCategory = {
  RECYCLING: 'recycling' as const,
  CLIMATE: 'climate' as const,
  WILDLIFE: 'wildlife' as const,
  POLLUTION: 'pollution' as const,
  CONSERVATION: 'conservation' as const,
} as const;

export const InfoDifficulty = {
  BEGINNER: 'beginner' as const,
  INTERMEDIATE: 'intermediate' as const,
  ADVANCED: 'advanced' as const,
} as const;
