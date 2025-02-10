import { IStorage } from "./types";
import { InsertUser, User, WorkoutPlan, DietLog, ProgressLog } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private workoutPlans: Map<number, WorkoutPlan>;
  private dietLogs: Map<number, DietLog>;
  private progressLogs: Map<number, ProgressLog>;
  sessionStore: session.Store;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.workoutPlans = new Map();
    this.dietLogs = new Map();
    this.progressLogs = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      preferences: {}  // Add default preferences
    };
    this.users.set(id, user);
    return user;
  }

  async createWorkoutPlan(plan: Omit<WorkoutPlan, "id">): Promise<WorkoutPlan> {
    const id = this.currentId++;
    const workoutPlan: WorkoutPlan = { ...plan, id };
    this.workoutPlans.set(id, workoutPlan);
    return workoutPlan;
  }

  async getUserWorkoutPlans(userId: number): Promise<WorkoutPlan[]> {
    return Array.from(this.workoutPlans.values()).filter(
      (plan) => plan.userId === userId,
    );
  }

  async createDietLog(log: Omit<DietLog, "id">): Promise<DietLog> {
    const id = this.currentId++;
    const dietLog: DietLog = { ...log, id };
    this.dietLogs.set(id, dietLog);
    return dietLog;
  }

  async getUserDietLogs(userId: number): Promise<DietLog[]> {
    return Array.from(this.dietLogs.values()).filter(
      (log) => log.userId === userId,
    );
  }

  async createProgressLog(log: Omit<ProgressLog, "id">): Promise<ProgressLog> {
    const id = this.currentId++;
    const progressLog: ProgressLog = { ...log, id };
    this.progressLogs.set(id, progressLog);
    return progressLog;
  }

  async getUserProgressLogs(userId: number): Promise<ProgressLog[]> {
    return Array.from(this.progressLogs.values()).filter(
      (log) => log.userId === userId,
    );
  }
}

export const storage = new MemStorage();