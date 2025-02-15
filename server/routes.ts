import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { openai } from "./openai";
import { deepseekChat } from "./deepseek";
import { handleWhatsAppMessage, notifyNewWorkoutPlan } from "./whatsapp-bot";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // ✅ Test Endpoint to Debug req.body
  app.post("/api/test", (req: Request, res: Response) => {
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    res.json({ received: req.body });
  });

  // ✅ DeepSeek AI Chat Endpoint
  app.post("/api/chat", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const { message } = req.body;
      const response = await deepseekChat(message);
      res.json({ message: response });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // ✅ WhatsApp Webhook
  app.post("/api/whatsapp/webhook", express.raw({ type: "application/json" }), async (req: Request, res: Response) => {
    try {
      await handleWhatsAppMessage(req.body);
      res.sendStatus(200);
    } catch (error) {
      console.error("WhatsApp webhook error:", error);
      res.sendStatus(400);
    }
  });

  // ✅ Workout Plans
  app.post("/api/workout-plans", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Create a personalized workout plan based on user goals and preferences." },
          { role: "user", content: JSON.stringify(req.body) },
        ],
        response_format: "json",
      });

      const plan = await storage.createWorkoutPlan({
        userId: req.user.id,
        plan: JSON.parse(completion.choices[0].message.content),
        active: true,
        createdAt: new Date().toISOString(),
      });

      if (req.user.phoneNumber) {
        await notifyNewWorkoutPlan(req.user.phoneNumber, plan.plan);
      }

      res.json(plan);
    } catch (error) {
      console.error("Workout Plan error:", error);
      res.status(500).json({ error: "Failed to create workout plan" });
    }
  });

  app.get("/api/workout-plans", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const plans = await storage.getUserWorkoutPlans(req.user.id);
      res.json(plans);
    } catch (error) {
      console.error("Get Workout Plans error:", error);
      res.status(500).json({ error: "Failed to retrieve workout plans" });
    }
  });

  // ✅ Diet Logs
  app.post("/api/diet-logs", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const log = await storage.createDietLog({
        userId: req.user.id,
        date: new Date().toISOString(),
        meals: req.body.meals,
        totalCalories: req.body.totalCalories,
      });
      res.json(log);
    } catch (error) {
      console.error("Diet Log error:", error);
      res.status(500).json({ error: "Failed to log diet" });
    }
  });

  app.get("/api/diet-logs", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const logs = await storage.getUserDietLogs(req.user.id);
      res.json(logs);
    } catch (error) {
      console.error("Get Diet Logs error:", error);
      res.status(500).json({ error: "Failed to retrieve diet logs" });
    }
  });

  // ✅ Progress Logs
  app.post("/api/progress-logs", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const log = await storage.createProgressLog({
        userId: req.user.id,
        date: new Date().toISOString(),
        weight: req.body.weight,
        measurements: req.body.measurements,
        notes: req.body.notes,
      });
      res.json(log);
    } catch (error) {
      console.error("Progress Log error:", error);
      res.status(500).json({ error: "Failed to log progress" });
    }
  });

  app.get("/api/progress-logs", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const logs = await storage.getUserProgressLogs(req.user.id);
      res.json(logs);
    } catch (error) {
      console.error("Get Progress Logs error:", error);
      res.status(500).json({ error: "Failed to retrieve progress logs" });
    }
  });

  return createServer(app);
}
