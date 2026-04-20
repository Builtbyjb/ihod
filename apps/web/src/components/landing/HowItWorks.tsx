export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Add your details",
      description:
        "Enter your business information once, and we'll save it for all future invoices.",
    },
    {
      step: "02",
      title: "Create your invoice",
      description:
        "Add line items, set due dates, and customize the look with our intuitive editor.",
    },
    {
      step: "03",
      title: "Send & get paid",
      description:
        "Send invoices via email or share a link. Accept payments online instantly.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            How it works
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance">
            Three simple steps to professional invoices
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-px bg-border" />
              )}
              <div className="relative bg-card rounded-2xl border border-border p-8 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
