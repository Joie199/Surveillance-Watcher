import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { Header } from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "leaflet";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MapPin, Navigation, Layers, Filter, X } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useMemo } from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Entity {
  id: string;
  name: string;
  type: string;
  headquarters: string;
  latitude: number;
  longitude: number;
  description: string;
  tags: string[];
  founded?: string;
  employees?: string;
  riskLevel: string;
  logo?: string;
}

async function fetchEntities(): Promise<Entity[]> {
  const response = await fetch("/api/entities");
  if (!response.ok) {
    throw new Error("Failed to fetch entities");
  }
  return response.json();
}

// Fix for default marker icon in React Leaflet
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerIcon2xPng from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

// Component to handle map updates based on URL params
function MapController({ entities, highlightedId }: { entities: Entity[], highlightedId?: string | null }) {
  const map = useMap();
  const urlParams = new URLSearchParams(window.location.search);
  const entityId = urlParams.get("entity") || highlightedId;

  useEffect(() => {
    if (entityId && entities.length > 0) {
      const entity = entities.find(e => e.id === entityId);
      if (entity) {
        map.setView([entity.latitude, entity.longitude], 8, {
          animate: true,
          duration: 1.5
        });
      }
    }
  }, [entityId, entities, map]);

  return null;
}

export default function MapPage() {
  const [isClient, setIsClient] = useState(false);
  const [showClusters, setShowClusters] = useState(true);
  const [filterRisk, setFilterRisk] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showResearchPoints, setShowResearchPoints] = useState(true);
  
  const { data: allEntities = [], isLoading } = useQuery({
    queryKey: ["entities"],
    queryFn: fetchEntities,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Separate research network entities from regular entities
  const researchEntities = useMemo(() => {
    return allEntities.filter(entity => entity.category === "Research Network");
  }, [allEntities]);

  // Filter entities based on selected filters (excluding research network)
  const filteredEntities = useMemo(() => {
    return allEntities.filter(entity => {
      // Exclude research network from regular filters
      if (entity.category === "Research Network") return false;
      const matchesRisk = filterRisk === "all" || entity.riskLevel === filterRisk;
      const matchesType = filterType === "all" || entity.type === filterType;
      return matchesRisk && matchesType;
    });
  }, [allEntities, filterRisk, filterType]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Critical": return "text-destructive border-destructive/50 bg-destructive/10";
      case "High": return "text-orange-500 border-orange-500/50 bg-orange-500/10";
      case "Medium": return "text-yellow-500 border-yellow-500/50 bg-yellow-500/10";
      default: return "text-primary border-primary/50 bg-primary/10";
    }
  };

  const criticalCount = filteredEntities.filter(e => e.riskLevel === 'Critical').length;

  // Create icon only on client side
  const customIcon = isClient ? new Icon({
    iconUrl: markerIconPng,
    iconRetinaUrl: markerIcon2xPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }) : undefined;

  // Create research network icon (blue/cyan color)
  const researchIcon = isClient ? new Icon({
    iconUrl: markerIconPng,
    iconRetinaUrl: markerIcon2xPng,
    shadowUrl: markerShadowPng,
    iconSize: [30, 41],
    iconAnchor: [15, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: "research-marker"
  }) : undefined;

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading map...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 relative">
        <div className="absolute inset-0 z-0">
          <MapContainer 
            center={[20, 0]} 
            zoom={2.5} 
            scrollWheelZoom={true} 
            className="w-full h-full bg-[#0f172a]"
            zoomControl={false}
          >
            {/* Dark Matter Tiles for that "Surveillance" look */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            <ZoomControl position="bottomright" />
            <MapController entities={[...filteredEntities, ...(showResearchPoints ? researchEntities : [])]} highlightedId={new URLSearchParams(window.location.search).get("entity")} />

            {/* Research Network Markers */}
            {!isLoading && showResearchPoints && researchEntities.length > 0 && (
              <MarkerClusterGroup
                chunkedLoading
                spiderfyOnMaxZoom
                showCoverageOnHover
                zoomToBoundsOnClick
                maxClusterRadius={50}
              >
                {researchEntities.map((entity) => (
                  <Marker 
                    key={entity.id} 
                    position={[entity.latitude, entity.longitude]}
                    icon={researchIcon}
                  >
                    <Popup className="bg-transparent border-none p-0 shadow-none">
                      <div className="w-[300px]">
                        <Card className="bg-card/95 backdrop-blur-md border-cyan-500/30 shadow-2xl">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base font-display">{entity.name}</CardTitle>
                              <Badge variant="outline" className="text-cyan-500 border-cyan-500/50 bg-cyan-500/10">
                                Research
                              </Badge>
                            </div>
                            <CardDescription className="flex items-center gap-1 text-xs">
                              <MapPin className="h-3 w-3" /> {entity.headquarters}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="text-xs text-muted-foreground">
                            <p className="mb-2 line-clamp-3">{entity.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2 mb-3">
                              {entity.tags && entity.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="px-1.5 py-0.5 rounded-sm bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 text-[10px]">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <Link href={`/entities/${entity.id}`}>
                              <Button size="sm" variant="outline" className="w-full text-xs">
                                View Details
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            )}

            {/* Regular Entity Markers */}
            {!isLoading && showClusters ? (
              <MarkerClusterGroup
                chunkedLoading
                spiderfyOnMaxZoom
                showCoverageOnHover
                zoomToBoundsOnClick
              >
                {filteredEntities.map((entity) => (
                  <Marker 
                    key={entity.id} 
                    position={[entity.latitude, entity.longitude]}
                    icon={customIcon}
                  >
                    <Popup className="bg-transparent border-none p-0 shadow-none">
                      <div className="w-[300px]">
                        <Card className="bg-card/95 backdrop-blur-md border-primary/30 shadow-2xl">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base font-display">{entity.name}</CardTitle>
                              <Badge variant="outline" className={getRiskColor(entity.riskLevel)}>
                                {entity.riskLevel}
                              </Badge>
                            </div>
                            <CardDescription className="flex items-center gap-1 text-xs">
                              <MapPin className="h-3 w-3" /> {entity.headquarters}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="text-xs text-muted-foreground">
                            <p className="mb-2 line-clamp-3">{entity.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2 mb-3">
                              {entity.tags && entity.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary border border-primary/20 text-[10px]">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <Link href={`/entities/${entity.id}`}>
                              <Button size="sm" variant="outline" className="w-full text-xs">
                                View Details
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            ) : (
              !isLoading && filteredEntities.map((entity) => (
                <Marker 
                  key={entity.id} 
                  position={[entity.latitude, entity.longitude]}
                  icon={customIcon}
                >
                  <Popup className="bg-transparent border-none p-0 shadow-none">
                    <div className="w-[300px]">
                      <Card className="bg-card/95 backdrop-blur-md border-primary/30 shadow-2xl">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base font-display">{entity.name}</CardTitle>
                            <Badge variant="outline" className={getRiskColor(entity.riskLevel)}>
                              {entity.riskLevel}
                            </Badge>
                          </div>
                          <CardDescription className="flex items-center gap-1 text-xs">
                            <MapPin className="h-3 w-3" /> {entity.headquarters}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">
                          <p className="mb-2 line-clamp-3">{entity.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2 mb-3">
                            {entity.tags && entity.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary border border-primary/20 text-[10px]">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <Link href={`/entities/${entity.id}`}>
                            <Button size="sm" variant="outline" className="w-full text-xs">
                              View Details
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </div>
                  </Popup>
                </Marker>
              ))
            )}
          </MapContainer>
        </div>

        {/* Overlay UI */}
        <div className="absolute top-6 left-6 z-[1000] pointer-events-none flex flex-col gap-4">
          <Card className="bg-card/80 backdrop-blur-md border-border/50 w-64 pointer-events-auto">
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-mono flex items-center gap-2">
                <Navigation className="h-4 w-4 text-primary animate-pulse" />
                GLOBAL_VIEW: ACTIVE
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4 pt-0">
              <div className="space-y-2 text-xs font-mono text-muted-foreground">
                <div className="flex justify-between">
                  <span>ENTITIES:</span>
                  <span className="text-primary">{filteredEntities.length}</span>
                </div>
                {showResearchPoints && researchEntities.length > 0 && (
                  <div className="flex justify-between">
                    <span>RESEARCH:</span>
                    <span className="text-cyan-500">{researchEntities.length}</span>
                  </div>
                )}
                <div className="h-px bg-border/50 my-2" />
                <div className="flex items-center gap-2 text-orange-500">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{criticalCount} CRITICAL DETECTED</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map Controls */}
          <Card className="bg-card/80 backdrop-blur-md border-border/50 w-64 pointer-events-auto">
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-mono flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  MAP CONTROLS
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pb-3 pt-0 space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="clusters" className="text-xs font-mono">Cluster Markers</Label>
                <Switch
                  id="clusters"
                  checked={showClusters}
                  onCheckedChange={setShowClusters}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="research" className="text-xs font-mono">Research Network</Label>
                <Switch
                  id="research"
                  checked={showResearchPoints}
                  onCheckedChange={setShowResearchPoints}
                />
              </div>
              
              {showFilters && (
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Risk Level</Label>
                    <Select value={filterRisk} onValueChange={setFilterRisk}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Risks</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Type</Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Private">Private</SelectItem>
                        <SelectItem value="Public">Public</SelectItem>
                        <SelectItem value="Government">Government</SelectItem>
                        <SelectItem value="Military">Military</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => {
                      setFilterRisk("all");
                      setFilterType("all");
                    }}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
