import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLayout } from "@/hooks/useLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBadgeVariant, formatDate, formatCurrency } from "@/lib/utils";
import { BadgeInfo, Calendar } from "lucide-react";
import * as z from "zod";
import { useFetch } from "@/hooks/useFetch";
import Banner from "@/components/Banner";

const SubscriptionSchema = z.object({
  id: z.number(),
  planName: z.string(),
  status: z.string(),
  amount: z.object({
    currency: z.string(),
    value: z.number(),
  }),
  subscriptionCode: z.string(),
  emailToken: z.string(),
  nextBillingCycle: z.string(),
});

type Subscription = z.infer<typeof SubscriptionSchema>;

const SubscriptionsSchema = z.array(SubscriptionSchema);

function RouteComponent() {
  const { setTitle } = useLayout();

  useEffect(() => {
    setTitle("Billing");
  }, [setTitle]);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const navigate = useNavigate();
  const { doGET, doPOST } = useFetch();

  useEffect(() => {
    (async () => {
      try {
        const response = await doGET("/api/v1/payments/paystack/subscriptions");
        if (response instanceof Error) throw response;

        const result = await response.json();
        const parsedResult = SubscriptionsSchema.parse(result.data);

        setSubscriptions(parsedResult);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [doGET]);

  const handleDisable = async (subscription: Subscription) => {
    try {
      const response = await doPOST("/api/v1/payments/paystack/subscriptions/disable", {
        subscriptionCode: subscription.subscriptionCode,
        emailToken: subscription.emailToken,
      });
      if (response instanceof Error) throw response;

      if (!response.ok) throw new Error("An error occurred while disabling your subscription");

      setSubscriptions((prev) =>
        prev.map((p) => {
          if (p.id === subscription.id) p.status = "disabled";
          return p;
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleEnable = async (subscription: Subscription) => {
    try {
      const response = await doPOST("/api/v1/payments/paystack/subscriptions/enable", {
        subscriptionCode: subscription.subscriptionCode,
        emailToken: subscription.emailToken,
      });
      if (response instanceof Error) throw response;

      if (!response.ok) throw new Error("An error occurred while enabling your subscription");

      setSubscriptions((prev) =>
        prev.map((p) => {
          if (p.id === subscription.id) p.status = "active";
          return p;
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (subscription: Subscription) => {
    try {
      const response = await doPOST("/api/v1/payments/paystack/subscriptions/update", {
        subscriptionCode: subscription.subscriptionCode,
        emailToken: subscription.emailToken,
      });

      if (response instanceof Error) throw response;

      if (!response.ok) throw new Error("An error occurred while fetching subscription update link");

      const result = await response.json();
      navigate({
        href: result.updateLink,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-8">
      <Banner backgroundColor={"bg-sky-100"} icon={<BadgeInfo />} text={"Coming soon!"} />
      <Card>
        <CardHeader>
          <CardTitle>Upgrade Your Plan</CardTitle>
          <CardDescription>Get access to premium features and priority support</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate({ to: "/settings/billing/subscribe" })}>Subscribe Now</Button>
        </CardContent>
      </Card>
      <div>
        <h1 className="text-xl font-medium mb-4">Your Subscriptions</h1>
        <div className="space-y-6">
          {/*TODO: Add loading skeleton */}
          {subscriptions.length > 0 ? (
            <>
              {subscriptions.map((s) => (
                <Card key={s.id}>
                  <CardHeader>
                    <CardTitle>{s.planName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between mb-4">
                      <div>
                        <Badge className={`${getBadgeVariant(s.status)}`}> {s.status}</Badge>
                        <p className="text-muted-foreground">
                          {formatCurrency(s.amount.value, s.amount.currency)}/month
                        </p>
                        {s.status === "active" && (
                          <span className="text-muted-foreground flex gap-2 items-center justify-center">
                            <Calendar className="w-5 h-5" /> Next billing Date: {formatDate(s.nextBillingCycle)}
                          </span>
                        )}
                      </div>
                      {s.status === "active" ? (
                        <Button variant="destructive" onClick={() => handleDisable(s)}>
                          Disable
                        </Button>
                      ) : (
                        <Button variant="default" onClick={() => handleEnable(s)}>
                          Enable
                        </Button>
                      )}
                    </div>
                    <Button variant="outline" onClick={() => handleUpdate(s)}>
                      Enable
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <div>
              <p>You have no subscriptions. Click on the Subscribe Now button above to subscribe</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/settings/billing/")({
  component: RouteComponent,
});
