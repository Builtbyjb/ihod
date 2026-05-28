import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Pencil, View } from "lucide-react";
import type { Client } from "@/lib/types";
import type { Invoice } from "@shared/lib/types";
import { InvoiceSchema, ClientSchema } from "@shared/lib/zod-schema";
import { DefaultInvoiceTemplate } from "@/components/InvoiceTemplates/DefaultTemplate";
import { calculateSubTotal, calculateTaxAmount, calculateTotalAmount, formatDate } from "@shared/utils/util";
import { formatCurrency, getBadgeVariant } from "@/lib/utils";
import { useAuth } from "@/hooks/auth";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";
import { useLayout } from "@/hooks/useLayout";
import { useFetch } from "@/hooks/useFetch";
import ImagePreview from "@/components/ImagePreview";

function RouteComponent() {
  const { clientId, invoiceId } = Route.useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [logoURL, setLogoURL] = useState<string | null>(null);

  const navigate = useNavigate();
  const router = useRouter();
  const { user } = useAuth();
  const { ref, download, preview } = useDownloadPDF();
  const { doGET } = useFetch();

  const { setTitle } = useLayout();

  useEffect(() => {
    if (invoice?.invoiceNumber) setTitle(invoice.invoiceNumber);
  }, [invoice, setTitle]);

  useEffect(() => {
    (async () => {
      try {
        const response = await doGET(`/api/v1/clients/${clientId}/invoices/${invoiceId}`);
        if (response instanceof Error) throw response;

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);

        const parsedInvoice = InvoiceSchema.parse(result.invoice);
        setInvoice(parsedInvoice);

        const parsedClient = ClientSchema.parse(result.client);
        setClient(parsedClient);

        setLogoURL(result.logoURL);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [clientId, invoiceId, doGET]);

  const handlePreview = async () => {
    const url = await preview();
    if (url) window.open(url, "_blank");
  };

  return (
    <div className="space-y-6 w-full">
      {invoice ? (
        <>
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
              <Button variant="outline" onClick={handlePreview}>
                <View className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button onClick={download}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between mb-4">
                <div className="flex gap-4 items-center">
                  <ImagePreview source={logoURL} />
                  <div>
                    <CardTitle className="text-xl">{invoice.invoiceNumber}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Issued on {formatDate(invoice.issueDate)}</p>
                  </div>
                </div>
                <Badge className={`capitalize text-sm ${getBadgeVariant(invoice.status)}`}>{invoice.status}</Badge>
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
                    <p className="font-semibold">{formatDate(invoice.dueDate)}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{item.description}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.unitPrice, invoice.currency)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.quantity * item.unitPrice, invoice.currency)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {invoice.signature && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Signature</h3>
                    <img src={invoice.signature} alt="User Signature" className="w-full h-16" />
                  </div>
                )}

                {invoice.notes && (
                  <div>
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
                  <span className="text-muted-foreground">Discount ({invoice.discount}%)</span>
                  <span>
                    {formatCurrency(
                      calculateTaxAmount(calculateSubTotal(invoice.items), invoice.discount),
                      invoice.currency,
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({invoice.taxRate}%)</span>
                  <span>
                    {formatCurrency(
                      calculateTaxAmount(calculateSubTotal(invoice.items), invoice.taxRate),
                      invoice.currency,
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-4 border-t border-border">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-medium">
                    {formatCurrency(
                      calculateTotalAmount(invoice.items, invoice.taxRate, invoice.discount),
                      invoice.currency,
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        // TODO: Add loading state
        <div className="p-4 md:p-6 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Invoice not found</h2>
            <p className="text-muted-foreground mb-4">The invoice you&apos;re looking for doesn&apos;t exist.</p>
            <Button onClick={() => navigate({ to: "/clients/$clientId", params: { clientId } })}>
              Back to Invoices
            </Button>
          </div>
        </div>
      )}

      {invoice && (
        <div className="print-section">
          <DefaultInvoiceTemplate
            ref={ref}
            invoice={invoice}
            client={client}
            bussinessname={user?.organizationName}
            logoURL={logoURL}
          />
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/clients/$clientId/invoices/$invoiceId/")({
  component: RouteComponent,
});
