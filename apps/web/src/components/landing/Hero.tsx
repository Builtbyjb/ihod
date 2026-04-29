import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex justify-center">
            {/*<div className="inline-flex items-center gap-2 rounded-full bg-accent/70 px-4 py-1.5">
              <Sparkles className="h-4 w-4" />
              <span>New: Recurring invoices</span>
              <ArrowRight className="h-3 w-3" />
            </div>*/}
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            Create invoices in seconds, get paid faster
          </h1>

          <p className="mt-6 leading-relaxed">
            The simplest way to create professional invoices. Designed for freelancers and small businesses who want to
            spend less time on paperwork and more time doing what they love.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="w-full sm:w-auto px-8" onClick={() => navigate({ to: "/signup" })}>
              Start for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <p className="mt-4 text-muted-foreground">
            No credit card required · Free forever for up to 3 invoices/month
          </p>
        </div>

        <div className="mt-16 lg:mt-24">
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-lg border border-border bg-card p-2 shadow-2xl shadow-primary/5">
              <div className="bg-muted/40 sm:p-6 lg:p-8">
                <InvoicePreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InvoicePreview() {
  return (
    <div className="bg-white/70 text-xs shadow-lg p-4 sm:p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-2xl font-bold text-foreground">INVOICE</h3>
          <p className="text-sm text-muted-foreground mt-1">#INV-2024-001</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-foreground">Your Company</p>
          <p className="text-sm text-muted-foreground">hello@yourcompany.com</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Bill to</p>
          <p className="font-medium text-foreground">Acme Corporation</p>
          <p className="text-sm text-muted-foreground">contact@acme.com</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Invoice date</p>
          <p className="font-medium text-foreground">April 17, 2026</p>
          <p className="text-xs uppercase tracking-wide text-muted-foreground mt-3 mb-1">Due date</p>
          <p className="font-medium text-foreground">May 17, 2026</p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="grid grid-cols-12 gap-3 py-3 text-xs uppercase tracking-wide text-muted-foreground">
          <div className="col-span-5">Description</div>
          <div className="col-span-2 text-right">Qty</div>
          <div className="col-span-2 text-right">Rate</div>
          <div className="col-span-2 text-right">Amount</div>
        </div>
        <div className="grid grid-cols-12 gap-3 py-3 border-t border-border">
          <div className="col-span-5 text-foreground">Website Design</div>
          <div className="col-span-2 text-right text-muted-foreground">1</div>
          <div className="col-span-2 text-right text-muted-foreground">$2,500</div>
          <div className="col-span-2 text-right font-medium text-foreground ml-2">$2,500</div>
        </div>
        <div className="grid grid-cols-12 gap-3 py-3 border-t border-border">
          <div className="col-span-5 text-foreground">Development</div>
          <div className="col-span-2 text-right text-muted-foreground">40</div>
          <div className="col-span-2 text-right text-muted-foreground">$150</div>
          <div className="col-span-2 text-right font-medium text-foreground ml-2">$6,000</div>
        </div>
      </div>

      <div className="border-t border-border mt-4 pt-4">
        <div className="flex justify-end">
          <div className="w-48">
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">$8,500</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Tax (10%)</span>
              <span className="text-foreground">$850</span>
            </div>
            <div className="flex justify-between py-2 border-t border-border mt-2 font-bold text-lg">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">$9,350</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
