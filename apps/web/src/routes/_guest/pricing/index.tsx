import { createFileRoute } from "@tanstack/react-router";
import Pricing from "@/components/Pricing";

function RouteComponent() {
  return (
    <section id="pricing" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Pricing</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Start free, upgrade when you need to. No hidden fees, ever.
          </p>
        </div>
        <Pricing />
      </div>
    </section>
  );
}

export const Route = createFileRoute("/_guest/pricing/")({
  component: RouteComponent,
});
