import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { InvoiceItem, Invoice } from "./types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
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

// const handleDownload = async (invoice: Invoice, InvoicePDF) => {
//     const blob = await pdf(<InvoicePDF invoice={ invoice } />).toBlob();
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${invoice.invoiceNumber}.pdf`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
// };
