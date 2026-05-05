import { createFileRoute } from "@tanstack/react-router";
import { useLayout } from "@/hooks/useLayout";

function RouteComponent() {
  const { setTitle } = useLayout();
  setTitle("Referrals");

  return <div>Hello "/_authenticated/settings/referrals"!</div>;
}

export const Route = createFileRoute("/_authenticated/settings/referral")({
  component: RouteComponent,
});
