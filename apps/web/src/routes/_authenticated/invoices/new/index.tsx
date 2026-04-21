import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/Header";
import InvoiceForm from "@/components/InvoiceForm";

function RouteComponent() {
  const mockClients = []

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Create Invoice" />
      <main className="flex-1 p-4 md:p-6">
        <InvoiceForm clients={mockClients} />
      </main>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/invoices/new/")({
  component: RouteComponent,
});
