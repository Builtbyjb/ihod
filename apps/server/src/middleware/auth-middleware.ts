import { MiddlewareHandler } from "hono";
import type { TokenPayload, Bindings } from "@/lib/types";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

export function authMiddleware(): MiddlewareHandler<{ Bindings: Bindings; Variables: { jwtPayload: TokenPayload } }> {
    return async (c, next) => {
        const token = getCookie(c, "refresh_token");
        if (!token) {
            console.log("refresh_token token not found");
            return c.json({ error: "Unauthorized: Refresh token not found" }, 401);
        }

        const secret = c.env.JWT_SECRET;
        if (!secret) {
            console.error("JWT secret not configured");
            return c.json({ error: "Internal Server Error" }, 500);
        }

        try {
            const payload = await verify(token, secret, "HS256");
            c.set("jwtPayload", payload);
            await next();
        } catch (error) {
            console.log(error);
            return c.json({ error: "Unauthorized: Invalid token" }, 401);
        }
    };
}
