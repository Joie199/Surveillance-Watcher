import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEntitySchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Entity routes
  // GET /api/entities - List all entities with optional filters
  app.get("/api/entities", async (req, res) => {
    try {
      const { search, category, country, riskLevel, type } = req.query;
      
      const filters = {
        search: search as string | undefined,
        category: category as string | undefined,
        country: country as string | undefined,
        riskLevel: riskLevel as string | undefined,
        type: type as string | undefined,
      };

      const entities = await storage.getEntities(filters);
      res.json(entities);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  });

  // GET /api/entities/:id - Get single entity
  app.get("/api/entities/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const entity = await storage.getEntity(id);
      
      if (!entity) {
        return res.status(404).json({ message: "Entity not found" });
      }
      
      res.json(entity);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  });

  // POST /api/entities - Create new entity
  app.post("/api/entities", async (req, res) => {
    try {
      const validated = insertEntitySchema.parse(req.body);
      const entity = await storage.createEntity(validated);
      res.status(201).json(entity);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  });

  // PUT /api/entities/:id - Update entity
  app.put("/api/entities/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertEntitySchema.partial().parse(req.body);
      const entity = await storage.updateEntity(id, validated);
      
      if (!entity) {
        return res.status(404).json({ message: "Entity not found" });
      }
      
      res.json(entity);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  });

  // DELETE /api/entities/:id - Delete entity
  app.delete("/api/entities/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteEntity(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Entity not found" });
      }
      
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  });

  return httpServer;
}
