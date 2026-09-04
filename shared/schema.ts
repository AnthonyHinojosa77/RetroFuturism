import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Postcards from Space Tourism world
export const postcards = sqliteTable("postcards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  visitorName: text("visitor_name").notNull(),
  destination: text("destination").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertPostcardSchema = createInsertSchema(postcards).omit({ id: true });
export type InsertPostcard = z.infer<typeof insertPostcardSchema>;
export type Postcard = typeof postcards.$inferSelect;

// Time Capsule predictions from World's Fair
export const predictions = sqliteTable("predictions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  visitorName: text("visitor_name").notNull(),
  prediction: text("prediction").notNull(),
  votes: integer("votes").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({ id: true, votes: true });
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type Prediction = typeof predictions.$inferSelect;

// Community menu items from Astro Diner
export const menuItems = sqliteTable("menu_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  visitorName: text("visitor_name").notNull(),
  dishName: text("dish_name").notNull(),
  description: text("description").notNull(),
  votes: integer("votes").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({ id: true, votes: true });
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;

// Visitor log — tracks who visited which world
export const visitors = sqliteTable("visitors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  visitorId: text("visitor_id").notNull(),
  visitorName: text("visitor_name").notNull(),
  world: text("world").notNull(),
  action: text("action").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertVisitorSchema = createInsertSchema(visitors).omit({ id: true });
export type InsertVisitor = z.infer<typeof insertVisitorSchema>;
export type Visitor = typeof visitors.$inferSelect;
