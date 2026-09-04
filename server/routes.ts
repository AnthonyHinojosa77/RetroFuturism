import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPostcardSchema, insertPredictionSchema, insertMenuItemSchema, insertVisitorSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === POSTCARDS (Space Tourism) ===
  app.get("/api/postcards", (_req, res) => {
    const postcards = storage.getPostcards();
    res.json(postcards);
  });

  app.post("/api/postcards", (req, res) => {
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

  app.post("/api/predictions", (req, res) => {
    const parsed = insertPredictionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const prediction = storage.createPrediction(parsed.data);
    res.status(201).json(prediction);
  });

  app.post("/api/predictions/:id/vote", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const prediction = storage.votePrediction(id);
    if (!prediction) return res.status(404).json({ error: "Not found" });
    res.json(prediction);
  });

  // === MENU ITEMS (Astro Diner) ===
  app.get("/api/menu-items", (_req, res) => {
    const items = storage.getMenuItems();
    res.json(items);
  });

  app.post("/api/menu-items", (req, res) => {
    const parsed = insertMenuItemSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const item = storage.createMenuItem(parsed.data);
    res.status(201).json(item);
  });

  app.post("/api/menu-items/:id/vote", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const item = storage.voteMenuItem(id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  });

  // === VISITORS ===
  app.get("/api/visitors", (req, res) => {
    const world = req.query.world as string | undefined;
    const visitors = storage.getRecentVisitors(world);
    res.json(visitors);
  });

  app.post("/api/visitors", (req, res) => {
    const parsed = insertVisitorSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const visitor = storage.logVisitor(parsed.data);
    res.status(201).json(visitor);
  });

  return httpServer;
}
