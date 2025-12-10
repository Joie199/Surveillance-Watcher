import { Entity } from "@/data/mockEntities";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { MapPin, Building2, Calendar, Users, AlertTriangle, ShieldAlert, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface EntityCardProps {
  entity: Entity;
}

export function EntityCard({ entity }: EntityCardProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "Critical": return "text-destructive border-destructive/50 bg-destructive/10";
      case "High": return "text-orange-500 border-orange-500/50 bg-orange-500/10";
      case "Medium": return "text-yellow-500 border-yellow-500/50 bg-yellow-500/10";
      default: return "text-primary border-primary/50 bg-primary/10";
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-card/50 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_-10px_rgba(34,197,94,0.3)] backdrop-blur-sm">
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/30 group-hover:border-primary transition-colors" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/30 group-hover:border-primary transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/30 group-hover:border-primary transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/30 group-hover:border-primary transition-colors" />

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="font-display text-xl tracking-wide group-hover:text-primary transition-colors">
              {entity.name}
            </CardTitle>
            <CardDescription className="font-mono text-xs mt-1 text-muted-foreground flex items-center gap-2">
              <span className={cn("px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold border", getRiskColor(entity.riskLevel))}>
                {entity.riskLevel} Risk
              </span>
              <span className="text-muted-foreground/50">|</span>
              <span className="text-primary/80">{entity.type}</span>
            </CardDescription>
          </div>
          {/* Placeholder for logo or icon */}
          <div className="h-10 w-10 rounded bg-muted/30 flex items-center justify-center text-muted-foreground">
            <Building2 className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {entity.description}
        </p>
        
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-primary/70" />
            <span className="truncate">{entity.headquarters}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-primary/70" />
            <span>Est. {entity.founded}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-primary/70" />
            <span>{entity.employees}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-primary/70" />
            <span>Global Ops</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-border/30 flex flex-wrap gap-1.5">
        {entity.tags.map(tag => (
          <Badge 
            key={tag} 
            variant="outline" 
            className="text-[10px] font-mono font-normal text-muted-foreground border-border/50 bg-background/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors cursor-default"
          >
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
}
