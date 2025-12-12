import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Activity, Database, Server, Eye, ArrowRight, Map, Database as DbIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

async function fetchEntitiesCount(): Promise<number> {
  const response = await fetch("/api/entities");
  if (!response.ok) {
    return 0;
  }
  const data = await response.json();
  return Array.isArray(data) ? data.length : 0;
}

export default function Home() {
  const { data: entityCount = 0 } = useQuery({
    queryKey: ["entities-count"],
    queryFn: fetchEntitiesCount,
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 selection:text-primary-foreground">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/30 p-8 md:p-12 mb-8">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-mono text-primary mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              SYSTEM ACTIVE: TRACKING {entityCount} ENTITIES
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4 text-white">
              Who is watching <span className="text-primary">you?</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              A comprehensive open-source database tracking surveillance technology vendors, 
              government contracts, and monitoring capabilities worldwide.
            </p>
            
            <div className="mt-8 flex gap-8 text-xs font-mono text-muted-foreground/70">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-primary/50" />
                <span>24TB INDEXED</span>
              </div>
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-primary/50" />
                <span>99.9% UPTIME</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary/50" />
                <span>LIVE UPDATES</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/entities">
            <Card className="group relative overflow-hidden bg-card/50 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_-10px_rgba(34,197,94,0.3)] backdrop-blur-sm cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <DbIcon className="h-8 w-8 text-primary mb-2" />
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <CardTitle className="font-display text-xl">Browse Entities</CardTitle>
                <CardDescription>
                  Explore our comprehensive database of surveillance technology vendors, 
                  government contracts, and monitoring capabilities.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/map">
            <Card className="group relative overflow-hidden bg-card/50 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_-10px_rgba(34,197,94,0.3)] backdrop-blur-sm cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Map className="h-8 w-8 text-primary mb-2" />
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <CardTitle className="font-display text-xl">Interactive Map</CardTitle>
                <CardDescription>
                  View surveillance entities on an interactive world map with 
                  geographic distribution and location data.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </main>

      <footer className="border-t border-border/40 bg-card/20 mt-12 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-5 w-5 text-primary" />
                <span className="font-display font-bold text-lg">SURVEILLANCE<span className="text-primary">WATCH</span></span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                Dedicated to mapping the global surveillance industry. We believe in transparency, 
                accountability, and the right to privacy in the digital age.
              </p>
            </div>
            <div>
              <h4 className="font-mono text-sm font-semibold mb-4 text-foreground">Database</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Submit Entity</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Access</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Methodology</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Download Data</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-sm font-semibold mb-4 text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Encryption Key</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground font-mono">
              © 2024 Surveillance Watch. Encrypted & Secure.
            </p>
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-muted-foreground">System Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
