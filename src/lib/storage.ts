import type { VisitorLog, Postcard, Prediction, CommunityDish } from '@/types';

// localStorage-backed client-side "database" so the site runs as a static export
// with no backend. Each collection lives under its own key; entries are sorted
// by createdAt descending on read.

const KEYS = {
  visitorLog: 'ru.visitorLog',
  postcards: 'ru.postcards',
  predictions: 'ru.predictions',
  communityDishes: 'ru.communityDishes',
} as const;

type Collection = 'visitorLog' | 'postcards' | 'predictions' | 'communityDishes';

function readAll<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll<T>(key: string, value: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded etc. — ignore in preview */
  }
}

function newId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function sortDesc<T extends { createdAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

// Visitor log -------------------------------------------------------------

export function getVisitorLogs(limit = 5): VisitorLog[] {
  return sortDesc(readAll<VisitorLog>(KEYS.visitorLog)).slice(0, limit);
}

export function addVisitorLog(input: {
  visitorId: string;
  visitorName: string;
  world: VisitorLog['world'];
  action: string;
}): VisitorLog {
  const entry: VisitorLog = {
    id: newId(),
    visitorId: input.visitorId,
    visitorName: input.visitorName,
    world: input.world,
    action: input.action,
    createdAt: new Date().toISOString(),
  };
  const all = readAll<VisitorLog>(KEYS.visitorLog);
  all.push(entry);
  // Keep at most 100 entries so localStorage doesn't grow unbounded
  const trimmed = sortDesc(all).slice(0, 100);
  writeAll(KEYS.visitorLog, trimmed);
  return entry;
}

// Postcards ---------------------------------------------------------------

export function getPostcards(): Postcard[] {
  return sortDesc(readAll<Postcard>(KEYS.postcards));
}

export function addPostcard(input: {
  visitorName: string;
  destination: string;
  message: string;
}): Postcard {
  const entry: Postcard = {
    id: newId(),
    visitorName: input.visitorName,
    destination: input.destination,
    message: input.message,
    createdAt: new Date().toISOString(),
  };
  const all = readAll<Postcard>(KEYS.postcards);
  all.push(entry);
  writeAll(KEYS.postcards, all);
  return entry;
}

// Predictions -------------------------------------------------------------

export function getPredictions(): Prediction[] {
  return sortDesc(readAll<Prediction>(KEYS.predictions));
}

export function addPrediction(input: {
  visitorName: string;
  prediction: string;
}): Prediction {
  const entry: Prediction = {
    id: newId(),
    visitorName: input.visitorName,
    prediction: input.prediction,
    votes: 0,
    createdAt: new Date().toISOString(),
  };
  const all = readAll<Prediction>(KEYS.predictions);
  all.push(entry);
  writeAll(KEYS.predictions, all);
  return entry;
}

export function incrementPredictionVote(id: string): Prediction | null {
  const all = readAll<Prediction>(KEYS.predictions);
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], votes: all[idx].votes + 1 };
  writeAll(KEYS.predictions, all);
  return all[idx];
}

// Community dishes --------------------------------------------------------

export function getCommunityDishes(): CommunityDish[] {
  return sortDesc(readAll<CommunityDish>(KEYS.communityDishes));
}

export function addCommunityDish(input: {
  visitorName: string;
  dishName: string;
  description: string;
}): CommunityDish {
  const entry: CommunityDish = {
    id: newId(),
    visitorName: input.visitorName,
    dishName: input.dishName,
    description: input.description,
    votes: 0,
    createdAt: new Date().toISOString(),
  };
  const all = readAll<CommunityDish>(KEYS.communityDishes);
  all.push(entry);
  writeAll(KEYS.communityDishes, all);
  return entry;
}

export function incrementDishVote(id: string): CommunityDish | null {
  const all = readAll<CommunityDish>(KEYS.communityDishes);
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], votes: all[idx].votes + 1 };
  writeAll(KEYS.communityDishes, all);
  return all[idx];
}

export const _debug = { KEYS };
export type { Collection };
