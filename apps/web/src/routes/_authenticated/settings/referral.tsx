import { createFileRoute } from "@tanstack/react-router";

function RouteComponent() {
  return <div>Hello "/_authenticated/settings/referrals"!</div>;
}

export const Route = createFileRoute("/_authenticated/settings/referral")({
  component: RouteComponent,
});
