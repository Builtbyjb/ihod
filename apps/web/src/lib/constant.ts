import type { Currency } from "./types";

export const APP_NAME = "ACORP Invoice";

export const CURRENCIES = [
    { label: "Naira", value: "NGN" },
    { label: "Canadian Dollar", value: "CAD" },
    { label: "US Dollar", value: "USD" },
];

export const CURRENCY_MAP: Record<string, Currency> = {
    NGN: { symbol: "₦", locale: "en-NG" },
    USD: { symbol: "$", locale: "en-US" },
    CAD: { symbol: "€", locale: "en-CA" },
};
