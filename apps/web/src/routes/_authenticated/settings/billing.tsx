import { createFileRoute } from "@tanstack/react-router";

function RouteComponent() {
  return <div>Hello "/_authenticated/settings/billings"!</div>;
}

export const Route = createFileRoute("/_authenticated/settings/billing")({
  component: RouteComponent,
});
