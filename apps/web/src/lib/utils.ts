import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { InvoiceItem, Invoice } from "./types";
import { CURRENCY_MAP } from "./store";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency?: string): string {
    if (currency) {
        const config = CURRENCY_MAP[currency];
        return new Intl.NumberFormat(config.locale, {
            style: "currency",
            currency: currency,
        }).format(amount);
    } else {
        return new Intl.NumberFormat("en-US", {
            style: "decimal",
        }).format(amount);
    }
}

export function calculateTotalAmount(items: InvoiceItem[], taxRate: number): number {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const taxAmount = subtotal * (taxRate / 100);
    return subtotal + taxAmount;
}

export function calculateTaxAmount(items: InvoiceItem[], taxRate: number): number {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const taxAmount = subtotal * (taxRate / 100);
    return taxAmount;
}

export function calculateSubTotal(items: InvoiceItem[]): number {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    return subtotal;
}

export const getStatusVariant = (status: Invoice["status"]) => {
    switch (status) {
        case "paid":
            return "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300";
        case "sent":
            return "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300";
        case "draft":
            return "bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300";
        case "overdue":
            return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300";
        default:
            return "bg-secondary text-secondary dark:bg-secondary dark:text-secondary";
    }
};
