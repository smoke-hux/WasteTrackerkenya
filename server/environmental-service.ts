import { eq, sum, and, gte, desc } from "drizzle-orm";
import { db } from "./db";
import { 
  collections, 
  environmentalAchievements, 
  userEnvironmentalProgress, 
  environmentalInfoLibrary,
  users,
  type UserEnvironmentalProgress,
  type EnvironmentalAchievement,
  type EnvironmentalInfoLibrary,
  AchievementType,
  InfoCategory,
  InfoDifficulty
} from "../shared/schema";

export class EnvironmentalService {
  
  static async updateUserProgress(userId: number, collectionData: {
    weight: number;
    co2Saved: number;
  }) {
    try {
      // Get or create user progress record
      let userProgress = await db
        .select()
        .from(userEnvironmentalProgress)
        .where(eq(userEnvironmentalProgress.userId, userId))
        .limit(1);

      if (userProgress.length === 0) {
        // Create new progress record
        await db.insert(userEnvironmentalProgress).values({
          userId,
          totalWasteCollected: collectionData.weight.toString(),
          totalCo2Saved: collectionData.co2Saved.toString(),
          currentStreak: 1,
          longestStreak: 1,
          lastCollectionDate: new Date(),
          achievementPoints: 0,
          unlockedInfoCount: 0,
        });
        userProgress = await db
          .select()
          .from(userEnvironmentalProgress)
          .where(eq(userEnvironmentalProgress.userId, userId))
          .limit(1);
      } else {
        // Update existing progress
        const current = userProgress[0];
        const newTotalWaste = parseFloat(current.totalWasteCollected || '0') + collectionData.weight;
        const newTotalCo2 = parseFloat(current.totalCo2Saved || '0') + collectionData.co2Saved;
        
        // Calculate streak
        const lastCollection = current.lastCollectionDate;
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        let newStreak = current.currentStreak || 0;
        if (!lastCollection || 
            (lastCollection >= yesterday && lastCollection < today)) {
          newStreak += 1;
        } else if (lastCollection < yesterday) {
          newStreak = 1; // Reset streak
        }

        await db
          .update(userEnvironmentalProgress)
          .set({
            totalWasteCollected: newTotalWaste.toString(),
            totalCo2Saved: newTotalCo2.toString(),
            currentStreak: newStreak,
            longestStreak: Math.max(current.longestStreak || 0, newStreak),
            lastCollectionDate: today,
            updatedAt: new Date(),
          })
          .where(eq(userEnvironmentalProgress.userId, userId));
      }

      // Check for new achievements
      await this.checkAndUnlockAchievements(userId);
      
      return true;
    } catch (error) {
      console.error('Error updating user environmental progress:', error);
      return false;
    }
  }

  static async checkAndUnlockAchievements(userId: number) {
    try {
      const userProgress = await db
        .select()
        .from(userEnvironmentalProgress)
        .where(eq(userEnvironmentalProgress.userId, userId))
        .limit(1);

      if (userProgress.length === 0) return;

      const progress = userProgress[0];
      const totalWaste = parseFloat(progress.totalWasteCollected || '0');
      const totalCo2 = parseFloat(progress.totalCo2Saved || '0');
      const currentStreak = progress.currentStreak || 0;

      // Get existing achievements for this user
      const existingAchievements = await db
        .select()
        .from(environmentalAchievements)
        .where(eq(environmentalAchievements.userId, userId));

      const existingTypes = new Set(
        existingAchievements.map(a => `${a.achievementType}_${a.level}`)
      );

      // Define achievement thresholds
      const wasteThresholds = [
        { level: 1, threshold: 5, title: "First Steps", info: "Did you know? Recycling just 1kg of plastic can save up to 2kg of CO2 emissions!" },
        { level: 2, threshold: 25, title: "Eco Warrior", info: "Amazing! Organic waste makes up 40% of household waste in Kenya. Composting reduces methane emissions by 50%." },
        { level: 3, threshold: 50, title: "Green Champion", info: "Fantastic! Every kg of paper you recycle saves 17 trees and 50,000 liters of water." },
        { level: 4, threshold: 100, title: "Planet Protector", info: "Incredible! Electronic waste contains precious metals like gold and silver. 1 ton of e-waste contains more gold than 17 tons of gold ore!" },
        { level: 5, threshold: 250, title: "Sustainability Master", info: "Outstanding! Plastic bottles can take up to 450 years to decompose. Your recycling prevents ocean pollution!" }
      ];

      const co2Thresholds = [
        { level: 1, threshold: 2, title: "Carbon Saver", info: "Great start! The average person produces 4 tons of CO2 per year. You're making a real difference!" },
        { level: 2, threshold: 10, title: "Climate Hero", info: "Excellent! Deforestation accounts for 11% of global CO2 emissions. Your actions help preserve Kenya's forests." },
        { level: 3, threshold: 25, title: "Atmosphere Guardian", info: "Remarkable! Ocean acidification from CO2 threatens marine life. You're protecting coral reefs in the Indian Ocean!" },
      ];

      const streakThresholds = [
        { level: 1, threshold: 3, title: "Consistent Collector", info: "Well done! Consistent recycling habits can reduce household waste by up to 75%." },
        { level: 2, threshold: 7, title: "Weekly Warrior", info: "Amazing! Building sustainable habits takes 21 days. You're well on your way!" },
        { level: 3, threshold: 30, title: "Monthly Master", info: "Phenomenal! Your consistency inspires others. Community action multiplies environmental impact by 10x!" },
      ];

      // Check waste milestones
      for (const threshold of wasteThresholds) {
        const achievementKey = `${AchievementType.WASTE_MILESTONE}_${threshold.level}`;
        if (totalWaste >= threshold.threshold && !existingTypes.has(achievementKey)) {
          await this.unlockAchievement(userId, {
            achievementType: AchievementType.WASTE_MILESTONE,
            level: threshold.level,
            title: threshold.title,
            description: `Collected ${threshold.threshold}kg of waste`,
            environmentalInfo: threshold.info,
            wasteThreshold: threshold.threshold.toString(),
          });
        }
      }

      // Check CO2 milestones
      for (const threshold of co2Thresholds) {
        const achievementKey = `${AchievementType.CO2_MILESTONE}_${threshold.level}`;
        if (totalCo2 >= threshold.threshold && !existingTypes.has(achievementKey)) {
          await this.unlockAchievement(userId, {
            achievementType: AchievementType.CO2_MILESTONE,
            level: threshold.level,
            title: threshold.title,
            description: `Saved ${threshold.threshold}kg of CO2`,
            environmentalInfo: threshold.info,
            co2Threshold: threshold.threshold.toString(),
          });
        }
      }

      // Check consistency streaks
      for (const threshold of streakThresholds) {
        const achievementKey = `${AchievementType.CONSISTENCY}_${threshold.level}`;
        if (currentStreak >= threshold.threshold && !existingTypes.has(achievementKey)) {
          await this.unlockAchievement(userId, {
            achievementType: AchievementType.CONSISTENCY,
            level: threshold.level,
            title: threshold.title,
            description: `${threshold.threshold} day collection streak`,
            environmentalInfo: threshold.info,
          });
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return false;
    }
  }

  static async unlockAchievement(userId: number, achievementData: {
    achievementType: string;
    level: number;
    title: string;
    description: string;
    environmentalInfo: string;
    wasteThreshold?: string;
    co2Threshold?: string;
  }) {
    try {
      // Insert the new achievement
      await db.insert(environmentalAchievements).values({
        userId,
        ...achievementData,
      });

      // Update user's unlocked info count and achievement points
      await db
        .update(userEnvironmentalProgress)
        .set({
          unlockedInfoCount: (await db
            .select()
            .from(environmentalAchievements)
            .where(eq(environmentalAchievements.userId, userId))).length,
          achievementPoints: achievementData.level * 10, // 10 points per level
        })
        .where(eq(userEnvironmentalProgress.userId, userId));

      return true;
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      return false;
    }
  }

  static async getUserAchievements(userId: number) {
    try {
      return await db
        .select()
        .from(environmentalAchievements)
        .where(eq(environmentalAchievements.userId, userId))
        .orderBy(desc(environmentalAchievements.unlockedAt));
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return [];
    }
  }

  static async getUserProgress(userId: number) {
    try {
      const progress = await db
        .select()
        .from(userEnvironmentalProgress)
        .where(eq(userEnvironmentalProgress.userId, userId))
        .limit(1);

      if (progress.length === 0) {
        // Return default progress
        return {
          totalWasteCollected: '0',
          totalCo2Saved: '0',
          currentStreak: 0,
          longestStreak: 0,
          achievementPoints: 0,
          unlockedInfoCount: 0,
        };
      }

      return progress[0];
    } catch (error) {
      console.error('Error getting user progress:', error);
      return null;
    }
  }

  static async getAvailableEnvironmentalInfo(userLevel: number) {
    try {
      return await db
        .select()
        .from(environmentalInfoLibrary)
        .where(gte(environmentalInfoLibrary.unlockLevel, userLevel))
        .orderBy(environmentalInfoLibrary.unlockLevel);
    } catch (error) {
      console.error('Error getting environmental info:', error);
      return [];
    }
  }
}