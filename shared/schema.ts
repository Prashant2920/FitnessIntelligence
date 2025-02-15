import { pgTable, text, serial, integer, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique(),
  email: text("email").notNull().unique(), // ✅ Added email column
  password: text("password").notNull(),
  weight: integer("weight"),
  height: integer("height"),
  fitnessGoal: text("fitness_goal"),
  activityLevel: text("activity_level"),
  preferences: json("preferences").default({})
});


export const workoutPlans = pgTable("workout_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  plan: json("plan").notNull(),
  active: boolean("active").default(true),
  createdAt: text("created_at")
});

export const dietLogs = pgTable("diet_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(),
  meals: json("meals").notNull(),
  totalCalories: integer("total_calories")
});

export const progressLogs = pgTable("progress_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(),
  weight: integer("weight"),
  measurements: json("measurements"),
  notes: text("notes")
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  weight: true,
  height: true,
  fitnessGoal: true,
  activityLevel: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type WorkoutPlan = typeof workoutPlans.$inferSelect;
export type DietLog = typeof dietLogs.$inferSelect;
export type ProgressLog = typeof progressLogs.$inferSelect;
