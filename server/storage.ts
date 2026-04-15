import {
  type Postcard, type InsertPostcard, postcards,
  type Prediction, type InsertPrediction, predictions,
  type MenuItem, type InsertMenuItem, menuItems,
  type Visitor, type InsertVisitor, visitors,
} from "@shared/schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, desc, sql } from "drizzle-orm";

const sqlite = new Database("data.db");
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite);

export interface IStorage {
  // Postcards
  getPostcards(): Postcard[];
  createPostcard(postcard: InsertPostcard): Postcard;

  // Predictions
  getPredictions(): Prediction[];
  createPrediction(prediction: InsertPrediction): Prediction;
  votePrediction(id: number): Prediction | undefined;

  // Menu items
  getMenuItems(): MenuItem[];
  createMenuItem(item: InsertMenuItem): MenuItem;
  voteMenuItem(id: number): MenuItem | undefined;

  // Visitors
  getRecentVisitors(world?: string): Visitor[];
  logVisitor(visitor: InsertVisitor): Visitor;
}

export class DatabaseStorage implements IStorage {
  getPostcards(): Postcard[] {
    return db.select().from(postcards).orderBy(desc(postcards.id)).all();
  }

  createPostcard(postcard: InsertPostcard): Postcard {
    return db.insert(postcards).values(postcard).returning().get();
  }

  getPredictions(): Prediction[] {
    return db.select().from(predictions).orderBy(desc(predictions.votes)).all();
  }

  createPrediction(prediction: InsertPrediction): Prediction {
    return db.insert(predictions).values(prediction).returning().get();
  }

  votePrediction(id: number): Prediction | undefined {
    return db.update(predictions)
      .set({ votes: sql`${predictions.votes} + 1` })
      .where(eq(predictions.id, id))
      .returning()
      .get();
  }

  getMenuItems(): MenuItem[] {
    return db.select().from(menuItems).orderBy(desc(menuItems.votes)).all();
  }

  createMenuItem(item: InsertMenuItem): MenuItem {
    return db.insert(menuItems).values(item).returning().get();
  }

  voteMenuItem(id: number): MenuItem | undefined {
    return db.update(menuItems)
      .set({ votes: sql`${menuItems.votes} + 1` })
      .where(eq(menuItems.id, id))
      .returning()
      .get();
  }

  getRecentVisitors(world?: string): Visitor[] {
    if (world) {
      return db.select().from(visitors)
        .where(eq(visitors.world, world))
        .orderBy(desc(visitors.id))
        .limit(20)
        .all();
    }
    return db.select().from(visitors)
      .orderBy(desc(visitors.id))
      .limit(20)
      .all();
  }

  logVisitor(visitor: InsertVisitor): Visitor {
    return db.insert(visitors).values(visitor).returning().get();
  }
}

export const storage = new DatabaseStorage();
