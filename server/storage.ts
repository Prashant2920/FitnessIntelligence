import { IStorage } from "./types";
import { users, workoutPlans, dietLogs, progressLogs } from "@shared/schema";
import type { InsertUser, User, WorkoutPlan, DietLog, ProgressLog } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { pool } from "./db";  // Ensure db.ts exports a valid pool

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,  // Uses pg.Pool instance
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error("Error fetching user by username:", error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw error;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      console.log("User Data Received:", insertUser);  // Debugging log

      if (!insertUser.email) {
        throw new Error("Missing required email field!");
      }

      const [user] = await db
        .insert(users)
        .values({ ...insertUser, preferences: {} })
        .returning();

      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async createWorkoutPlan(plan: Omit<WorkoutPlan, "id">): Promise<WorkoutPlan> {
    try {
      const [workoutPlan] = await db.insert(workoutPlans).values(plan).returning();
      return workoutPlan;
    } catch (error) {
      console.error("Error creating workout plan:", error);
      throw error;
    }
  }

  async getUserWorkoutPlans(userId: number): Promise<WorkoutPlan[]> {
    try {
      return await db.select().from(workoutPlans).where(eq(workoutPlans.userId, userId));
    } catch (error) {
      console.error("Error fetching workout plans:", error);
      throw error;
    }
  }

  async createDietLog(log: Omit<DietLog, "id">): Promise<DietLog> {
    try {
      const [dietLog] = await db.insert(dietLogs).values(log).returning();
      return dietLog;
    } catch (error) {
      console.error("Error creating diet log:", error);
      throw error;
    }
  }

  async getUserDietLogs(userId: number): Promise<DietLog[]> {
    try {
      return await db.select().from(dietLogs).where(eq(dietLogs.userId, userId));
    } catch (error) {
      console.error("Error fetching diet logs:", error);
      throw error;
    }
  }

  async createProgressLog(log: Omit<ProgressLog, "id">): Promise<ProgressLog> {
    try {
      const [progressLog] = await db.insert(progressLogs).values(log).returning();
      return progressLog;
    } catch (error) {
      console.error("Error creating progress log:", error);
      throw error;
    }
  }

  async getUserProgressLogs(userId: number): Promise<ProgressLog[]> {
    try {
      return await db.select().from(progressLogs).where(eq(progressLogs.userId, userId));
    } catch (error) {
      console.error("Error fetching progress logs:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();