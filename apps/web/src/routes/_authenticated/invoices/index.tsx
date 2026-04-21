import { createFileRoute } from "@tanstack/react-router";
// import { useState } from "react";
// import { Link } from "@tanstack/react-router";
import Header from "@/components/Header";
// import InvoicesTable from "@/components/InvoicesTable";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

function RouteComponent() {
  // const [search, setSearch] = useState("");
  // const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Invoices" />
      <main className="flex-1 p-4 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {/*<div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search invoices..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>*/}
            {/*<Select value={statusFilter} onValueChange={() => setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>*/}
          </div>
          <Button onClick={() => navigate({ to: "/invoices/new" })}>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>

        {/*<InvoicesTable
          invoices={invoices}
          onDelete={deleteInvoice}
          onStatusChange={handleStatusChange}
          onDownload={handleDownload}
        />*/}
      </main>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/invoices/")({
  component: RouteComponent,
});
