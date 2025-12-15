import { useEffect, useRef, useState, useMemo } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import { Header } from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Navigation, Layers, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
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
  riskLevel: string;
  logo?: string;
  category?: string;
  country?: string;
}

async function fetchEntities(): Promise<Entity[]> {
  const response = await fetch("/api/entities");
  if (!response.ok) {
    throw new Error("Failed to fetch entities");
  }
  return response.json();
}

// Generate connections between ALL entities worldwide
function generateArcs(entities: Entity[]): Array<{
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}> {
  const arcs: Array<{
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
  }> = [];

  if (entities.length < 2) return arcs;

  entities.forEach((entity, idx) => {
    const nearbyEntities = entities
      .map((other, otherIdx) => ({
        entity: other,
        idx: otherIdx,
        distance: Math.sqrt(
          Math.pow(entity.latitude - other.latitude, 2) +
          Math.pow(entity.longitude - other.longitude, 2)
        ),
      }))
      .filter((item) => item.idx !== idx && item.distance < 100)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, Math.min(4, Math.floor(Math.random() * 3) + 2));

    nearbyEntities.forEach((target) => {
      if (Math.random() > 0.25) {
        arcs.push({
          startLat: entity.latitude,
          startLng: entity.longitude,
          endLat: target.entity.latitude,
          endLng: target.entity.longitude,
        });
      }
    });
  });

  return arcs;
}

export default function Globe3D() {
  const globeEl = useRef<any>();
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [filterRisk, setFilterRisk] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [showResearchPoints, setShowResearchPoints] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [countriesData, setCountriesData] = useState<any[]>([]);

  const { data: allEntities = [] } = useQuery({
    queryKey: ["entities"],
    queryFn: fetchEntities,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load world countries GeoJSON for continent borders
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(res => res.json())
      .then(data => {
        // Convert GeoJSON to format expected by react-globe.gl
        const polygons = data.features.map((feature: any) => ({
          type: feature.type,
          geometry: feature.geometry,
          properties: feature.properties,
        }));
        setCountriesData(polygons);
      })
      .catch(err => {
        console.error('Error loading countries data:', err);
        // Fallback: use empty array if fetch fails
        setCountriesData([]);
      });
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

  // Setup globe with auto-rotate and material customization
  useEffect(() => {
    if (!globeEl.current || !allEntities.length) return;

    const globe = globeEl.current;

    // Auto-rotate
    try {
      const controls = globe.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.3;
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
      }
    } catch (e) {
      // Controls might not be available immediately
    }

    // Customize globe material - make transparent for wireframe effect
    try {
      const scene = globe.scene();
      if (scene) {
        scene.traverse((obj: any) => {
          if (obj.isMesh && obj.material) {
            // Make ALL globe sphere materials transparent (hide the surface)
            // Check if it's the main globe sphere by looking for SphereGeometry with a texture
            const isGlobeSphere = obj.geometry?.type === 'SphereGeometry' &&
                                  obj.material?.map && // Has texture map
                                  !obj.userData?.type && 
                                  !obj.name?.includes('arc') && 
                                  !obj.name?.includes('point') && 
                                  !obj.name?.includes('graticule') &&
                                  !obj.name?.includes('polygon');
            
            if (isGlobeSphere) {
              // Show blue ocean with slight transparency so borders are visible
              obj.material.transparent = true;
              obj.material.opacity = 0.8; // Blue ocean visible
              obj.material.needsUpdate = true;
            }
            
            // Make graticules (grid lines) visible
            if (obj.name?.includes('graticule') || obj.userData?.isGraticule) {
              obj.material.transparent = true;
              obj.material.opacity = 0.6;
              obj.material.color = new THREE.Color(0xffffff);
              obj.material.needsUpdate = true;
            }
            
            // Make polygon borders (country borders) thin and faint
            if (obj.name?.includes('polygon') || obj.userData?.isPolygon) {
              if (obj.material) {
                obj.material.transparent = true;
                obj.material.opacity = 0.25; // Faint white/gray
                obj.material.color = new THREE.Color(0xffffff);
                obj.material.needsUpdate = true;
              }
              // Make line width thin and uniform
              if (obj.isLine) {
                obj.material.linewidth = 0.5;
                obj.material.needsUpdate = true;
              }
            }
            
            // Arc material - shooting star glow effect (white)
            if (obj.userData?.type === 'arc' || obj.name?.includes('arc')) {
              obj.material.emissive = new THREE.Color(0xffffff); // White glow
              obj.material.emissiveIntensity = 2.5; // Bright white glow
              obj.material.transparent = true;
              obj.material.opacity = 0.95;
              obj.material.needsUpdate = true;
            }
            
            // Remove shadows
            obj.castShadow = false;
            obj.receiveShadow = false;
          }
        });
      }
    } catch (e) {
      // Material customization might not be available immediately
    }

    // Set initial camera position
    globe.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1000);
  }, [allEntities]);

  // Generate dense, uniform starfield background (matching the image style)
  // Dense distribution with thousands of stars, varied sizes and brightness
  const stars = useMemo(() => {
    return Array.from({ length: 15000 }).map((_, i) => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      // Varied sizes: mostly tiny, some medium, few larger
      let size;
      const rand = Math.random();
      if (rand < 0.7) {
        // 70% - tiny faint specks
        size = Math.random() * 0.5 + 0.3;
      } else if (rand < 0.95) {
        // 25% - medium distinct points
        size = Math.random() * 1.2 + 0.8;
      } else {
        // 5% - larger, more brilliant stars
        size = Math.random() * 2 + 1.5;
      }
      
      // Varied brightness: subtle variation
      const opacity = Math.random() * 0.6 + 0.4; // 0.4 to 1.0
      
      return {
        id: i,
        x,
        y,
        size,
        opacity,
      };
    });
  }, []);

  // Globe with natural ocean shading (deep seas dark, shores light, mixed variation)
  // No linear gradient - just natural depth-based shading with variation
  const earthTextureUrl = useMemo(() => {
    if (typeof document === 'undefined') {
      // Fallback for SSR - solid medium blue
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2048' height='1024'%3E%3Crect width='2048' height='1024' fill='%23002d4d'/%3E%3C/svg%3E";
    }
    
    // Create a canvas-based texture with natural ocean shading
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Base color - medium blue-grey
      ctx.fillStyle = '#002d4d';
      ctx.fillRect(0, 0, 2048, 1024);
      
      // Create depth-based shading: deep seas (dark) and shallow areas (light)
      // Use Perlin-like noise pattern for natural variation
      const imageData = ctx.createImageData(2048, 1024);
      const data = imageData.data;
      
      // Helper function to check if coordinates are on land (major continents)
      const isLandArea = (longitude: number, latitude: number): boolean => {
        // Major landmasses - approximate boundaries
        // North America
        if (latitude >= 10 && latitude <= 70 && longitude >= -170 && longitude <= -50) {
          return true;
        }
        // South America
        if (latitude >= -55 && latitude <= 12 && longitude >= -85 && longitude <= -35) {
          return true;
        }
        // Europe
        if (latitude >= 35 && latitude <= 72 && longitude >= -10 && longitude <= 40) {
          return true;
        }
        // Africa
        if (latitude >= -35 && latitude <= 37 && longitude >= -20 && longitude <= 50) {
          return true;
        }
        // Asia
        if (latitude >= 10 && latitude <= 75 && longitude >= 40 && longitude <= 180) {
          return true;
        }
        // Australia
        if (latitude >= -45 && latitude <= -10 && longitude >= 110 && longitude <= 155) {
          return true;
        }
        // Greenland
        if (latitude >= 60 && latitude <= 84 && longitude >= -75 && longitude <= -10) {
          return true;
        }
        // Indonesia/Philippines
        if (latitude >= -10 && latitude <= 20 && longitude >= 95 && longitude <= 145) {
          return true;
        }
        // Japan
        if (latitude >= 24 && latitude <= 46 && longitude >= 123 && longitude <= 146) {
          return true;
        }
        // Madagascar
        if (latitude >= -26 && latitude <= -12 && longitude >= 43 && longitude <= 50) {
          return true;
        }
        // New Zealand
        if (latitude >= -48 && latitude <= -34 && longitude >= 166 && longitude <= 179) {
          return true;
        }
        // Iceland
        if (latitude >= 63 && latitude <= 67 && longitude >= -25 && longitude <= -13) {
          return true;
        }
        // British Isles
        if (latitude >= 50 && latitude <= 61 && longitude >= -10 && longitude <= 2) {
          return true;
        }
        
        return false;
      };
      
      // Helper function to check if coordinates are in a real desert region (land areas)
      const isDesertRegion = (longitude: number, latitude: number): boolean => {
        // Major desert regions based on real-world locations (land areas only)
        // Sahara Desert (North Africa) - largest hot desert
        if (latitude >= 10 && latitude <= 30 && longitude >= -15 && longitude <= 40) {
          return true;
        }
        // Arabian Desert
        if (latitude >= 12 && latitude <= 30 && longitude >= 35 && longitude <= 60) {
          return true;
        }
        // Gobi Desert (Mongolia/China)
        if (latitude >= 40 && latitude <= 50 && longitude >= 90 && longitude <= 120) {
          return true;
        }
        // Australian Outback/Deserts
        if (latitude >= -30 && latitude <= -15 && longitude >= 110 && longitude <= 150) {
          return true;
        }
        // Kalahari Desert (Southern Africa)
        if (latitude >= -25 && latitude <= -20 && longitude >= 19 && longitude <= 25) {
          return true;
        }
        // Atacama Desert (South America)
        if (latitude >= -30 && latitude <= -15 && longitude >= -75 && longitude <= -70) {
          return true;
        }
        // Sonoran/Mojave Deserts (North America)
        if (latitude >= 25 && latitude <= 40 && longitude >= -120 && longitude <= -110) {
          return true;
        }
        // Thar Desert (India/Pakistan)
        if (latitude >= 24 && latitude <= 30 && longitude >= 68 && longitude <= 75) {
          return true;
        }
        // Patagonian Desert (South America)
        if (latitude >= -50 && latitude <= -40 && longitude >= -75 && longitude <= -65) {
          return true;
        }
        // Namib Desert (Southwest Africa)
        if (latitude >= -25 && latitude <= -15 && longitude >= 12 && longitude <= 20) {
          return true;
        }
        // Taklamakan Desert (China)
        if (latitude >= 37 && latitude <= 42 && longitude >= 75 && longitude <= 90) {
          return true;
        }
        // Karakum Desert (Turkmenistan)
        if (latitude >= 37 && latitude <= 42 && longitude >= 55 && longitude <= 65) {
          return true;
        }
        // Syrian Desert
        if (latitude >= 32 && latitude <= 37 && longitude >= 37 && longitude <= 42) {
          return true;
        }
        // Great Basin Desert (North America)
        if (latitude >= 35 && latitude <= 42 && longitude >= -120 && longitude <= -110) {
          return true;
        }
        // Chihuahuan Desert (North America)
        if (latitude >= 25 && latitude <= 35 && longitude >= -110 && longitude <= -100) {
          return true;
        }
        
        return false;
      };
      
      for (let y = 0; y < 1024; y++) {
        for (let x = 0; x < 2048; x++) {
          const idx = (y * 2048 + x) * 4;
          
          // Convert pixel coordinates to longitude/latitude
          // x: 0-2048 maps to longitude -180 to 180
          // y: 0-1024 maps to latitude 90 to -90
          const longitude = (x / 2048) * 360 - 180;
          const latitude = 90 - (y / 1024) * 180;
          
          // Check if this is on land
          const isLand = isLandArea(longitude, latitude);
          // Check if this is a desert region (land area)
          const isDesert = isLand && isDesertRegion(longitude, latitude);
          
          if (isDesert) {
            // Desert tones: natural tans, beiges, sandy colors
            // Colors: #d4a574 (tan), #c19a6b (sandy brown), #b8956a (desert sand), #a0825d (darker tan)
            const desertVariation = Math.sin(x * 0.02) * Math.cos(y * 0.02) * 0.3;
            const desertTone = (desertVariation + 1) / 2; // 0-1
            
            // Natural desert color range
            const r = Math.floor(160 + desertTone * 40);  // 160-200 (tan range)
            const g = Math.floor(130 + desertTone * 30); // 130-160
            const b = Math.floor(90 + desertTone * 25);   // 90-115
            
            data[idx] = r;     // R
            data[idx + 1] = g; // G
            data[idx + 2] = b; // B
            data[idx + 3] = 255; // A
          } else if (isLand) {
            // Land areas (non-desert) - gray and green tones
            // Natural variation for forests, grasslands, etc.
            const landVariation = Math.sin(x * 0.015) * Math.cos(y * 0.015) * 0.4;
            const landTone = (landVariation + 1) / 2; // 0-1
            
            // Mix of gray and green: gray-greens, forest greens, muted greens
            // Colors range from gray (#808080) to green (#4a6741) to darker green (#2d4a2d)
            let r, g, b;
            if (landTone < 0.4) {
              // More gray tones
              const t = landTone / 0.4;
              r = Math.floor(100 + t * 30);   // 100-130 (gray range)
              g = Math.floor(100 + t * 35);   // 100-135
              b = Math.floor(90 + t * 25);    // 90-115
            } else if (landTone < 0.7) {
              // Gray-green transition
              const t = (landTone - 0.4) / 0.3;
              r = Math.floor(130 - t * 40);   // 130-90
              g = Math.floor(135 + t * 30);   // 135-165 (more green)
              b = Math.floor(115 - t * 20);   // 115-95
            } else {
              // More green tones
              const t = (landTone - 0.7) / 0.3;
              r = Math.floor(90 - t * 30);    // 90-60 (darker green)
              g = Math.floor(165 - t * 50);   // 165-115 (forest green)
              b = Math.floor(95 - t * 30);    // 95-65
            }
            
            data[idx] = r;     // R
            data[idx + 1] = g; // G
            data[idx + 2] = b; // B
            data[idx + 3] = 255; // A
          } else {
            // Ocean areas - create natural depth variation
            let depth = 0;
            depth += Math.sin(x * 0.01) * Math.cos(y * 0.01) * 0.3;
            depth += Math.sin(x * 0.03) * Math.cos(y * 0.03) * 0.2;
            depth += Math.sin(x * 0.05) * Math.cos(y * 0.05) * 0.1;
            depth += (Math.random() - 0.5) * 0.2; // Random variation
            
            // Normalize depth to 0-1 range
            depth = (depth + 1) / 2;
            
            // Deep seas: dark blue-grey (#001a33 to #002d4d)
            // Shallow areas: lighter grey-blue (#2d5a87 to #4a6fa5)
            let r, g, b;
            if (depth < 0.4) {
              // Deep sea - darker
              const t = depth / 0.4;
              r = Math.floor(0 + t * 13);      // 0-13
              g = Math.floor(26 + t * 21);     // 26-47
              b = Math.floor(51 + t * 29);     // 51-80
            } else if (depth < 0.7) {
              // Medium depth
              const t = (depth - 0.4) / 0.3;
              r = Math.floor(13 + t * 32);     // 13-45
              g = Math.floor(47 + t * 43);     // 47-90
              b = Math.floor(80 + t * 55);     // 80-135
            } else {
              // Shallow - lighter
              const t = (depth - 0.7) / 0.3;
              r = Math.floor(45 + t * 29);     // 45-74
              g = Math.floor(90 + t * 43);     // 90-133
              b = Math.floor(135 + t * 30);    // 135-165
            }
            
            data[idx] = r;     // R
            data[idx + 1] = g; // G
            data[idx + 2] = b; // B
            data[idx + 3] = 255; // A
          }
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      // Add subtle radial gradients for additional natural variation
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const radius = 150 + Math.random() * 250;
        const isDeep = Math.random() > 0.5;
        
        const radialGrad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        if (isDeep) {
          // Deep sea patches - darker
          radialGrad.addColorStop(0, 'rgba(0, 26, 51, 0.4)');
          radialGrad.addColorStop(1, 'transparent');
        } else {
          // Shallow patches - lighter
          radialGrad.addColorStop(0, 'rgba(45, 90, 135, 0.3)');
          radialGrad.addColorStop(1, 'transparent');
        }
        ctx.fillStyle = radialGrad;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      }
    }
    
    return canvas.toDataURL('image/png');
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading 3D Globe...</div>
        </main>
      </div>
    );
  }

  // Generate arcs from filtered entities + research entities (if enabled)
  const entitiesToShow = [...filteredEntities, ...(showResearchPoints ? researchEntities : [])];
  const arcs = generateArcs(entitiesToShow);
  const criticalCount = filteredEntities.filter((e) => e.riskLevel === "Critical").length;

  // Prepare points - combine filtered and research entities
  const points = entitiesToShow.map((entity) => ({
    lat: entity.latitude,
    lng: entity.longitude,
    size: entity.riskLevel === "Critical" ? 0.6 : entity.riskLevel === "High" ? 0.5 : 0.4,
    color: entity.category === "Research Network"
      ? "#00d4ff" // Cyan for research
      : entity.riskLevel === "Critical"
      ? "#ff006e"
      : entity.riskLevel === "High"
      ? "#ff6b35"
      : entity.riskLevel === "Medium"
      ? "#f7b801"
      : "#00ff00",
    entity: entity,
  }));

  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col font-sans relative overflow-hidden">
      <Header />
      
      <main className="flex-1 relative">
        {/* Dense, Uniform Starfield Background */}
        <div className="absolute inset-0 z-0 bg-black" style={{ pointerEvents: 'none' }}>
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                transform: 'translate(-50%, -50%)',
                boxShadow: star.size > 1.5 
                  ? `0 0 ${star.size * 1.5}px rgba(255, 255, 255, 0.4)` 
                  : "none",
              }}
            />
          ))}
        </div>

        {/* 3D Globe */}
        <div className="absolute inset-0 z-10" style={{ backgroundColor: 'transparent' }}>
          <Globe
            ref={globeEl}
            globeImageUrl={earthTextureUrl}
            showAtmosphere={false}
            showGraticules={true}
            graticuleColor="rgba(255, 255, 255, 0.6)"
            graticuleLabel={() => ""}
            graticuleDashLength={0}
            graticuleDashGap={0}
            polygonsData={countriesData}
            polygonLabel="properties.NAME"
            polygonAltitude={0.01}
            polygonCapColor={() => "rgba(0, 0, 0, 0)"}
            polygonSideColor={() => "rgba(0, 0, 0, 0)"}
            polygonStrokeColor={() => "rgba(255, 255, 255, 0.25)"} // Faint white/gray
            polygonStrokeWidth={0.5} // Thin, uniform stroke width
            polygonCapMaterial={{
              transparent: true,
              opacity: 0,
            }}
            polygonSideMaterial={{
              transparent: true,
              opacity: 0,
            }}
            rendererConfig={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            // Points
            pointsData={points}
            pointColor="color"
            pointRadius="size"
            pointResolution={12}
            pointLabel={(d: any) => d.entity.name}
            onPointClick={(point: any) => {
              setSelectedEntity(point.entity);
            }}
            // Arcs - Shooting star style with white glow
            arcsData={arcs}
            arcStartLat="startLat"
            arcStartLng="startLng"
            arcEndLat="endLat"
            arcEndLng="endLng"
            arcColor={() => "#ffffff"} // Pure white glowing shooting star
            arcAltitude={0.15}
            arcStroke={0.4}
            arcDashLength={0.6}
            arcDashGap={0.15}
            arcDashAnimateTime={2500}
            arcCurveResolution={128}
            backgroundColor="rgba(0,0,0,0)"
            cameraOptions={{
              enableDamping: true,
              dampingFactor: 0.1,
            }}
          />
        </div>

        {/* Overlay UI - Same as 2D map */}
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

          {/* Map Controls - Same as 2D */}
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

          {/* Selected Entity Info */}
          {selectedEntity && (
            <Card className="bg-card/80 backdrop-blur-md border-border/50 w-80 pointer-events-auto shadow-2xl mt-4">
              <CardHeader className="py-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-display">{selectedEntity.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setSelectedEntity(null)}
                  >
                    ×
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {selectedEntity.category === "Research Network" ? (
                    <Badge variant="outline" className="text-cyan-500 border-cyan-500/50 bg-cyan-500/10">
                      Research
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className={
                        selectedEntity.riskLevel === "Critical"
                          ? "text-destructive border-destructive/50 bg-destructive/10"
                          : selectedEntity.riskLevel === "High"
                          ? "text-orange-500 border-orange-500/50 bg-orange-500/10"
                          : selectedEntity.riskLevel === "Medium"
                          ? "text-yellow-500 border-yellow-500/50 bg-yellow-500/10"
                          : "text-primary border-primary/50 bg-primary/10"
                      }
                    >
                      {selectedEntity.riskLevel}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">{selectedEntity.type}</span>
                </div>
              </CardHeader>
              <CardContent className="pb-4 pt-0">
                <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
                  {selectedEntity.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {selectedEntity.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary border border-primary/20 text-[10px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href={`/entities/${selectedEntity.id}`}>
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
