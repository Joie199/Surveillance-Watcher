import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import MapPage from "@/pages/map";
import Entities from "@/pages/entities";
import EntityDetail from "@/pages/entity-detail";
import About from "@/pages/about";
import Technologies from "@/pages/technologies";
import Submit from "@/pages/submit";
import Admin from "@/pages/admin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/entities" component={Entities} />
      <Route path="/entities/:id" component={EntityDetail} />
      <Route path="/map" component={MapPage} />
      <Route path="/tech" component={Technologies} />
      <Route path="/submit" component={Submit} />
      <Route path="/about" component={About} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
