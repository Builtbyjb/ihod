import { createRouter } from "@tanstack/react-router";
import NotFound from "@/components/NotFound";

// https://tanstack.com/router/latest/docs/routing/file-based-routing

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFound,
  context: {
    // auth will be passed down from App component
    auth: undefined!,
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
