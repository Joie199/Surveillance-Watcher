import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Header } from "@/components/Header";
import { mockEntities } from "@/data/mockEntities";
import { Icon } from "leaflet";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MapPin, Navigation } from "lucide-react";

// Fix for default marker icon in React Leaflet
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerIcon2xPng from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

// Custom icon setup
const customIcon = new Icon({
  iconUrl: markerIconPng,
  iconRetinaUrl: markerIcon2xPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// A custom "Danger" icon could be created using a DivIcon if we wanted, 
// but for now we'll stick to the standard one or a colored variant if available.

export default function MapPage() {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "Critical": return "text-destructive border-destructive/50 bg-destructive/10";
      case "High": return "text-orange-500 border-orange-500/50 bg-orange-500/10";
      case "Medium": return "text-yellow-500 border-yellow-500/50 bg-yellow-500/10";
      default: return "text-primary border-primary/50 bg-primary/10";
    }
  };

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

            {mockEntities.map((entity) => (
              <Marker 
                key={entity.id} 
                position={entity.coordinates}
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
                        <div className="flex flex-wrap gap-1 mt-2">
                          {entity.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary border border-primary/20 text-[10px]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Overlay UI */}
        <div className="absolute top-6 left-6 z-[1000] pointer-events-none">
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
                  <span>LATITUDE:</span>
                  <span className="text-primary">34.0522° N</span>
                </div>
                <div className="flex justify-between">
                  <span>LONGITUDE:</span>
                  <span className="text-primary">118.2437° W</span>
                </div>
                <div className="flex justify-between">
                  <span>ZOOM_LEVEL:</span>
                  <span className="text-primary">100%</span>
                </div>
                <div className="h-px bg-border/50 my-2" />
                <div className="flex items-center gap-2 text-orange-500">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{mockEntities.filter(e => e.riskLevel === 'Critical').length} CRITICAL ENTITIES DETECTED</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
