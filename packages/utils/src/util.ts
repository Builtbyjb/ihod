import type { InvoiceItem } from "@shared/lib/types";
import { format } from "date-fns";

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

export function formatDate(date: string): string {
    return format(new Date(date), "MMMM d, yyyy");
}

export function getCurrentYear(): number {
    return new Date().getFullYear();
}
