import { type User, type InsertUser, type Entity, type InsertEntity, entities } from "@shared/schema";
import { db } from "./db";
import { eq, like, or, and, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Entity methods
  getEntity(id: string): Promise<Entity | undefined>;
  getEntities(filters?: {
    search?: string;
    category?: string;
    country?: string;
    riskLevel?: string;
    type?: string;
  }): Promise<Entity[]>;
  createEntity(entity: InsertEntity): Promise<Entity>;
  updateEntity(id: string, entity: Partial<InsertEntity>): Promise<Entity | undefined>;
  deleteEntity(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Entity methods using database
  async getEntity(id: string): Promise<Entity | undefined> {
    const result = await db.select().from(entities).where(eq(entities.id, id)).limit(1);
    return result[0];
  }

  async getEntities(filters?: {
    search?: string;
    category?: string;
    country?: string;
    riskLevel?: string;
    type?: string;
  }): Promise<Entity[]> {
    let query = db.select().from(entities);

    const conditions = [];
    
    if (filters?.search) {
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      // SQLite LIKE is case-insensitive, but we'll use LOWER for consistency
      conditions.push(
        or(
          sql`LOWER(${entities.name}) LIKE ${searchTerm}`,
          sql`LOWER(${entities.description}) LIKE ${searchTerm}`,
          sql`LOWER(${entities.headquarters}) LIKE ${searchTerm}`
        )
      );
    }

    if (filters?.category) {
      conditions.push(eq(entities.category, filters.category));
    }

    if (filters?.country) {
      const countryTerm = `%${filters.country.toLowerCase()}%`;
      conditions.push(sql`LOWER(${entities.country}) LIKE ${countryTerm}`);
    }

    if (filters?.riskLevel) {
      conditions.push(eq(entities.riskLevel, filters.riskLevel));
    }

    if (filters?.type) {
      conditions.push(eq(entities.type, filters.type));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    return await query;
  }

  async createEntity(entity: InsertEntity): Promise<Entity> {
    const result = await db.insert(entities).values(entity).returning();
    return result[0];
  }

  async updateEntity(id: string, entity: Partial<InsertEntity>): Promise<Entity | undefined> {
    const result = await db
      .update(entities)
      .set(entity)
      .where(eq(entities.id, id))
      .returning();
    return result[0];
  }

  async deleteEntity(id: string): Promise<boolean> {
    const result = await db.delete(entities).where(eq(entities.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new MemStorage();
