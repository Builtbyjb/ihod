import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLayout } from "@/hooks/useLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBadgeVariant } from "@/lib/utils";
import { Calendar } from "lucide-react";
import * as z from "zod";
import { useFetch } from "@/hooks/useFetch";

const SubscriptionSchema = z.object({
  id: z.string(),
  planName: z.string(),
  status: z.string(),
  amount: z.object({
    currency: z.string(),
    value: z.number(),
  }),
  nextBillingCycle: z.string(),
});

type Subscription = z.infer<typeof SubscriptionSchema>;

const SubscriptionsSchema = z.array(SubscriptionSchema);

function RouteComponent() {
  const { setTitle } = useLayout();
  setTitle("Billing");

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const navigate = useNavigate();
  const { doGET } = useFetch();

  useEffect(() => {
    (async () => {
      try {
        const response = await doGET("/api/v1/payments/paystack/subscriptions");
        if (response instanceof Error) throw response;

        const result = await response.json();
        // const parsedResult = SubscriptionsSchema.parse(result);

        // setSubscriptions(parsedResult);
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [doGET]);

  const handleDisable = async (subscription: Subscription) => {
    console.log(subscription);
  };

  const handleEnable = async (subscription: Subscription) => {
    console.log(subscription);
  };

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
          {subscriptions.length > 0 ? (
            <>
              {subscriptions.map((s) => (
                <div className="flex justify-between">
                  <div>
                    <h1 className="text-xl font-medium">{s.planName}</h1>
                    <Badge className={`${getBadgeVariant("green")}`}> {s.status}</Badge>
                    <p className="text-muted-foreground">{s.amount.value}/month</p>
                    <span className="text-muted-foreground flex gap-2 items-center justify-center">
                      <Calendar className="w-5 h-5" /> Next billing: {s.nextBillingCycle}
                    </span>
                  </div>
                  <Button variant="destructive" onClick={() => handleDisable(s)}>
                    Disable
                  </Button>
                </div>
              ))}
            </>
          ) : (
            <div>
              <p>You have no subscriptions. Click on the Subscribe Now button above to subscribe</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/settings/billing/")({
  component: RouteComponent,
});
