import { useState, useEffect } from "react";
import type { DashboardStats } from "@/lib/types";
import * as z from "zod";

const schema = z.object({
    totalRevenue: z.number(),
    paidInvoices: z.number(),
    pendingAmount: z.number(),
    totalClients: z.number(),
});

const API_URL = import.meta.env.VITE_API_URL;

export function useDashboardStats() {
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
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
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return { dashboardStats, isLoading };
}
