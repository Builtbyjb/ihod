import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Context } from "./types";
import { jwtDecode } from "jwt-decode";
import type { InvoiceItem } from "./types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

function isTokenExpired(accessToken: string): boolean {
    const { exp } = jwtDecode(accessToken);
    const now = Date.now() / 1000;
    if (!exp) return true;
    // Return true if expired, false otherwise
    return exp < now;
}

export async function authenticateUser(context: Context): Promise<boolean> {
    if (!context.auth) return false;

    try {
        if (context.auth.accessToken) {
            if (isTokenExpired(context.auth.accessToken)) await context.auth.refreshToken();
        } else {
            await context.auth.refreshToken();
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function verifySetupCompleted(): Promise<boolean> {
    const API_URL = import.meta.env.VITE_API_URL
    try {
        const response = await fetch(`${API_URL}/api/v1/auth/verify-setup-completed`, {
            method: "GET",
            credentials: "include"
        })

        if (!response.ok) return false

        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export function calculateTotalAmount(items: InvoiceItem[], taxRate: number): number {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    const taxAmount = subtotal * ((taxRate) / 100)
    return subtotal + taxAmount
}

export function calculateTaxAmount(items: InvoiceItem[], taxRate: number): number {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    const taxAmount = subtotal * ((taxRate) / 100)
    return taxAmount
}

export function calculateSubTotal(items: InvoiceItem[]): number {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    return subtotal
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
