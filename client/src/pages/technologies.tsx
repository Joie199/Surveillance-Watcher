import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Database, Shield, Eye, Cpu, Network, Camera, Fingerprint, Brain, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

interface Entity {
  id: string;
  name: string;
  tags: string[];
  riskLevel: string;
}

async function fetchEntities(): Promise<Entity[]> {
  const response = await fetch("/api/entities");
  if (!response.ok) {
    throw new Error("Failed to fetch entities");
  }
  return response.json();
}

// Technology categories with icons
const technologyCategories = [
  { name: "Facial Recognition", icon: Eye, color: "text-blue-500" },
  { name: "Biometrics", icon: Fingerprint, color: "text-purple-500" },
  { name: "Big Data Analytics", icon: Database, color: "text-green-500" },
  { name: "AI & Machine Learning", icon: Brain, color: "text-pink-500" },
  { name: "CCTV & Video Surveillance", icon: Camera, color: "text-orange-500" },
  { name: "Network Monitoring", icon: Network, color: "text-cyan-500" },
  { name: "Spyware", icon: Shield, color: "text-red-500" },
  { name: "IoT Devices", icon: Cpu, color: "text-yellow-500" },
  { name: "Social Media Intelligence", icon: Globe, color: "text-indigo-500" },
];

export default function Technologies() {
  const { data: entities = [], isLoading } = useQuery({
    queryKey: ["entities"],
    queryFn: fetchEntities,
  });

  // Extract all unique technologies from entity tags
  const allTechnologies = new Set<string>();
  entities.forEach(entity => {
    entity.tags?.forEach(tag => allTechnologies.add(tag));
  });

  // Group technologies by category
  const technologiesByCategory = technologyCategories.map(category => {
    const matchingTechs = Array.from(allTechnologies).filter(tech =>
      tech.toLowerCase().includes(category.name.toLowerCase().split(" ")[0]) ||
      category.name.toLowerCase().includes(tech.toLowerCase())
    );
    return {
      ...category,
      technologies: matchingTechs.length > 0 ? matchingTechs : [],
    };
  });

  // Get entities using each technology
  const getEntitiesForTech = (tech: string) => {
    return entities.filter(entity => entity.tags?.includes(tech));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 space-y-12">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/30 p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
          
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6 text-white">
              Surveillance <span className="text-primary">Technologies</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore the technologies and capabilities used by surveillance entities worldwide. 
              From facial recognition to network monitoring, understand the tools of digital surveillance.
            </p>
          </div>
        </div>

        {/* Technology Categories */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {technologiesByCategory.map((category) => {
              const Icon = category.icon;
              const categoryTechs = Array.from(allTechnologies).filter(tech => {
                const techLower = tech.toLowerCase();
                const categoryWords = category.name.toLowerCase().split(" ");
                return categoryWords.some(word => techLower.includes(word) || word.includes(techLower.split(" ")[0]));
              });

              if (categoryTechs.length === 0) return null;

              return (
                <Card key={category.name} className="bg-card/50 border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Icon className={`h-6 w-6 ${category.color}`} />
                      <CardTitle className="font-display text-xl">{category.name}</CardTitle>
                    </div>
                    <CardDescription>
                      {categoryTechs.length} technology{categoryTechs.length !== 1 ? "ies" : ""} tracked
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {categoryTechs.map((tech) => {
                        const usingEntities = getEntitiesForTech(tech);
                        return (
                          <Link key={tech} href={`/entities?search=${encodeURIComponent(tech)}`}>
                            <Badge 
                              variant="outline" 
                              className="cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors"
                            >
                              {tech}
                              <span className="ml-2 text-xs opacity-70">
                                ({usingEntities.length})
                              </span>
                            </Badge>
                          </Link>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* All Technologies List */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="font-display text-xl">All Technologies</CardTitle>
                <CardDescription>
                  Complete list of {allTechnologies.size} tracked technologies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Array.from(allTechnologies).sort().map((tech) => {
                    const usingEntities = getEntitiesForTech(tech);
                    return (
                      <Link key={tech} href={`/entities?search=${encodeURIComponent(tech)}`}>
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors"
                        >
                          {tech}
                          <span className="ml-2 text-xs opacity-70">
                            ({usingEntities.length})
                          </span>
                        </Badge>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

