import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import InvoicesTable from "@/components/InvoicesTable";
import type { Client, Invoice, InvoiceStatus } from "@/lib/types";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useLayout } from "@/hooks/useLayout";

const API_URL = import.meta.env.VITE_API_URL;
function RouteComponent() {
  const [clientInfo, setClientInfo] = useState<Client>();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const { clientId } = Route.useParams();

  const { setTitle } = useLayout();
  if (clientInfo?.name) setTitle(clientInfo.name);

  const navigate = useNavigate();

  const handleInvoiceDelete = (invoiceId: number) => {
    setInvoices((prev) => prev.filter((i) => i.id !== invoiceId));
  };

  const handleDownload = (invoice: Invoice) => {
    console.log(invoice);
  };

  const handleStatusChange = (invoiceId: number, status: InvoiceStatus) => {
    console.log(invoiceId, status);
  };

  useEffect(() => {
    const handleInvoiceFetch = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/clients/${clientId}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch client");

        const result = await response.json();
        // console.log(result)
        // TODO: Zod validate
        setClientInfo(result.clientInfo);
        setInvoices(result.invoices);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch invoices");
      }
    };

    handleInvoiceFetch();
  }, [clientId]);

  return (
    <div className="flex flex-col min-h-screen">
      {clientInfo && (
        <div>
          <h1>{clientInfo.name}</h1>
          <p>{clientInfo.email}</p>
          <p>{clientInfo.phone}</p>
          <p>{clientInfo.address}</p>
          <p>{clientInfo.city}</p>
          <p>{clientInfo.country}</p>
        </div>
      )}
      <div>
        <Button onClick={() => navigate({ to: "/clients/$clientId/invoices/new", params: { clientId } })}>
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
        <br />
        <InvoicesTable
          clientId={clientId}
          invoices={invoices}
          onDelete={handleInvoiceDelete}
          onStatusChange={handleStatusChange}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/clients/$clientId/")({
  component: RouteComponent,
});
