import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/hooks/auth";

function AuthenticatedLayout() {
  const { user } = useAuth()
  return (
    <div>
      <Sidebar businessName={user?.organizationName} username={user?.username} />
      <div className="md:pl-64">
        <Outlet />
      </div>
    </div>
  );
}

/*
 * Routes that require a user to be authenticated
 */
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
    const isAuthenticated = context.auth ? await context.auth.authenticate() : false;
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          // Save current location for redirect after login
          redirect: location.href,
        },
      });
    }
  },
  component: AuthenticatedLayout,
});
