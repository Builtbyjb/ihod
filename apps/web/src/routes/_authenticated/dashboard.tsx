import { createFileRoute } from "@tanstack/react-router";
// import StatsCards from "@/components/StatsCards";
// import RevenueChart from "@/components/RevenueChart";
// import StatusChart from "@/components/StatusChart";
// import RecentInvoices from "@/components/RecentInvoices";
// import { useDashboardStats, getMonthlyRevenue, getInvoicesByStatus} from "@/lib/store";
// import { Spinner } from "@/components/ui/spinner";
import { useLayout } from "@/hooks/useLayout";

function RouteComponent() {
  const { setTitle } = useLayout();
  setTitle("Dashboard");

  return (
    <div className="flex">
      <h1>Coming Soon...</h1>
      {/*<StatsCards stats={stats} />
        <div className="grid gap-6 lg:grid-cols-3">
          <RevenueChart data={monthlyRevenue} />
          <StatusChart data={statusData} />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <RecentInvoices invoices={invoices} />
        </div>*/}
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
});
