import { Link } from "wouter";
import { Eye, Shield, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Entities", href: "/entities" },
    { name: "Map", href: "/map" },
    { name: "Technologies", href: "/tech" },
    { name: "Submit Info", href: "/submit" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="relative flex h-8 w-8 items-center justify-center rounded bg-primary/10 border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all">
            <Eye className="h-5 w-5 text-primary animate-pulse-slow" />
            <div className="absolute inset-0 bg-primary/20 blur opacity-0 group-hover:opacity-100 transition-opacity rounded" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg leading-none tracking-tight">
              SURVEILLANCE<span className="text-primary">WATCH</span>
            </span>
            <span className="text-[10px] font-mono text-muted-foreground leading-none tracking-widest mt-0.5">
              GLOBAL MONITORING INDEX
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group cursor-pointer">
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
          <Button variant="default" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs">
            <Shield className="mr-2 h-3.5 w-3.5" />
            Secure Access
          </Button>
        </nav>

        {/* Mobile Nav */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] border-l border-border/50 bg-background/95 backdrop-blur">
            <div className="flex flex-col gap-8 mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-6 w-6 text-primary" />
                <span className="font-display font-bold text-xl">SURVEILLANCE<span className="text-primary">WATCH</span></span>
              </div>
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors flex items-center justify-between border-b border-border/30 pb-2 cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                    <span className="text-xs font-mono opacity-50">0{navLinks.indexOf(link) + 1}</span>
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
