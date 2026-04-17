import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Invoicely has completely transformed how I manage my freelance business. I used to spend hours on invoicing, now it takes minutes.",
    author: "Sarah Chen",
    role: "Freelance Designer",
    avatar: "SC",
  },
  {
    quote:
      "The automatic reminders alone have saved me thousands in unpaid invoices. My clients actually pay on time now!",
    author: "Marcus Johnson",
    role: "Web Developer",
    avatar: "MJ",
  },
  {
    quote:
      "Clean, professional, and incredibly easy to use. My clients always comment on how polished my invoices look.",
    author: "Elena Rodriguez",
    role: "Marketing Consultant",
    avatar: "ER",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
            Loved by freelancers everywhere
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="bg-card rounded-2xl border border-border p-8"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="text-foreground leading-relaxed mb-6">
                &quot;{testimonial.quote}&quot;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
