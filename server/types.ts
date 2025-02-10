import { InsertUser, User, WorkoutPlan, DietLog, ProgressLog } from "@shared/schema";
import type { Store } from "express-session";

export interface IStorage {
  sessionStore: Store;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createWorkoutPlan(plan: Omit<WorkoutPlan, "id">): Promise<WorkoutPlan>;
  getUserWorkoutPlans(userId: number): Promise<WorkoutPlan[]>;
  createDietLog(log: Omit<DietLog, "id">): Promise<DietLog>;
  getUserDietLogs(userId: number): Promise<DietLog[]>;
  createProgressLog(log: Omit<ProgressLog, "id">): Promise<ProgressLog>;
  getUserProgressLogs(userId: number): Promise<ProgressLog[]>;
}
