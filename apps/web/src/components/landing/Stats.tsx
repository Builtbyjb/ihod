export default function Stats() {
  const stats = [
    { value: "$2.4B+", label: "Invoiced through our platform" },
    { value: "50K+", label: "Active users worldwide" },
    { value: "3.5 days", label: "Average time to get paid" },
    { value: "99.9%", label: "Uptime guarantee" },
  ];

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
                {stat.value}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
