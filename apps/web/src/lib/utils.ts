import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { InvoiceItem, Invoice } from "./types";
import { CURRENCY_MAP } from "./constant";
import { format } from "date-fns";

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
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    }
}

export function formatDate(date: string): string {
    return format(new Date(date), "MMMM d, yyyy");
}

export function calculateTotalAmount(items: InvoiceItem[], taxRate: number, discount: number): number {
    const subtotal = calculateSubTotal(items);
    const taxAmount = calculateTaxAmount(subtotal, taxRate);
    const discountAmount = calculateDiscount(subtotal, discount);
    return subtotal + taxAmount - discountAmount;
}

export function calculateTaxAmount(subtotal: number, taxRate: number): number {
    return subtotal * (taxRate / 100);
}

export function calculateDiscount(subtotal: number, discount: number): number {
    return subtotal * (discount / 100);
}

export function calculateSubTotal(items: InvoiceItem[]): number {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export function getStatusVariant(status: Invoice["status"]): string {
    switch (status) {
        case "paid":
            return "bg-green-50 text-green-700";
        case "sent":
            return "bg-sky-50 text-sky-700";
        case "draft":
            return "bg-gray-50 text-gray-700";
        case "overdue":
            return "bg-red-50 text-red-700";
        default:
            return "bg-secondary text-secondary";
    }
}

export function getBadgeVariant(badge: string): string {
    switch (badge) {
        case "active":
            return "bg-green-50 text-green-700";
        case "blue":
            return "bg-sky-50 text-sky-700";
        case "non-renewing":
            return "bg-gray-200 text-gray-700";
        case "disabled":
            return "bg-red-50 text-red-700";
        default:
            return "bg-gray-200 text-gray-700";
    }
}

export function getCurrentYear(): number {
    return new Date().getFullYear();
}
