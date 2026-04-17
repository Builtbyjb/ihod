import { createFileRoute, Outlet } from "@tanstack/react-router";

function GuestLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}

/*
 * Routes that do not require a user to be authenticated
 */
export const Route = createFileRoute("/_guest")({
  component: GuestLayout,
});
