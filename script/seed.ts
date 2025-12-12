import { db } from "../server/db";
import { entities } from "@shared/schema";
import { mockEntities } from "../client/src/data/mockEntities";

async function seed() {
  console.log("Seeding database...");

  try {
    // Clear existing entities
    await db.delete(entities);
    console.log("Cleared existing entities");

    // Insert mock entities
    const entitiesToInsert = mockEntities.map((entity) => ({
      name: entity.name,
      category: entity.type, // Using type as category for now
      country: entity.headquarters.split(",").pop()?.trim() || "Unknown",
      latitude: entity.coordinates[0],
      longitude: entity.coordinates[1],
      description: entity.description,
      logo: entity.logo,
      tags: entity.tags,
      sourceLinks: [],
      type: entity.type,
      headquarters: entity.headquarters,
      founded: entity.founded,
      employees: entity.employees,
      riskLevel: entity.riskLevel,
    }));

    await db.insert(entities).values(entitiesToInsert);
    console.log(`Inserted ${entitiesToInsert.length} entities`);

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();

