import rateLimit from "express-rate-limit";
import type { Request, Response } from "express";

// General API rate limit — 100 requests per 15 min per IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({ error: "Too many requests — slow down, explorer." });
  },
});

// Strict limit for write endpoints — 20 POSTs per 15 min per IP
export const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({ error: "Too many submissions — take a break and explore the worlds." });
  },
});
