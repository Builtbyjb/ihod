import { createFileRoute } from "@tanstack/react-router";
import Pricing from "@/components/Pricing";
import { useLayout } from "@/hooks/useLayout";

function RouteComponent() {
  const { setTitle } = useLayout();
  setTitle("Subscribe");

  return (
    <div className="mt-10">
      <Pricing />
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/settings/billing/subscribe")({
  component: RouteComponent,
});
