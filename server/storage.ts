import { IStorage } from "./types";
import { users, workoutPlans, dietLogs, progressLogs } from "@shared/schema";
import type { InsertUser, User, WorkoutPlan, DietLog, ProgressLog } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, preferences: {} })
      .returning();
    return user;
  }

  async createWorkoutPlan(plan: Omit<WorkoutPlan, "id">): Promise<WorkoutPlan> {
    const [workoutPlan] = await db
      .insert(workoutPlans)
      .values(plan)
      .returning();
    return workoutPlan;
  }

  async getUserWorkoutPlans(userId: number): Promise<WorkoutPlan[]> {
    return await db
      .select()
      .from(workoutPlans)
      .where(eq(workoutPlans.userId, userId));
  }

  async createDietLog(log: Omit<DietLog, "id">): Promise<DietLog> {
    const [dietLog] = await db
      .insert(dietLogs)
      .values(log)
      .returning();
    return dietLog;
  }

  async getUserDietLogs(userId: number): Promise<DietLog[]> {
    return await db
      .select()
      .from(dietLogs)
      .where(eq(dietLogs.userId, userId));
  }

  async createProgressLog(log: Omit<ProgressLog, "id">): Promise<ProgressLog> {
    const [progressLog] = await db
      .insert(progressLogs)
      .values(log)
      .returning();
    return progressLog;
  }

  async getUserProgressLogs(userId: number): Promise<ProgressLog[]> {
    return await db
      .select()
      .from(progressLogs)
      .where(eq(progressLogs.userId, userId));
  }
}

export const storage = new DatabaseStorage();