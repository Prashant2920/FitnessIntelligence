import dotenv from "dotenv";
import pkg from "pg"; // Import pg package as a namespace
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

dotenv.config();

const { Pool } = pkg; // Extract Pool from pg package

// Debugging: Log DATABASE_URL to check if it's loaded
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in the .env file.");
} else {
  console.log("✅ DATABASE_URL Loaded:", process.env.DATABASE_URL);
}

// Create PostgreSQL connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Disable SSL for local development
});

// Initialize Drizzle ORM with schema
export const db = drizzle(pool, { schema });

console.log("✅ Database connection initialized successfully.");
