import { sql } from "drizzle-orm";
import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Entities table for surveillance entities
export const entities = sqliteTable("entities", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  category: text("category").notNull(), // State | Vendor | Activist target | etc.
  country: text("country").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  description: text("description").notNull(),
  logo: text("logo"), // URL to logo/image
  tags: text("tags", { mode: "json" }).$type<string[]>().default([]),
  sourceLinks: text("source_links", { mode: "json" }).$type<string[]>().default([]),
  type: text("type").notNull(), // Private | Government | Public | Military
  headquarters: text("headquarters").notNull(),
  founded: text("founded"),
  employees: text("employees"),
  riskLevel: text("risk_level").notNull(), // Low | Medium | High | Critical
});

export const insertEntitySchema = createInsertSchema(entities, {
  name: z.string().min(1),
  category: z.string().min(1),
  country: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  description: z.string().min(1),
  type: z.enum(["Private", "Government", "Public", "Military"]),
  headquarters: z.string().min(1),
  riskLevel: z.enum(["Low", "Medium", "High", "Critical"]),
  tags: z.array(z.string()).default([]),
  sourceLinks: z.array(z.string()).default([]),
}).omit({ id: true });

export type InsertEntity = z.infer<typeof insertEntitySchema>;
export type Entity = typeof entities.$inferSelect;
