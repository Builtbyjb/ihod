import { useState, useEffect } from "react";
import type { MonthRevenue } from "@/lib/types";
import * as z from "zod";

const schema = z.array(
    z.object({
        month: z.string(),
        revenue: z.number(),
    }),
);

const API_URL = import.meta.env.VITE_API_URL;

export function useRevenue() {
    const [monthlyRevenues, setMonthlyRevenues] = useState<MonthRevenue[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/api/v1/user/revenue-stats`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) throw new Error("An error occurred while fetching revenue stats");

                const result = await response.json();
                const parsedResult = schema.parse(result);

                setMonthlyRevenues(parsedResult);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return { monthlyRevenues, isLoading };
}
