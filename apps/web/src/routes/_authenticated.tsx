import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import Sidebar from "@/components/Sidebar";
import { authenticateUser } from "@/lib/utils";

function AuthenticatedLayout() {
  return (
    <>
      <div>
        <Sidebar />
        <div className="md:pl-64">
          <Outlet />
        </div>
      </div>
    </>
  );
}

/*
 * Routes that require a user to be authenticated
 */
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    if (!authenticateUser(context)) {
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
