import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CURRENCY_MAP } from "./constant";

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

export function getBadgeVariant(action: string): string {
    const green = "bg-green-50 text-green-700";
    const blue = "bg-sky-50 text-sky-700";
    const gray = "bg-gray-200 text-gray-700";
    const red = "bg-red-50 text-red-700";

    switch (action) {
        case "active":
            return green;
        case "blue":
            return blue;
        case "non-renewing":
            return gray;
        case "disabled":
            return red;
        case "paid":
            return green;
        case "sent":
            return blue;
        case "draft":
            return gray;
        case "overdue":
            return red;
        default:
            return gray;
    }
}
