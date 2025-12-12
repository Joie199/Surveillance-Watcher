import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Trash2, 
  Edit, 
  Plus, 
  Save, 
  X, 
  Shield,
  AlertTriangle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Entity {
  id: string;
  name: string;
  category: string;
  type: string;
  country: string;
  headquarters: string;
  latitude: number;
  longitude: number;
  description: string;
  tags: string[];
  sourceLinks: string[];
  founded?: string;
  employees?: string;
  riskLevel: string;
  logo?: string;
}

async function fetchEntities(): Promise<Entity[]> {
  const response = await fetch("/api/entities");
  if (!response.ok) throw new Error("Failed to fetch entities");
  return response.json();
}

async function deleteEntity(id: string): Promise<void> {
  const response = await fetch(`/api/entities/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete entity");
}

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: entities = [], isLoading } = useQuery({
    queryKey: ["entities"],
    queryFn: fetchEntities,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entities"] });
      toast({
        title: "Entity deleted",
        description: "The entity has been removed from the database.",
      });
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Failed to delete the entity.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this entity?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/30 p-8 md:p-12 mb-8">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4 text-white">
                Admin <span className="text-primary">Panel</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage surveillance entities in the database
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-xs font-mono text-primary">ADMIN MODE</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{entities.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Total Entities</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-destructive">
                {entities.filter(e => e.riskLevel === "Critical").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Critical Risk</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {new Set(entities.map(e => e.country)).size}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Countries</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {new Set(entities.flatMap(e => e.tags || [])).size}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Technologies</p>
            </CardContent>
          </Card>
        </div>

        {/* Entities Table */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-display">Entities Management</CardTitle>
                <CardDescription>
                  View, edit, and delete surveillance entities
                </CardDescription>
              </div>
              <Link href="/submit">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Entity
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading entities...</div>
            ) : entities.length === 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No entities found. <Link href="/submit" className="text-primary hover:underline">Add your first entity</Link>.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entities.map((entity) => (
                      <TableRow key={entity.id}>
                        <TableCell className="font-medium">{entity.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {entity.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{entity.country}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs",
                              entity.riskLevel === "Critical" ? "border-destructive text-destructive" :
                              entity.riskLevel === "High" ? "border-orange-500 text-orange-500" :
                              entity.riskLevel === "Medium" ? "border-yellow-500 text-yellow-500" :
                              "border-primary text-primary"
                            )}
                          >
                            {entity.riskLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link href={`/entities/${entity.id}`}>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(entity.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

