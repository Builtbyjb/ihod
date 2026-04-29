import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Pencil, Printer } from "lucide-react";
import { format } from "date-fns";
import type { Client, Invoice } from "@/lib/types";
import { DefaultInvoiceTemplate } from "@/components/InvoiceTemplates/DefaultTemplate";
import { calculateSubTotal, calculateTaxAmount, calculateTotalAmount } from "@/lib/utils";
import { useReactToPrint } from "react-to-print";
import { formatCurrency, getStatusVariant } from "@/lib/utils";
import { useAuth } from "@/hooks/auth";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";

const API_URL = import.meta.env.VITE_API_URL;
function RouteComponent() {
  const { clientId, invoiceId } = Route.useParams();
  const navigate = useNavigate();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const { user } = useAuth();
  const { ref, download } = useDownloadPDF();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/clients/${clientId}/invoices/${invoiceId}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to get invoice");

        // TODO: Zod validate
        const result = await response.json();
        setInvoice(result.invoice);
        setClient(result.client);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [clientId, invoiceId]);

  const handlePrint = useReactToPrint({
    contentRef: ref,
    documentTitle: "Invoice",
  });

  if (!invoice) {
    return (
      <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Invoice not found</h2>
          <p className="text-muted-foreground mb-4">The invoice you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => navigate({ to: "/clients/$clientId", params: { clientId } })}>Back to Invoices</Button>
        </div>
      </main>
    );
  }
  return (
    <main className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={() => router.history.back()} className="w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() =>
              navigate({
                to: "/clients/$clientId/invoices/$invoiceId/edit",
                params: { invoiceId, clientId },
              })
            }
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-3 h-4 w-4" />
            Print
          </Button>
          <Button onClick={download}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{invoice.invoiceNumber}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Issued on {format(new Date(invoice.issueDate), "MMMM d, yyyy")}
              </p>
            </div>
            <Badge className={`capitalize text-sm ${getStatusVariant(invoice.status)}`}>{invoice.status}</Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Bill To</h3>
                <p className="font-semibold">{client?.name}</p>
                <p className="text-sm text-muted-foreground">{client?.email}</p>
                {client?.phone && <p className="text-sm text-muted-foreground">{client.phone}</p>}
                {client?.address && <p className="text-sm text-muted-foreground">{client.address}</p>}
                <p className="text-sm text-muted-foreground">
                  {client?.city}, {client?.country}
                </p>
              </div>
              <div className="sm:text-right">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Due Date</h3>
                <p className="font-semibold">{format(new Date(invoice.dueDate), "MMMM d, yyyy")}</p>
              </div>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice, invoice.currency)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice, invoice.currency)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {invoice.notes && (
              <div className="bg-background p-4 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(calculateSubTotal(invoice.items), invoice.currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax ({invoice.taxRate}%)</span>
              <span>{formatCurrency(calculateTaxAmount(invoice.items, invoice.taxRate), invoice.currency)}</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-border">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold">
                {formatCurrency(calculateTotalAmount(invoice.items, invoice.taxRate), invoice.currency)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div style={{ position: "fixed", top: "-9999px", left: "-9999px", width: "794px" }}>
        <DefaultInvoiceTemplate ref={ref} invoice={invoice} client={client} bussinessname={user?.organizationName} />
      </div>
    </main>
  );
}

export const Route = createFileRoute("/_authenticated/clients/$clientId/invoices/$invoiceId/")({
  component: RouteComponent,
});
