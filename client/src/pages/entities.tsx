import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { EntityCard } from "@/components/EntityCard";
import { Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface Entity {
  id: string;
  name: string;
  type: string;
  category: string;
  country: string;
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

async function fetchEntities(filters?: {
  search?: string;
  category?: string;
  country?: string;
  riskLevel?: string;
  type?: string;
}): Promise<Entity[]> {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.category) params.append("category", filters.category);
  if (filters?.country) params.append("country", filters.country);
  if (filters?.riskLevel) params.append("riskLevel", filters.riskLevel);
  if (filters?.type) params.append("type", filters.type);

  const response = await fetch(`/api/entities?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch entities");
  }
  return response.json();
}

const ITEMS_PER_PAGE = 12;

export default function Entities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: allEntities = [], isLoading } = useQuery({
    queryKey: ["entities"],
    queryFn: () => fetchEntities(),
  });

  // Extract unique countries and categories for filter options
  const availableCountries = useMemo(() => {
    const countries = new Set<string>();
    allEntities.forEach(entity => {
      if (entity.country) countries.add(entity.country);
    });
    return Array.from(countries).sort();
  }, [allEntities]);

  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    allEntities.forEach(entity => {
      if (entity.category) categories.add(entity.category);
    });
    return Array.from(categories).sort();
  }, [allEntities]);

  const filteredEntities = useMemo(() => {
    if (!allEntities) return [];
    
    return allEntities.filter(entity => {
      const matchesSearch = 
        !searchTerm ||
        entity.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        entity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entity.tags && entity.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesType = filterType === "all" || entity.type === filterType;
      const matchesRisk = filterRisk === "all" || entity.riskLevel === filterRisk;
      const matchesCountry = filterCountry === "all" || entity.country === filterCountry;
      const matchesCategory = filterCategory === "all" || entity.category === filterCategory;

      return matchesSearch && matchesType && matchesRisk && matchesCountry && matchesCategory;
    });
  }, [allEntities, searchTerm, filterType, filterRisk, filterCountry, filterCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredEntities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedEntities = filteredEntities.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterRisk, filterCountry, filterCategory]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 selection:text-primary-foreground">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">
                Surveillance Entities
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Displaying {filteredEntities.length} of {allEntities.length} organizations
              </p>
            </div>
          </div>

          <FilterBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            filterRisk={filterRisk}
            setFilterRisk={setFilterRisk}
            filterCountry={filterCountry}
            setFilterCountry={setFilterCountry}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            availableCountries={availableCountries}
            availableCategories={availableCategories}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : filteredEntities.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedEntities.map((entity) => (
                  <EntityCard key={entity.id} entity={entity} />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(page);
                                }}
                                isActive={currentPage === page}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border/50 rounded-lg bg-card/20">
              <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                <Wifi className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-display font-medium text-foreground">No entities found</h3>
              <p className="text-muted-foreground mt-2 max-w-xs">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button 
                variant="link" 
                className="mt-4 text-primary"
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                  setFilterRisk("all");
                  setFilterCountry("all");
                  setFilterCategory("all");
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

