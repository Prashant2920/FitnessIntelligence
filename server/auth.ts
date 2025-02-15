import express from 'express';
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import dotenv from "dotenv";

dotenv.config();

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: express.Express) {
  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be set in the .env file.");
  }

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: app.get("env") === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
  }

  app.use(express.json()); // Ensure JSON parsing middleware is used
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        console.log("Login attempt with email:", email);
        const user = await storage.getUserByEmail(email);
        if (!user) {
          console.log("User not found with email:", email);
          return done(null, false, { message: "Invalid email or password" });
        }
        const isPasswordValid = await comparePasswords(password, user.password);
        if (!isPasswordValid) {
          console.log("Invalid password for email:", email);
          return done(null, false, { message: "Invalid email or password" });
        }
        console.log("User authenticated successfully:", user);
        return done(null, user);
      } catch (error) {
        console.error("Error during authentication:", error);
        return done(error as Error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    if (!user || !user.id) {
      return done(new Error("User ID missing"));
    }
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(new Error("User not found"));
      }
      done(null, user);
    } catch (error) {
      done(error as Error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      console.log("Incoming request body:", req.body); // Debugging line

      const { username, email, password, weight, height, fitnessGoal, activityLevel } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await hashPassword(password);

      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        weight,
        height,
        fitnessGoal,
        activityLevel,
      });

      req.login(user, (err: Error | null) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.post("/api/login", (req, res, next) => {
    console.log("Login request received");
    passport.authenticate("local", (err: Error | null, user: Express.User | false, info: { message: string } | undefined) => {
      if (err) {
        console.error("Authentication error:", err);
        return next(err);
      }
      if (!user) {
        console.log("Authentication failed:", info?.message);
        return res.status(401).json({ error: info?.message || "Unauthorized" });
      }

      req.login(user, (err: Error | null) => {
        if (err) {
          console.error("Login error:", err);
          return next(err);
        }
        console.log("User logged in successfully:", user);
        res.status(200).json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err: Error | null) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    res.json(req.user);
  });
}