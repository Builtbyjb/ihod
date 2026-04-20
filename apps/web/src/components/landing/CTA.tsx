import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-16 bg-primary/80 text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-balance">
            Ready to get paid faster?
          </h2>
          <p className="mt-4 opacity-90 text-pretty">
            Join 50,000+ freelancers and small businesses who trust IHOD for
            their invoicing needs.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="secondary" className="w-full sm:w-auto px-8">
              Start for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto px-8 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              Schedule a demo
            </Button>
          </div>
          <p className="mt-4 text-sm opacity-70">
            No credit card required · Setup in under 2 minutes
          </p>
        </div>
      </div>
    </section>
  );
}
