import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useFetch } from "@/hooks/useFetch";
import * as z from "zod";
import { useNavigate } from "@tanstack/react-router";

const planSchema = z.object({
  id: z.number(),
  planCode: z.string(),
  name: z.string(),
  description: z.string(),
  amount: z.number(),
  currency: z.string(),
  interval: z.string(),
  features: z.array(z.string()),
  disabled: z.boolean(),
  featured: z.boolean(),
  cta: z.string(),
});

const plansSchema = z.array(planSchema);

type Plan = z.infer<typeof planSchema>;

export default function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([]);

  const { doGET, doPOST } = useFetch();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await doGET("/api/v1/payments/plans");
        if (response instanceof Error) throw response;

        const result = await response.json();
        const parsedResult = plansSchema.parse(result.plans);
        setPlans(parsedResult);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [doGET]);

  const handleSubscribe = async (plan: Plan) => {
    try {
      const response = await doPOST("/api/v1/payments/subscribe", { planCode: plan.planCode });
      if (response instanceof Error) throw response;

      const result = await response.json();
      console.log(result.data);
      navigate({
        href: result.data.data.authorization_url,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`relative rounded-2xl border p-8 ${
            plan.featured ? "border-primary bg-card shadow-xl scale-105" : "border-border bg-card"
          }`}
        >
          {plan.featured && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
                Most popular
              </span>
            </div>
          )}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
          </div>
          <div className="mb-6">
            <span className="text-3xl font-medium text-foreground">{formatCurrency(plan.amount, plan.currency)}</span>
            {plan.interval && <span className="text-muted-foreground">{plan.interval}</span>}
          </div>
          <ul className="space-y-3 mb-8">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            className="w-full"
            disabled={plan.disabled}
            variant={plan.featured ? "default" : "outline"}
            onClick={() => handleSubscribe(plan)}
          >
            {plan.cta}
          </Button>
        </div>
      ))}
    </div>
  );
}
