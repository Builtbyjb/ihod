import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
          }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`,
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Large 404 Number */}
        <div
          className="relative mb-8"
          style={{
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
          }}
        >
          <span className="font-serif text-[12rem] md:text-[16rem] font-bold leading-none tracking-tighter text-primary/10 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-[12rem] md:text-[16rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/60 select-none animate-pulse">
              404
            </span>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4 mb-12">
          <h1 className="font-serif text-3xl md:text-5xl font-semibold text-foreground text-balance">
            Page not found
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto leading-relaxed">
            Looks like you&apos;ve wandered into uncharted territory. The page
            you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="group rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link to="/" className="flex items-center gap-2">
              <Home className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Back to Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="group rounded-full px-8 border-border hover:bg-secondary"
          >
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
