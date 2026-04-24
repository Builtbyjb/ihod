import type { Client, Invoice, DashboardStats } from "./types";

export const CURRENCIES = [
    { name: "Naira (NGN)", value: "NGN" },
    { name: "Canadian Dollar (CAD)", value: "CAD" },
    { name: "US Dollar (USD)", value: "USD" },
]

export function useDashboardStats(
    invoices: Invoice[],
    clients: Client[],
): DashboardStats {
    const totalRevenue = invoices
        .filter((inv) => inv.status === "paid")
        .reduce((sum, inv) => sum + inv.taxRate, 0);

    const paidInvoices = invoices.filter((inv) => inv.status === "paid").length;

    const pendingAmount = invoices
        .filter((inv) => inv.status === "sent" || inv.status === "overdue")
        .reduce((sum, inv) => sum + inv.taxRate, 0);

    const totalClients = clients.length;

    return { totalRevenue, paidInvoices, pendingAmount, totalClients };
}

export const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export function getMonthlyRevenue(invoices: Invoice[]) {
    const monthlyData: { [key: string]: number } = {};

    invoices
        .filter((inv) => inv.status === "paid")
        .forEach((inv) => {
            const date = new Date(inv.issueDate);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            monthlyData[monthKey] = (monthlyData[monthKey] || 0);
        });

    const currentYear = new Date().getFullYear();

    return months.map((month, index) => {
        const key = `${currentYear}-${String(index + 1).padStart(2, "0")}`;
        return {
            month,
            revenue: monthlyData[key] || 0,
        };
    });
}

export function getInvoicesByStatus(invoices: Invoice[]) {
    const statusCounts = {
        paid: 0,
        sent: 0,
        draft: 0,
        overdue: 0,
    };

    invoices.forEach((inv) => {
        statusCounts[inv.status]++;
    });

    return [
        { status: "Paid", count: statusCounts.paid, fill: "var(--chart-1)" },
        { status: "Sent", count: statusCounts.sent, fill: "var(--chart-2)" },
        { status: "Draft", count: statusCounts.draft, fill: "var(--chart-3)" },
        { status: "Overdue", count: statusCounts.overdue, fill: "var(--chart-4)" },
    ];
}
