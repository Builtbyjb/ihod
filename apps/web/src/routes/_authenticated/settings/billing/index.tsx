import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLayout } from "@/hooks/useLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBadgeVariant } from "@/lib/utils";
import { Calendar } from "lucide-react";

function RouteComponent() {
  const { setTitle } = useLayout();
  setTitle("Billing");

  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Upgrade Your Plan</CardTitle>
          <CardDescription>Get access to premium features and priority support</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate({ to: "/settings/billing/subscribe" })}>Subscribe Now</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <div>
              <h1 className="text-xl font-medium">Pro Plan</h1>
              <Badge className={`${getBadgeVariant("green")}`}> Active</Badge>
              <p className="text-muted-foreground">₦ 9,870/month</p>
              <span className="text-muted-foreground flex gap-2 items-center justify-center">
                <Calendar className="w-5 h-5" /> Next billing: 08/11/2028
              </span>
            </div>
            <Button variant="destructive">Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/settings/billing/")({
  component: RouteComponent,
});
