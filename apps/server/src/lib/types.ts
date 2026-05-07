import { ContentfulStatusCode } from "hono/utils/http-status";
import type { JWTPayload } from "hono/utils/jwt/types";
import { clients, invoices } from "@/db/schema";

export type Bindings = {
    DB: D1Database;
    EMAIL_DOMAIN: string;
    JWT_SECRET: string;
    SEND_EMAIL: {
        send: (email: { to: string; from: string; subject: string; text: string; html?: string }) => Promise<any>;
    };
    ENV: string;
    PAYSTACK_SECRET: string;
    // Add other variables like KV, R2, or Secret Keys here
};

export type TokenPayload = JWTPayload & {
    userId: number;
    email: string;
    username: string;
    currentOrgId: number;
    organizationName: string;
};

export type OTPPayload = JWTPayload & {
    userId: number;
    currentOrgId: number;
    otp: string;
};

export type InvoiceItem = {
    description: string;
    quantity: number;
    unitPrice: number;
};

export type ReturnId = {
    id: number | undefined;
};

export class ErrorResult extends Error {
    public code: ContentfulStatusCode;

    constructor(message: string, code: ContentfulStatusCode, options?: ErrorOptions) {
        super(message, options);

        this.code = code;
        this.name = "ErrorResult";

        Object.setPrototypeOf(this, ErrorResult.prototype);
    }
}

export type Client = typeof clients.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
