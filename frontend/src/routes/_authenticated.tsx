import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

function AuthenticatedLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}

/*
 * Routes that require a user to be authenticated
 */
export const Route = createFileRoute("/_authenticated")({
  // beforeLoad: ({ context, location }) => {
  //   if (!context.auth.isAuthenticated) {
  //     throw redirect({
  //       to: "/login",
  //       search: {
  //         // Save current location for redirect after login
  //         redirect: location.href,
  //       },
  //     });
  //   }
  // },
  component: AuthenticatedLayout,
});
