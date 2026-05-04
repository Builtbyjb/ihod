import { useState, useEffect } from "react";
import type { InvoiceStatusData } from "@/lib/types";
import { InvoiceStatusSchema } from "@/lib/zod-schema";
import * as z from "zod";

const schema = z.array(
    z.object({
        status: InvoiceStatusSchema,
        count: z.number(),
    }),
);

const API_URL = import.meta.env.VITE_API_URL;

export function useInvoiceData() {
    const [invoiceData, setInvoiceData] = useState<InvoiceStatusData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/api/v1/user/invoice-data`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) throw new Error("An error occurred while fetching invoice data");

                const result = await response.json();
                const parsedResult = schema.parse(result);

                setInvoiceData(parsedResult);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return { invoiceData, isLoading };
}
