import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₦0",
    description: "Perfect for getting started",
    features: ["Up to 3 invoices per month", "Basic templates", "Email support", "PDF downloads"],
    cta: "Get started for free",
    featured: false,
    disabled: false,
  },
  {
    name: "Pro",
    price: "₦9,870",
    period: "/month",
    description: "For growing businesses",
    features: ["Unlimited invoices", "All premium templates", "Automatic reminders", "Priority support"],
    cta: "Get Pro Plan",
    featured: true,
    disabled: false,
  },
  {
    name: "Team",
    price: "₦39,940",
    period: "/month",
    description: "For teams and agencies",
    features: [
      "Everything in Pro",
      "Up to 5 team members",
      "Team collaboration",
      "Custom branding",
      "Dedicated support",
    ],
    cta: "Contact sales",
    featured: false,
    disabled: true,
  },
];

export default function Pricing() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.name}
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
            <span className="text-4xl font-bold text-foreground">{plan.price}</span>
            {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
          </div>
          <ul className="space-y-3 mb-8">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
          <Button className="w-full" disabled={plan.disabled} variant={plan.featured ? "default" : "outline"}>
            {plan.cta}
          </Button>
        </div>
      ))}
    </div>
  );
}
