import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";
import { authenticateUser, verifySetupCompleted } from "@/lib/utils";

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
  beforeLoad: async ({ context, location }) => {
    const isAuthenticated = await authenticateUser(context);
    const setupIsCompleted = await verifySetupCompleted()
    if (!isAuthenticated) {
      if (setupIsCompleted) {
        throw redirect({
          to: "/login",
          search: {
            // Save current location for redirect after login
            redirect: location.href,
          },
        });
      } else {
        toast.warning("Profile setup is required");
        throw redirect({
          to: "/setup-profile",
          search: { redirect: location.href },
        })
      }
    }
  },
  component: AuthenticatedLayout,
});
