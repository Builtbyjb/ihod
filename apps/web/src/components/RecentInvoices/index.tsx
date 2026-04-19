import { Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Invoice } from "@/lib/types";
import { format } from "date-fns";

interface RecentInvoicesProps {
  invoices: Invoice[];
}

export default function RecentInvoices({ invoices }: RecentInvoicesProps) {
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

  const recentInvoices = [...invoices]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>Latest invoice activity</CardDescription>
        </div>
        <Link
          to="/invoices"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{invoice.invoiceNumber}</span>
                  <Badge
                    variant={getStatusVariant(invoice.status)}
                    className="capitalize"
                  >
                    {invoice.status}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {invoice.client.name}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-semibold">
                  {formatCurrency(invoice.total)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(invoice.issueDate), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
