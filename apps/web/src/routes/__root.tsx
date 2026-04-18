import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "@/components/ui/sonner";
import { type Context } from "@/lib/types";

export const Route = createRootRouteWithContext<Context>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div>
        <Outlet />
        <TanStackRouterDevtools />
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              content: "flex flex-col gap-2",
              toast: "bg-background text-foreground border-border shadow-lg",
              description: "text-muted-foreground",
              actionButton: "bg-primary text-primary-foreground",
              cancelButton: "bg-muted text-muted-foreground",
              success: "text-green-500",
            },
            style: {
              borderRadius: "calc(var(--radius)  + 4px)",
              backgroundColor: "hsl(from var(--accent) h s l / 0.5)",
            },
          }}
          closeButton={false}
        />
      </div>
    </>
  );
}
