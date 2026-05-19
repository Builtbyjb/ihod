import { createFileRoute } from "@tanstack/react-router";
import { useLayout } from "@/hooks/useLayout";
import { useEffect } from "react";
import Banner from "@/components/Banner";
import { BadgeInfo } from "lucide-react";

function RouteComponent() {
  const { setTitle } = useLayout();

  useEffect(() => {
    setTitle("Feedback");
  }, [setTitle]);

  return (
    <>
      <Banner backgroundColor={"bg-sky-100"} icon={<BadgeInfo />} text={"Coming soon!"} />
    </>
  );
}

export const Route = createFileRoute("/_authenticated/settings/feedback")({
  component: RouteComponent,
});
