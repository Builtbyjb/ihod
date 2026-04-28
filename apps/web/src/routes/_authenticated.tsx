import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/hooks/auth";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
// import Header from "@/components/Header";
// import { useLayout } from "@/hooks/useLayout";

function AuthenticatedLayout() {
  const { user } = useAuth();
  // const { title } = useLayout();
  return (
    <SidebarProvider>
      <Sidebar businessname={user?.organizationName} username={user?.username} email={user?.email} />
      <SidebarInset>
        <header className="flex items-center gap-2 ml-4 mt-4">
          <SidebarTrigger />
          <Separator orientation="vertical" />
          {/*<Header title={title} />*/}
        </header>
        <div className="mt-8 mx-auto w-[90%]">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
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
