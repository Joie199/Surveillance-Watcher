import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, SlidersHorizontal, Map, Database, ShieldAlert } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  filterRisk: string;
  setFilterRisk: (risk: string) => void;
}

export function FilterBar({ 
  searchTerm, 
  setSearchTerm, 
  filterType, 
  setFilterType,
  filterRisk,
  setFilterRisk
}: FilterBarProps) {
  return (
    <div className="w-full space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-4 p-4 rounded-lg bg-card/30 border border-border/50 backdrop-blur-sm">
      <div className="relative flex-1 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search entities, technologies, or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/50 focus-visible:border-primary/50 font-mono text-sm h-10 transition-all"
        />
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[140px] bg-background/50 border-border/50 h-10 font-mono text-xs">
            <Database className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Private">Private</SelectItem>
            <SelectItem value="Public">Public</SelectItem>
            <SelectItem value="Government">Government</SelectItem>
            <SelectItem value="Military">Military</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterRisk} onValueChange={setFilterRisk}>
          <SelectTrigger className="w-[140px] bg-background/50 border-border/50 h-10 font-mono text-xs">
            <ShieldAlert className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue placeholder="All Risks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risks</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 border-border/50 bg-background/50 hover:bg-primary/10 hover:text-primary hover:border-primary/50">
          <Map className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 border-border/50 bg-background/50 hover:bg-primary/10 hover:text-primary hover:border-primary/50">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
