import { useEffect, useState, useCallback } from "react";
import type { Client, Invoice, DashboardStats } from "./types";
import { mockClients, mockInvoices } from "./mock-data";

const CLIENTS_KEY = "invoicely_clients";
const INVOICES_KEY = "invoicely_invoices";

function getFromStorage<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    const stored = localStorage.getItem(key);
    if (!stored) {
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
    }
    try {
        return JSON.parse(stored) as T;
    } catch {
        return fallback;
    }
}

function saveToStorage<T>(key: string, data: T): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(data));
}

export function useClients() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const data = getFromStorage<Client[]>(CLIENTS_KEY, mockClients);
        setClients(data);
        setLoading(false);
    }, []);

    const addClient = useCallback((client: Client) => {
        setClients((prev) => {
            const updated = [...prev, client];
            saveToStorage(CLIENTS_KEY, updated);
            return updated;
        });
    }, []);

    const updateClient = useCallback((id: string, updates: Partial<Client>) => {
        setClients((prev) => {
            const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
            saveToStorage(CLIENTS_KEY, updated);
            return updated;
        });
    }, []);

    const deleteClient = useCallback((id: string) => {
        setClients((prev) => {
            const updated = prev.filter((c) => c.id !== id);
            saveToStorage(CLIENTS_KEY, updated);
            return updated;
        });
    }, []);

    const getClient = useCallback(
        (id: string) => {
            return clients.find((c) => c.id === id);
        },
        [clients],
    );

    return { clients, loading, addClient, updateClient, deleteClient, getClient };
}

export function useInvoices() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const data = getFromStorage<Invoice[]>(INVOICES_KEY, mockInvoices);
        setInvoices(data);
        setLoading(false);
    }, []);

    const updateInvoice = useCallback((id: string, updates: Partial<Invoice>) => {
        setInvoices((prev) => {
            const updated = prev.map((inv) =>
                inv.id === id ? { ...inv, ...updates } : inv,
            );
            saveToStorage(INVOICES_KEY, updated);
            return updated;
        });
    }, []);

    const deleteInvoice = useCallback((id: string) => {
        setInvoices((prev) => {
            const updated = prev.filter((inv) => inv.id !== id);
            saveToStorage(INVOICES_KEY, updated);
            return updated;
        });
    }, []);

    const getNextInvoiceNumber = useCallback(() => {
        const numbers = invoices
            .map((inv) => {
                const match = inv.invoiceNumber.match(/INV-(\d+)/);
                return match ? parseInt(match[1], 10) : 0;
            })
            .filter((n) => !isNaN(n));
        const max = numbers.length > 0 ? Math.max(...numbers) : 0;
        return `INV-${String(max + 1).padStart(3, "0")}`;
    }, [invoices]);

    return {
        invoices,
        loading,
        updateInvoice,
        deleteInvoice,
        getNextInvoiceNumber,
    };
}

export function useDashboardStats(
    invoices: Invoice[],
    clients: Client[],
): DashboardStats {
    const totalRevenue = invoices
        .filter((inv) => inv.status === "paid")
        .reduce((sum, inv) => sum + inv.total, 0);

    const paidInvoices = invoices.filter((inv) => inv.status === "paid").length;

    const pendingAmount = invoices
        .filter((inv) => inv.status === "sent" || inv.status === "overdue")
        .reduce((sum, inv) => sum + inv.total, 0);

    const totalClients = clients.length;

    return { totalRevenue, paidInvoices, pendingAmount, totalClients };
}

export function getMonthlyRevenue(invoices: Invoice[]) {
    const monthlyData: { [key: string]: number } = {};

    invoices
        .filter((inv) => inv.status === "paid")
        .forEach((inv) => {
            const date = new Date(inv.issueDate);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            monthlyData[monthKey] = (monthlyData[monthKey] || 0) + inv.total;
        });

    const months = [
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
