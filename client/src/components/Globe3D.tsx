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
  const globeEl = useRef<any>(null);
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
            
            // Make polygon borders (country borders) thin and faint, positioned on ground
            if (obj.name?.includes('polygon') || obj.userData?.isPolygon) {
              if (obj.material) {
                obj.material.transparent = true;
                obj.material.opacity = 0.25; // Faint white/gray
                obj.material.color = new THREE.Color(0xffffff);
                obj.material.needsUpdate = true;
              }
              // Position polygon at globe surface (radius = 1)
              if (obj.position) {
                // Ensure polygon is at globe radius
                const currentRadius = obj.position.length();
                if (currentRadius > 0.99 && currentRadius < 1.01) {
                  // Already at surface, but ensure it's exactly at radius 1
                  obj.position.normalize();
                  obj.position.multiplyScalar(1.0);
                }
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

  // Countries with significant desert regions
  const desertCountries = new Set([
    'Algeria', 'Libya', 'Egypt', 'Sudan', 'Chad', 'Niger', 'Mali', 'Mauritania', // Sahara
    'Saudi Arabia', 'United Arab Emirates', 'Oman', 'Yemen', 'Iraq', 'Kuwait', 'Qatar', 'Bahrain', // Arabian
    'Mongolia', 'China', // Gobi, Taklamakan
    'Australia', // Australian deserts
    'Botswana', 'Namibia', 'South Africa', // Kalahari, Namib
    'Chile', 'Peru', // Atacama
    'United States', 'Mexico', // Sonoran, Mojave, Chihuahuan, Great Basin
    'India', 'Pakistan', // Thar
    'Argentina', // Patagonian
    'Turkmenistan', 'Uzbekistan', 'Kazakhstan', // Central Asian deserts
    'Syria', 'Jordan', // Syrian Desert
    'Iran', 'Afghanistan' // Additional desert regions
  ]);

  // Globe with natural ocean shading using actual country borders from GeoJSON
  const earthTextureUrl = useMemo(() => {
    if (typeof document === 'undefined' || countriesData.length === 0) {
      // Fallback for SSR or before countries data loads - solid medium blue
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2048' height='1024'%3E%3Crect width='2048' height='1024' fill='%23002d4d'/%3E%3C/svg%3E";
    }
    
    // Create a canvas-based texture with natural ocean shading
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Base color - medium blue-grey (ocean)
      ctx.fillStyle = '#002d4d';
      ctx.fillRect(0, 0, 2048, 1024);
      
      // Create a separate canvas to draw country polygons for efficient land detection
      const landCanvas = document.createElement('canvas');
      landCanvas.width = 2048;
      landCanvas.height = 1024;
      const landCtx = landCanvas.getContext('2d');
      
      // Create a map to store country names by color (for later lookup)
      const countryColorMap = new Map<string, string>();
      let colorCounter = 1; // Start at 1, 0 is reserved for ocean/transparent
      
      // Draw all country polygons with unique colors
      if (landCtx) {
        landCtx.clearRect(0, 0, 2048, 1024);
        
        for (const feature of countriesData) {
          const countryName = feature.properties?.NAME || feature.properties?.name || feature.properties?.NAME_LONG || 'Unknown';
          const color = colorCounter++;
          
          // Encode color as RGB: use sequential encoding
          // Distribute across RGB channels to avoid conflicts
          const r = Math.min(255, (color & 0xFF));
          const g = Math.min(255, ((color >> 8) & 0xFF));
          const b = Math.min(255, ((color >> 16) & 0xFF));
          const colorKey = `${r},${g},${b}`;
          countryColorMap.set(colorKey, countryName);
          
          landCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          landCtx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
          
          const { type, coordinates } = feature.geometry;
          
          // Draw polygon
          if (type === 'Polygon') {
            coordinates.forEach((ring: number[][], ringIndex: number) => {
              landCtx.beginPath();
              ring.forEach((coord: number[], pointIndex: number) => {
                const [lng, lat] = coord;
                const x = ((lng + 180) / 360) * 2048;
                const y = ((90 - lat) / 180) * 1024;
                if (pointIndex === 0) {
                  landCtx.moveTo(x, y);
                } else {
                  landCtx.lineTo(x, y);
                }
              });
              landCtx.closePath();
              if (ringIndex === 0) {
                landCtx.fill(); // Fill exterior ring
              }
            });
          } else if (type === 'MultiPolygon') {
            coordinates.forEach((polygon: number[][][]) => {
              polygon.forEach((ring: number[][], ringIndex: number) => {
                landCtx.beginPath();
                ring.forEach((coord: number[], pointIndex: number) => {
                  const [lng, lat] = coord;
                  const x = ((lng + 180) / 360) * 2048;
                  const y = ((90 - lat) / 180) * 1024;
                  if (pointIndex === 0) {
                    landCtx.moveTo(x, y);
                  } else {
                    landCtx.lineTo(x, y);
                  }
                });
                landCtx.closePath();
                if (ringIndex === 0) {
                  landCtx.fill(); // Fill exterior ring
                }
              });
            });
          }
        }
      }
      
      // Get the land mask image data
      const landImageData = landCtx?.getImageData(0, 0, 2048, 1024);
      
      // Create depth-based shading: deep seas (dark) and shallow areas (light)
      // Use Perlin-like noise pattern for natural variation
      const imageData = ctx.createImageData(2048, 1024);
      const data = imageData.data;
      
      // Helper function to get country name from pixel color in land mask
      const getCountryFromPixel = (x: number, y: number): string | undefined => {
        if (!landImageData) return undefined;
        const idx = (y * 2048 + x) * 4;
        const r = landImageData.data[idx];
        const g = landImageData.data[idx + 1];
        const b = landImageData.data[idx + 2];
        // If pixel is black/transparent (0,0,0), it's ocean
        if (r === 0 && g === 0 && b === 0) return undefined;
        const colorKey = `${r},${g},${b}`;
        return countryColorMap.get(colorKey);
      };
      
      // Helper function to check if coordinates are on land using actual country borders
      const isLandArea = (longitude: number, latitude: number): { isLand: boolean; countryName?: string } => {
        // Convert lat/lng to pixel coordinates
        const x = Math.floor(((longitude + 180) / 360) * 2048);
        const y = Math.floor(((90 - latitude) / 180) * 1024);
        
        // Clamp to valid range
        const px = Math.max(0, Math.min(2047, x));
        const py = Math.max(0, Math.min(1023, y));
        
        const countryName = getCountryFromPixel(px, py);
        return { isLand: countryName !== undefined, countryName };
      };
      
      // Helper function to check if coordinates are in a desert region based on country
      const isDesertRegion = (countryName: string | undefined, longitude: number, latitude: number): boolean => {
        if (!countryName) return false;
        
        // Check if country is known for deserts
        if (desertCountries.has(countryName)) {
          // Additional geographic checks for specific desert regions within countries
          // Sahara region (North Africa)
          if (['Algeria', 'Libya', 'Egypt', 'Sudan', 'Chad', 'Niger', 'Mali', 'Mauritania'].includes(countryName)) {
            if (latitude >= 10 && latitude <= 30 && longitude >= -15 && longitude <= 40) {
              return true;
            }
          }
          // Arabian Peninsula
          if (['Saudi Arabia', 'United Arab Emirates', 'Oman', 'Yemen', 'Iraq', 'Kuwait', 'Qatar', 'Bahrain'].includes(countryName)) {
            if (latitude >= 12 && latitude <= 30 && longitude >= 35 && longitude <= 60) {
              return true;
            }
          }
          // Gobi Desert region
          if (['Mongolia', 'China'].includes(countryName)) {
            if (latitude >= 40 && latitude <= 50 && longitude >= 90 && longitude <= 120) {
              return true;
            }
          }
          // Australian deserts
          if (countryName === 'Australia') {
            if (latitude >= -30 && latitude <= -15 && longitude >= 110 && longitude <= 150) {
              return true;
            }
          }
          // US/Mexico deserts
          if (['United States', 'Mexico'].includes(countryName)) {
            if (latitude >= 25 && latitude <= 40 && longitude >= -120 && longitude <= -100) {
              return true;
            }
          }
          // For other desert countries, assume significant desert coverage
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
          
          // Check if this is on land using actual country borders
          const landCheck = isLandArea(longitude, latitude);
          const isLand = landCheck.isLand;
          const countryName = landCheck.countryName;
          
          // Check if this is a desert region based on country
          const isDesert = isLand && isDesertRegion(countryName, longitude, latitude);
          
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
  }, [countriesData]);

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
            polygonsData={countriesData}
            polygonLabel="properties.NAME"
            polygonAltitude={0} // Set to 0 so borders are on the ground surface
            polygonCapColor={() => "rgba(0, 0, 0, 0)"}
            polygonSideColor={() => "rgba(0, 0, 0, 0)"}
            polygonStrokeColor={() => "rgba(255, 255, 255, 0.25)"} // Faint white/gray
            polygonCapMaterial={(() => {
              const mat = new THREE.MeshStandardMaterial();
              mat.transparent = true;
              mat.opacity = 0;
              return mat;
            })()}
            polygonSideMaterial={(() => {
              const mat = new THREE.MeshStandardMaterial();
              mat.transparent = true;
              mat.opacity = 0;
              return mat;
            })()}
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
