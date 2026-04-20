import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/landing/Hero";
// import Logos from "@/components/landing/Logos";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
// import Stats from "@/components/landing/Stats";
// import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";

export const Route = createFileRoute("/_guest/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div>
        <Hero />
        {/*<Logos />*/}
        <Features />
        <HowItWorks />
        {/*<Stats />*/}
        {/*<Testimonials />*/}
        <CTA />
      </div>
    </>
  );
}
