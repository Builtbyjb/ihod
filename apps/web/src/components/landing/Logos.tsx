export default function Logos() {
  return (
    <section className="py-16 border-y border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground mb-10">
          Trusted by 50,000+ freelancers and small businesses worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {[
            "Freelance Co",
            "Design Studio",
            "Web Agency",
            "Creative Lab",
            "Digital Works",
            "Pixel Perfect",
          ].map((name) => (
            <div
              key={name}
              className="text-xl font-bold text-muted-foreground/50 tracking-tight"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
