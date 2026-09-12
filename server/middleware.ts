import rateLimit from "express-rate-limit";
import type { Request, Response, NextFunction } from "express";

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

/**
 * Restrictive CORS for the JSON API.
 *
 * The client is served from the same origin as the API, so cross-origin
 * browser requests are not expected. Requests without an Origin header
 * (same-origin navigations, curl, server-to-server) always pass. Cross-origin
 * browser requests are allowed only when their origin is listed in the
 * CORS_ORIGIN env var (comma-separated allowlist). OPTIONS preflights get a
 * 204 with the appropriate allow headers; disallowed origins get no CORS
 * headers, which makes browsers block the response.
 */
export function corsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const origin = req.headers.origin;
  if (!origin) {
    next();
    return;
  }

  const allowed = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  if (allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  if (req.method === "OPTIONS") {
    res.status(allowed.includes(origin) ? 204 : 403).end();
    return;
  }

  next();
}
