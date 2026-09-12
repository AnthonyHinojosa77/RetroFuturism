import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPostcardSchema, insertPredictionSchema, insertMenuItemSchema, insertVisitorSchema } from "@shared/schema";
import { apiLimiter, writeLimiter } from "./middleware";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Apply general API rate limiting to all /api routes
  app.use("/api", apiLimiter);

  // === POSTCARDS (Space Tourism) ===
  app.get("/api/postcards", (_req, res) => {
    const postcards = storage.getPostcards();
    res.json(postcards);
  });

  app.post("/api/postcards", writeLimiter, (req, res) => {
    const parsed = insertPostcardSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const postcard = storage.createPostcard(parsed.data);
    res.status(201).json(postcard);
  });

  // === PREDICTIONS (World's Fair) ===
  app.get("/api/predictions", (_req, res) => {
    const predictions = storage.getPredictions();
    res.json(predictions);
  });

  app.post("/api/predictions", writeLimiter, (req, res) => {
    const parsed = insertPredictionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const prediction = storage.createPrediction(parsed.data);
    res.status(201).json(prediction);
  });

  app.post("/api/predictions/:id/vote", writeLimiter, (req, res) => {
    const id = Number.parseInt(String(req.params.id), 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const visitorId = req.body.visitorId;
    if (!visitorId || typeof visitorId !== "string") {
      return res.status(400).json({ error: "visitorId required" });
    }
    const prediction = storage.votePrediction(id, visitorId);
    if (!prediction) return res.status(409).json({ error: "Already voted" });
    res.json(prediction);
  });

  // === MENU ITEMS (Astro Diner) ===
  app.get("/api/menu-items", (_req, res) => {
    const items = storage.getMenuItems();
    res.json(items);
  });

  app.post("/api/menu-items", writeLimiter, (req, res) => {
    const parsed = insertMenuItemSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const item = storage.createMenuItem(parsed.data);
    res.status(201).json(item);
  });

  app.post("/api/menu-items/:id/vote", writeLimiter, (req, res) => {
    const id = Number.parseInt(String(req.params.id), 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const visitorId = req.body.visitorId;
    if (!visitorId || typeof visitorId !== "string") {
      return res.status(400).json({ error: "visitorId required" });
    }
    const item = storage.voteMenuItem(id, visitorId);
    if (!item) return res.status(409).json({ error: "Already voted" });
    res.json(item);
  });

  // === VISITORS ===
  app.get("/api/visitors", (req, res) => {
    const world = req.query.world as string | undefined;
    const visitors = storage.getRecentVisitors(world);
    res.json(visitors);
  });

  app.post("/api/visitors", writeLimiter, (req, res) => {
    const parsed = insertVisitorSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const visitor = storage.logVisitor(parsed.data);
    res.status(201).json(visitor);
  });

  return httpServer;
}
