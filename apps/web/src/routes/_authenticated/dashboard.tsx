import { createFileRoute } from "@tanstack/react-router";
import StatsCards from "@/components/StatsCards";
import RevenueChart from "@/components/RevenueChart";
import StatusChart from "@/components/StatusChart";
import RecentInvoices from "@/components/RecentInvoices";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useRevenue } from "@/hooks/useRevenue";
import { useInvoiceData } from "@/hooks/useInvoiceData";
import { useRecentInvoice } from "@/hooks/useRecentInvoice";
import { useLayout } from "@/hooks/useLayout";

function RouteComponent() {
  const { setTitle } = useLayout();
  setTitle("Dashboard");

  const stats = useDashboardStats();
  const revenue = useRevenue();
  const statusData = useInvoiceData();
  const recentInvoices = useRecentInvoice();

  return (
    <div className="flex flex-col space-y-6">
      <StatsCards stats={stats.dashboardStats} isLoading={stats.isLoading} />
      <div className="grid gap-6 lg:grid-cols-3">
        <RevenueChart data={revenue.monthlyRevenues} isLoading={revenue.isLoading} />
        <StatusChart data={statusData.invoiceData} isLoading={statusData.isLoading} />
      </div>
      <RecentInvoices invoices={recentInvoices.recentInvoices} isLoading={recentInvoices.isLoading} />
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
});
