import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { InvoiceItem } from "./types";

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
