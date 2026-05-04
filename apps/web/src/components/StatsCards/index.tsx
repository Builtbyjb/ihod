import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, Clock, Users } from "lucide-react";
import type { DashboardStats } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { SkeletonCard } from "@/components/Skeleton";

interface StatsCardsProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

const STATS_ERROR = "An error occurred while fetching dashboard statistics";

export default function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Revenue",
      value: stats ? formatCurrency(stats.totalRevenue) : STATS_ERROR,
      description: "From paid invoices",
      icon: DollarSign,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Paid Invoices",
      value: stats ? stats.paidInvoices.toString() : STATS_ERROR,
      description: "Successfully collected",
      icon: FileText,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Pending Amount",
      value: stats ? formatCurrency(stats.pendingAmount) : STATS_ERROR,
      description: "Awaiting payment",
      icon: Clock,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Total Clients",
      value: stats ? stats.totalClients.toString() : STATS_ERROR,
      description: "Active clients",
      icon: Users,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <>
          {!isLoading ? (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <div className={`p-2 rounded-lg ${card.iconBg}`}>
                  <card.icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
              </CardContent>
            </Card>
          ) : (
            <SkeletonCard />
          )}
        </>
      ))}
    </div>
  );
}
