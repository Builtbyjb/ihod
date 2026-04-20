import type { JWTPayload } from "hono/utils/jwt/types";

export type Bindings = {
    DB: D1Database;
    EMAIL_DOMAIN: string;
    JWT_SECRET: string;
    SEND_EMAIL: {
        send: (email: {
            to: string;
            from: string;
            subject: string;
            text: string;
            html?: string;
        }) => Promise<any>;
    };
    // Add other variables like KV, R2, or Secret Keys here
};

export type ResponsePayload = JWTPayload & {
    userId: number;
};
