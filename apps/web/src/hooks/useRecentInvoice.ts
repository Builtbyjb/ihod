import { useState, useEffect } from "react";
import type { Invoice } from "@/lib/types";
import { InvoiceSchema } from "@/lib/zod-schema";
import * as z from "zod";

const schema = z.array(InvoiceSchema);

const API_URL = import.meta.env.VITE_API_URL;

export function useRecentInvoice() {
    const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/api/v1/user/recent-invoice`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) throw new Error("An error occurred while fetching recent invoices");

                const result = await response.json();
                const parsedResult = schema.parse(result);

                setRecentInvoices(parsedResult);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return { recentInvoices, isLoading };
}
