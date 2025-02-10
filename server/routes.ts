import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { openai } from "./openai";
import { getChatResponse } from "./huggingface";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Workout Plans
  app.post("/api/workout-plans", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Create a personalized workout plan based on user goals and preferences. Return JSON with exercises, sets, reps." 
        },
        { 
          role: "user", 
          content: JSON.stringify(req.body)
        }
      ],
      response_format: { type: "json_object" }
    });

    const plan = await storage.createWorkoutPlan({
      userId: req.user.id,
      plan: JSON.parse(completion.choices[0].message.content),
      active: true,
      createdAt: new Date().toISOString()
    });

    res.json(plan);
  });

  app.get("/api/workout-plans", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const plans = await storage.getUserWorkoutPlans(req.user.id);
    res.json(plans);
  });

  // Diet Logs
  app.post("/api/diet-logs", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const log = await storage.createDietLog({
      userId: req.user.id,
      date: new Date().toISOString(),
      meals: req.body.meals,
      totalCalories: req.body.totalCalories
    });
    res.json(log);
  });

  app.get("/api/diet-logs", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const logs = await storage.getUserDietLogs(req.user.id);
    res.json(logs);
  });

  // Progress Logs
  app.post("/api/progress-logs", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const log = await storage.createProgressLog({
      userId: req.user.id,
      date: new Date().toISOString(),
      weight: req.body.weight,
      measurements: req.body.measurements,
      notes: req.body.notes
    });
    res.json(log);
  });

  app.get("/api/progress-logs", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const logs = await storage.getUserProgressLogs(req.user.id);
    res.json(logs);
  });

  // AI Chatbot
  app.post("/api/chat", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const response = await getChatResponse(req.body.message);
      res.json({ message: response });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}