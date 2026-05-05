import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import StatsCards from "@/components/StatsCards";
import RevenueChart from "@/components/RevenueChart";
import StatusChart from "@/components/StatusChart";
import RecentInvoices from "@/components/RecentInvoices";
import { useLayout } from "@/hooks/useLayout";
import type { DashboardStats } from "@/lib/types";
import { InvoiceSchema, InvoiceStatusSchema, TopStatsSchema } from "@/lib/zod-schema";
import * as z from "zod";
import { toast } from "sonner";

const schema = z.object({
  topStats: TopStatsSchema,
  invoiceData: z.array(
    z.object({
      status: InvoiceStatusSchema,
      count: z.number(),
    }),
  ),
  monthlyRevenues: z.array(
    z.object({
      month: z.string(),
      revenue: z.number(),
    }),
  ),
  recentInvoices: z.array(InvoiceSchema),
});

const defaultStats = {
  topStats: { totalClients: 0, totalRevenue: 0, pendingAmount: 0, paidInvoices: 0 },
  invoiceData: [
    { status: "paid", count: 0 },
    { status: "draft", count: 0 },
    { status: "overdue", count: 0 },
    { status: "sent", count: 0 },
  ],
  monthlyRevenues: [
    { month: "Jan", revenue: 0 },
    { month: "Feb", revenue: 0 },
    { month: "Mar", revenue: 0 },
    { month: "Apr", revenue: 0 },
    { month: "May", revenue: 0 },
    { month: "Jun", revenue: 0 },
    { month: "Jul", revenue: 0 },
    { month: "Aug", revenue: 0 },
    { month: "Sep", revenue: 0 },
    { month: "Oct", revenue: 0 },
    { month: "Nov", revenue: 0 },
    { month: "Dec", revenue: 0 },
  ],
  recentInvoices: [],
} as DashboardStats;

const API_URL = import.meta.env.VITE_API_URL;

function RouteComponent() {
  const { setTitle } = useLayout();
  setTitle("Dashboard");
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(defaultStats);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/v1/user/dashboard-stats`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("An error occurred while fetching dashboard statistics");

        const result = await response.json();
        const parsedResult = schema.parse(result);

        setDashboardStats(parsedResult);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching dashboard statistics");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col space-y-6">
      <StatsCards stats={dashboardStats.topStats} isLoading={isLoading} />
      <div className="grid gap-6 lg:grid-cols-3">
        <RevenueChart data={dashboardStats.monthlyRevenues} isLoading={isLoading} />
        <StatusChart data={dashboardStats.invoiceData} isLoading={isLoading} />
      </div>
      <RecentInvoices invoices={dashboardStats.recentInvoices} isLoading={isLoading} />
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
});
