import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/Header";
import InvoiceForm from "@/components/InvoiceForm";
import { useClients, useInvoices } from "@/lib/store";
import { Spinner } from "@/components/ui/spinner";
import type { Invoice } from "@/lib/types";

function RouteComponent() {
  const { clients, loading: clientsLoading } = useClients();
  const {
    addInvoice,
    getNextInvoiceNumber,
    loading: invoicesLoading,
  } = useInvoices();

  const handleSubmit = (invoice: Invoice) => {
    addInvoice(invoice);
  };

  if (clientsLoading || invoicesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Create Invoice" />
      <main className="flex-1 p-4 md:p-6">
        <InvoiceForm
          clients={clients}
          invoiceNumber={getNextInvoiceNumber()}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/invoices/new/")({
  component: RouteComponent,
});
