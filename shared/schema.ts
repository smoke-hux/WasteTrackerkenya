import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 20 }).notNull(), // 'resident' or 'collector'
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
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

// Enums for type safety
export const UserRole = {
  RESIDENT: 'resident' as const,
  COLLECTOR: 'collector' as const,
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
