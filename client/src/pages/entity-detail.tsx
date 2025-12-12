import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Building2, 
  Calendar, 
  Users, 
  AlertTriangle, 
  Globe, 
  ExternalLink,
  ArrowLeft,
  Map,
  Clock,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Entity {
  id: string;
  name: string;
  category: string;
  country: string;
  latitude: number;
  longitude: number;
  description: string;
  logo?: string;
  tags: string[];
  sourceLinks: string[];
  type: string;
  headquarters: string;
  founded?: string;
  employees?: string;
  riskLevel: string;
}

async function fetchEntity(id: string): Promise<Entity> {
  const response = await fetch(`/api/entities/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch entity");
  }
  return response.json();
}

export default function EntityDetail() {
  const [, params] = useRoute("/entities/:id");
  const entityId = params?.id;

  const { data: entity, isLoading, error } = useQuery({
    queryKey: ["entity", entityId],
    queryFn: () => fetchEntity(entityId!),
    enabled: !!entityId,
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Critical": return "text-destructive border-destructive/50 bg-destructive/10";
      case "High": return "text-orange-500 border-orange-500/50 bg-orange-500/10";
      case "Medium": return "text-yellow-500 border-yellow-500/50 bg-yellow-500/10";
      default: return "text-primary border-primary/50 bg-primary/10";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }

  if (error || !entity) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h2 className="text-2xl font-display font-semibold mb-2">Entity Not Found</h2>
                <p className="text-muted-foreground mb-4">
                  The entity you're looking for doesn't exist or has been removed.
                </p>
                <Link href="/">
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Entities
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Entities
          </Button>
        </Link>

        {/* Header Section */}
        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/30 p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-lg bg-muted/30 flex items-center justify-center border border-border/50">
                {entity.logo ? (
                  <img src={entity.logo} alt={entity.name} className="h-full w-full object-contain rounded-lg" />
                ) : (
                  <Building2 className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-2 text-white">
                    {entity.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge variant="outline" className={cn("font-mono text-xs uppercase tracking-wider font-bold border", getRiskColor(entity.riskLevel))}>
                      {entity.riskLevel} Risk
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs">
                      {entity.type}
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs">
                      {entity.category}
                    </Badge>
                  </div>
                </div>
                <Link href={`/map?entity=${entity.id}`}>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Map className="mr-2 h-4 w-4" />
                    View on Map
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary/70" />
                  <span>{entity.headquarters}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary/70" />
                  <span>{entity.country}</span>
                </div>
                {entity.founded && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary/70" />
                    <span>Est. {entity.founded}</span>
                  </div>
                )}
                {entity.employees && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary/70" />
                    <span>{entity.employees}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="font-display">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {entity.description}
            </p>
          </CardContent>
        </Card>

        {/* Timeline / History */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Timeline & History
            </CardTitle>
            <CardDescription>Key events and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border/50" />
              
              <div className="space-y-6">
                {entity.founded && (
                  <div className="relative pl-12">
                    <div className="absolute left-2 top-1 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary/70" />
                        <span className="font-mono text-sm font-semibold text-foreground">{entity.founded}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Entity founded</p>
                    </div>
                  </div>
                )}
                
                <div className="relative pl-12">
                  <div className="absolute left-2 top-1 h-4 w-4 rounded-full bg-primary/50 border-4 border-background" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary/70" />
                      <span className="font-mono text-sm font-semibold text-foreground">Present</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Currently active with {entity.employees || "unknown"} employees
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {entity.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {entity.category}
                      </Badge>
                      <Badge variant="outline" className={cn("text-xs", 
                        entity.riskLevel === "Critical" ? "border-destructive/50 text-destructive" :
                        entity.riskLevel === "High" ? "border-orange-500/50 text-orange-500" :
                        entity.riskLevel === "Medium" ? "border-yellow-500/50 text-yellow-500" :
                        "border-primary/50 text-primary"
                      )}>
                        {entity.riskLevel} Risk
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        {entity.tags && entity.tags.length > 0 && (
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="font-display">Tags & Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {entity.tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="text-xs font-mono font-normal text-muted-foreground border-border/50 bg-background/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Source Links */}
        {entity.sourceLinks && entity.sourceLinks.length > 0 && (
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="font-display">Sources & References</CardTitle>
              <CardDescription>External links and documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {entity.sourceLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded hover:bg-primary/10 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="truncate">{link}</span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Coordinates Info */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="font-display">Location Data</CardTitle>
            <CardDescription>Geographic coordinates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm font-mono">
              <div>
                <span className="text-muted-foreground">Latitude:</span>
                <span className="ml-2 text-primary">{entity.latitude.toFixed(4)}°</span>
              </div>
              <div>
                <span className="text-muted-foreground">Longitude:</span>
                <span className="ml-2 text-primary">{entity.longitude.toFixed(4)}°</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

