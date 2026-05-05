import { useState, useEffect } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Plus, UserCircle, ArrowLeft } from "lucide-react";
import InvoicesTable from "@/components/InvoicesTable";
import type { Client, Invoice } from "@/lib/types";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useLayout } from "@/hooks/useLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const API_URL = import.meta.env.VITE_API_URL;
function RouteComponent() {
  const [clientInfo, setClientInfo] = useState<Client>();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const router = useRouter();

  const { clientId } = Route.useParams();

  const { setTitle } = useLayout();
  if (clientInfo?.name) setTitle(clientInfo.name);

  const navigate = useNavigate();

  const handleInvoiceDelete = (invoiceId: string) => {
    setInvoices((prev) => prev.filter((i) => i.id !== invoiceId));
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
      <Button variant="ghost" onClick={() => router.history.back()} className="w-fit mb-4">
        <ArrowLeft className="mr-2 h-8 w-8" />
        Back
      </Button>
      {clientInfo && (
        <Card className="mb-8">
          <CardHeader className="flex items-center gap-3">
            <UserCircle className="h-6 w-6" />
            <CardTitle>{clientInfo.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Email</p>
                <p className="text-sm mt-0.5 whitespace-pre-line">{clientInfo.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Phone</p>
                <p className="text-sm mt-0.5 whitespace-pre-line">{clientInfo.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Address</p>
                <p className="text-sm mt-0.5 whitespace-pre-line">
                  <span>{clientInfo.address}</span>
                  <br />
                  <span>{clientInfo.city}</span>
                  <br />
                  <span>{clientInfo.country}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <div>
        <Button
          onClick={() => navigate({ to: "/clients/$clientId/invoices/new", params: { clientId } })}
          className="mb-4"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
        <InvoicesTable clientId={clientId} invoices={invoices} onDelete={handleInvoiceDelete} />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/clients/$clientId/")({
  component: RouteComponent,
});
