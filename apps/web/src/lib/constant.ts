import type { Currency } from "./types";

export const APP_NAME = "IHOD";

export const CURRENCIES = [
    { name: "Naira", value: "NGN" },
    { name: "Canadian Dollar", value: "CAD" },
    { name: "US Dollar", value: "USD" },
];

export const CURRENCY_MAP: Record<string, Currency> = {
    NGN: { symbol: "₦", locale: "en-NG" },
    USD: { symbol: "$", locale: "en-US" },
    CAD: { symbol: "€", locale: "en-CA" },
};

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
