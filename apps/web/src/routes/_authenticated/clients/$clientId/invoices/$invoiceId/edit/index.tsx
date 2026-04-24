import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Header from "@/components/Header";
import InvoiceForm from "@/components/InvoiceForm";
import { Button } from "@/components/ui/button";
import type { Client, Invoice } from "@/lib/types";

const API_URL = import.meta.env.VITE_API_URL;
function RouteComponent() {
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [clientInfo, setClientInfo] = useState<Client | null>(null)

  const navigate = useNavigate();
  const { clientId, invoiceId } = Route.useParams()

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/clients/${clientId}/invoices/${invoiceId}`, {
          method: "GET",
          credentials: "include",
        })

        if (!response.ok) throw new Error("Failed to get invoice")

        // TODO: Zod validate
        const result = await response.json()
        setInvoice(result.invoice)
        setClientInfo(result.client)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [clientId, invoiceId])

  if (!invoice) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Invoice Not Found" />
        <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Invoice not found</h2>
            <p className="text-muted-foreground mb-4">
              The invoice you&apos;re trying to edit doesn&apos;t exist.
            </p>
            <Button onClick={() => navigate({ to: "/clients/$clientId", params: { clientId } })}>
              Back to Invoices
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title={`Edit ${invoice.id}`} />
      <main className="flex-1 p-4 md:p-6">
        <InvoiceForm
          clientInfo={clientInfo}
          existingInvoice={invoice}
          invoiceId={invoiceId}
        />
      </main>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/clients/$clientId/invoices/$invoiceId/edit/")({
  component: RouteComponent,
});
