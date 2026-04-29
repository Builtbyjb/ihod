import { ContentfulStatusCode } from "hono/utils/http-status";
import type { JWTPayload } from "hono/utils/jwt/types";

export type Bindings = {
    DB: D1Database;
    EMAIL_DOMAIN: string;
    JWT_SECRET: string;
    SEND_EMAIL: {
        send: (email: { to: string; from: string; subject: string; text: string; html?: string }) => Promise<any>;
    };
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

export interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
}

export class ErrorResult extends Error {
    public code: ContentfulStatusCode;

    constructor(message: string, code: ContentfulStatusCode, options?: ErrorOptions) {
        super(message, options);

        this.code = code;
        this.name = "ErrorResult";

        Object.setPrototypeOf(this, ErrorResult.prototype);
    }
}
