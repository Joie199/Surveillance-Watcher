import { db } from "../server/db";
import { entities } from "@shared/schema";
import { eq } from "drizzle-orm";

// Research network locations from MIT DCI Global
const researchLocations = [
  {
    name: "MIT Digital Currency Initiative",
    category: "Research Network",
    country: "United States",
    latitude: 42.3601,
    longitude: -71.0942,
    description: "MIT DCI is creating a global research network to study Bitcoin and stablecoin use, especially in the global south, build technology capacity, and understand how to better design applications and protocols to empower people to financially flourish.",
    type: "Public",
    headquarters: "Cambridge, MA, United States",
    founded: "2015",
    riskLevel: "Low",
    tags: ["Research", "Education", "Bitcoin", "Digital Currency", "MIT"],
    sourceLinks: ["https://www.dci.mit.edu/posts/new-research-network"],
  },
  {
    name: "University of Brasilia (UnB)",
    category: "Research Network",
    country: "Brazil",
    latitude: -15.7617,
    longitude: -47.8825,
    description: "Partnering with MIT DCI to co-teach Cryptocurrency Design and Engineering course. Part of the DCI Global research network focusing on digital currency education and research in Latin America.",
    type: "Public",
    headquarters: "Brasilia, Brazil",
    founded: "1962",
    riskLevel: "Low",
    tags: ["Research", "Education", "University", "Brazil", "DCI Global"],
    sourceLinks: ["https://www.dci.mit.edu/posts/new-research-network"],
  },
  {
    name: "Lagos Research Hub",
    category: "Research Network",
    country: "Nigeria",
    latitude: 6.5244,
    longitude: 3.3792,
    description: "Rapid adoption of digital currencies is happening in Lagos. Part of the global research network studying real-world usage of Bitcoin and stablecoins in Africa.",
    type: "Public",
    headquarters: "Lagos, Nigeria",
    riskLevel: "Low",
    tags: ["Research", "Africa", "Bitcoin", "Stablecoins", "Digital Currency"],
    sourceLinks: ["https://www.dci.mit.edu/posts/new-research-network"],
  },
  {
    name: "Manila Research Hub",
    category: "Research Network",
    country: "Philippines",
    latitude: 14.5995,
    longitude: 120.9842,
    description: "Rapid adoption of digital currencies is happening in Manila. Part of the global research network studying real-world usage of Bitcoin and stablecoins in Southeast Asia.",
    type: "Public",
    headquarters: "Manila, Philippines",
    riskLevel: "Low",
    tags: ["Research", "Southeast Asia", "Bitcoin", "Stablecoins", "Digital Currency"],
    sourceLinks: ["https://www.dci.mit.edu/posts/new-research-network"],
  },
  {
    name: "Buenos Aires Research Hub",
    category: "Research Network",
    country: "Argentina",
    latitude: -34.6037,
    longitude: -58.3816,
    description: "Rapid adoption of digital currencies is happening in Buenos Aires. Part of the global research network studying real-world usage of Bitcoin and stablecoins in Latin America, particularly for remittances and inflation protection.",
    type: "Public",
    headquarters: "Buenos Aires, Argentina",
    riskLevel: "Low",
    tags: ["Research", "Latin America", "Bitcoin", "Stablecoins", "Remittances"],
    sourceLinks: ["https://www.dci.mit.edu/posts/new-research-network"],
  },
  {
    name: "Vinteum",
    category: "Research Network",
    country: "Brazil",
    latitude: -23.5505,
    longitude: -46.6333,
    description: "Non-profit organization working with MIT DCI to help kickstart collaboration with Brazilian universities. Focused on Bitcoin research and development in Latin America.",
    type: "Public",
    headquarters: "São Paulo, Brazil",
    riskLevel: "Low",
    tags: ["Research", "Non-profit", "Bitcoin", "Brazil", "DCI Global"],
    sourceLinks: ["https://www.dci.mit.edu/posts/new-research-network"],
  },
  {
    name: "Bitcoin Innovation Hub",
    category: "Research Network",
    country: "Uganda",
    latitude: 0.3476,
    longitude: 32.5825,
    description: "Working with Makerere University in Uganda as part of the DCI Global network. Focused on building technology capacity and understanding digital currency adoption in Africa.",
    type: "Public",
    headquarters: "Kampala, Uganda",
    riskLevel: "Low",
    tags: ["Research", "Africa", "Bitcoin", "Education", "DCI Global"],
    sourceLinks: ["https://www.dci.mit.edu/posts/new-research-network"],
  },
  {
    name: "Makerere University",
    category: "Research Network",
    country: "Uganda",
    latitude: 0.3380,
    longitude: 32.5711,
    description: "Partnering with MIT DCI and Bitcoin Innovation Hub as part of the DCI Global research network. Contributing to research on digital currency adoption and financial inclusion in Africa.",
    type: "Public",
    headquarters: "Kampala, Uganda",
    founded: "1922",
    riskLevel: "Low",
    tags: ["Research", "University", "Africa", "Education", "DCI Global"],
    sourceLinks: ["https://www.dci.mit.edu/posts/new-research-network"],
  },
];

async function addResearchPoints() {
  console.log("Adding research network locations to database...");

  try {
    // Check if research points already exist
    const existing = await db.select().from(entities).where(
      eq(entities.category, "Research Network")
    );

    if (existing.length > 0) {
      console.log(`Found ${existing.length} existing research network locations.`);
      console.log("Skipping insertion. Delete existing entries first if you want to re-add them.");
      process.exit(0);
    }

    // Insert research locations
    const inserted = await db.insert(entities).values(researchLocations).returning();
    console.log(`Successfully added ${inserted.length} research network locations:`);
    inserted.forEach((loc) => {
      console.log(`  - ${loc.name} (${loc.headquarters})`);
    });

    console.log("\nResearch network locations added successfully!");
    console.log("You can now view them on the map at http://localhost:5000/map");
    process.exit(0);
  } catch (error) {
    console.error("Error adding research points:", error);
    process.exit(1);
  }
}

addResearchPoints();

