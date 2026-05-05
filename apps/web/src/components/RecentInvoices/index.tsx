import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Invoice } from "@/lib/types";
import { format } from "date-fns";
import { formatCurrency, getStatusVariant, calculateTotalAmount } from "@/lib/utils";
import { SkeletonBarChart } from "@/components/Skeleton";

interface RecentInvoicesProps {
  invoices: Invoice[];
  isLoading: boolean;
}

export default function RecentInvoices({ invoices, isLoading }: RecentInvoicesProps) {
  const navigate = useNavigate();

  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>Latest invoice activity</CardDescription>
        </div>
        <Button variant="outline" onClick={() => navigate({ to: "/clients" })}>
          View all
        </Button>
      </CardHeader>
      <CardContent>
        {!isLoading ? (
          <div className="space-y-4">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{invoice.id}</span>
                    <Badge className={`${getStatusVariant(invoice.status)} capitalize`}>{invoice.status}</Badge>
                  </div>
                  {/*<span className="text-sm text-muted-foreground">{invoice.client.name}</span>*/}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-semibold">
                    {formatCurrency(calculateTotalAmount(invoice.items, invoice.taxRate))}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(invoice.issueDate), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <SkeletonBarChart />
        )}
      </CardContent>
    </Card>
  );
}
