import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/Header";
// import StatsCards from "@/components/StatsCards";
// import RevenueChart from "@/components/RevenueChart";
// import StatusChart from "@/components/StatusChart";
// import RecentInvoices from "@/components/RecentInvoices";
// import { useDashboardStats, getMonthlyRevenue, getInvoicesByStatus} from "@/lib/store";
// import { Spinner } from "@/components/ui/spinner";

function RouteComponent() {

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Dashboard" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <h1>Coming Soon...</h1>
        {/*<StatsCards stats={stats} />
        <div className="grid gap-6 lg:grid-cols-3">
          <RevenueChart data={monthlyRevenue} />
          <StatusChart data={statusData} />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <RecentInvoices invoices={invoices} />
        </div>*/}
      </main>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
});
