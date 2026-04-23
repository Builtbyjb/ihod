import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Download, Pencil, Send, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import type { Invoice } from "@/lib/types";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "@/components/InvoicePDF";
import { Link } from "@tanstack/react-router";


function RouteComponent() {
  const { clientId, invoiceId } = Route.useParams()
  console.log(clientId, invoiceId)
  const navigate = useNavigate();
  const router = useRouter();

  const invoices: Invoice[] = []


  const invoice = invoices.find((inv) => inv.id.toString() === invoiceId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusVariant = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "default";
      case "sent":
        return "secondary";
      case "draft":
        return "outline";
      case "overdue":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleDownload = async () => {
    if (!invoice) return;
    const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoice.invoiceNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleStatusChange = (status: Invoice["status"]) => {
    if (invoice) {
      // updateInvoice(invoice.id, { status });
      console.log(invoice, status)
    }
  };

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <Spinner className="h-8 w-8" />
  //     </div>
  //   );
  // }

  if (!invoice) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Invoice Not Found" />
        <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Invoice not found</h2>
            <p className="text-muted-foreground mb-4">
              The invoice you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button onClick={() => navigate({ to: "/clients" })}>
              Back to Invoices
            </Button>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header title={invoice.invoiceNumber} />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <Button
            variant="ghost"
            onClick={() => router.history.back()}
            className="w-fit"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex flex-wrap gap-2">
            {invoice.status === "draft" && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange("sent")}
              >
                <Send className="mr-2 h-4 w-4" />
                Mark as Sent
              </Button>
            )}
            {(invoice.status === "sent" || invoice.status === "overdue") && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange("paid")}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Paid
              </Button>
            )}
            <Button variant="outline">
              <Link to="/clients/$clientId/invoices/$invoiceId/edit" params={{ invoiceId, clientId }}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {invoice.invoiceNumber}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Issued on{" "}
                  {format(new Date(invoice.issuedDate), "MMMM d, yyyy")}
                </p>
              </div>
              <Badge
                variant={getStatusVariant(invoice.status)}
                className="capitalize text-sm"
              >
                {invoice.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Bill To
                  </h3>
                  <p className="font-semibold">{invoice.client.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.client.email}
                  </p>
                  {invoice.client.phone && (
                    <p className="text-sm text-muted-foreground">
                      {invoice.client.phone}
                    </p>
                  )}
                  {invoice.client.address && (
                    <p className="text-sm text-muted-foreground">
                      {invoice.client.address}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {invoice.client.city}, {invoice.client.country}
                  </p>
                </div>
                <div className="sm:text-right">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Due Date
                  </h3>
                  <p className="font-semibold">
                    {format(new Date(invoice.dueDate), "MMMM d, yyyy")}
                  </p>
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
                        <TableCell className="font-medium">
                          {item.description}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {invoice.notes && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Notes</h3>
                  <p className="text-sm text-muted-foreground">
                    {invoice.notes}
                  </p>
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
                <span>{formatCurrency(invoice.taxRate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Tax ({invoice.taxRate}%)
                </span>
                <span>{formatCurrency(invoice.taxRate)}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-border">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">
                  {formatCurrency(invoice.taxRate)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/clients/$clientId/invoices/$invoiceId/')({
  component: RouteComponent,
})
