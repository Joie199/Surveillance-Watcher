import { useState } from "react";
import { Header } from "@/components/Header";
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
import { Upload, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function Submit() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    type: "",
    country: "",
    headquarters: "",
    latitude: "",
    longitude: "",
    description: "",
    tags: "",
    riskLevel: "",
    sourceLinks: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Parse tags and source links
      const tags = formData.tags.split(",").map(t => t.trim()).filter(Boolean);
      const sourceLinks = formData.sourceLinks.split("\n").map(l => l.trim()).filter(Boolean);

      const entityData = {
        name: formData.name,
        category: formData.category,
        type: formData.type,
        country: formData.country,
        headquarters: formData.headquarters,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        description: formData.description,
        tags,
        sourceLinks,
        riskLevel: formData.riskLevel,
      };

      const response = await fetch("/api/entities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entityData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit entity");
      }

      setSubmitStatus("success");
      toast({
        title: "Entity submitted successfully",
        description: "Thank you for contributing to SurveillanceWatch.",
      });

      // Reset form
      setFormData({
        name: "",
        category: "",
        type: "",
        country: "",
        headquarters: "",
        latitude: "",
        longitude: "",
        description: "",
        tags: "",
        riskLevel: "",
        sourceLinks: "",
      });
    } catch (error) {
      setSubmitStatus("error");
      toast({
        title: "Submission failed",
        description: "Please check your input and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/30 p-8 md:p-12 mb-8">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
          
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4 text-white">
              Submit <span className="text-primary">Entity</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Help us expand the database by submitting information about surveillance entities, 
              technologies, or organizations. All submissions are reviewed before being added.
            </p>
          </div>
        </div>

        {/* Submission Form */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="font-display">Entity Information</CardTitle>
            <CardDescription>
              Please provide as much information as possible. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Entity Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Company Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vendor">Vendor</SelectItem>
                      <SelectItem value="State">State</SelectItem>
                      <SelectItem value="Activist target">Activist target</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Private">Private</SelectItem>
                      <SelectItem value="Public">Public</SelectItem>
                      <SelectItem value="Government">Government</SelectItem>
                      <SelectItem value="Military">Military</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="riskLevel">Risk Level *</Label>
                  <Select
                    value={formData.riskLevel}
                    onValueChange={(value) => setFormData({ ...formData, riskLevel: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                    placeholder="e.g., United States"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headquarters">Headquarters *</Label>
                  <Input
                    id="headquarters"
                    value={formData.headquarters}
                    onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                    required
                    placeholder="e.g., New York, USA"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude *</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    required
                    placeholder="e.g., 40.7128"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude *</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    required
                    placeholder="e.g., -74.0060"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  placeholder="Provide a detailed description of the entity..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., Facial Recognition, AI, Surveillance"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sourceLinks">Source Links (one per line)</Label>
                <Textarea
                  id="sourceLinks"
                  value={formData.sourceLinks}
                  onChange={(e) => setFormData({ ...formData, sourceLinks: e.target.value })}
                  rows={3}
                  placeholder="https://example.com/source1&#10;https://example.com/source2"
                />
              </div>

              {submitStatus === "success" && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Entity submitted successfully! Thank you for your contribution.
                  </AlertDescription>
                </Alert>
              )}

              {submitStatus === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to submit entity. Please check your input and try again.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Entity
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

