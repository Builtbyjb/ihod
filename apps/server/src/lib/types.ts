import type { JWTPayload } from "hono/utils/jwt/types";

export type Bindings = {
    DB: D1Database;
    // Add other variables like KV, R2, or Secret Keys here
};

export type ResponsePayload = JWTPayload & {
    userId: number;
};
