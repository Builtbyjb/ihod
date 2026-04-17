import { Zap, Palette, Clock, Shield, Globe, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning fast",
    description:
      "Create professional invoices in under 60 seconds. No complicated setup required.",
  },
  {
    icon: Palette,
    title: "Beautiful templates",
    description:
      "Choose from dozens of professionally designed templates that match your brand.",
  },
  {
    icon: Clock,
    title: "Automatic reminders",
    description:
      "Set it and forget it. Automatic payment reminders help you get paid on time.",
  },
  {
    icon: Shield,
    title: "Secure payments",
    description:
      "Accept credit cards, bank transfers, and more with secure payment processing.",
  },
  {
    icon: Globe,
    title: "Multi-currency",
    description:
      "Bill clients in their local currency. Support for 150+ currencies worldwide.",
  },
  {
    icon: BarChart3,
    title: "Insights & reports",
    description:
      "Track your income, outstanding invoices, and client payment history at a glance.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Features
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
            Everything you need to invoice like a pro
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Powerful features that help you create, send, and track invoices
            effortlessly.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-foreground/20 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
