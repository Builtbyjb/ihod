import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Context } from "./types";
import { jwtDecode } from "jwt-decode";
// import { Invoice } from "./types";

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
