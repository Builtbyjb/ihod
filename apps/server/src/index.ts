import { Hono } from "hono";
import { cors } from "hono/cors";
import authRouteV1 from "./auth/auth-controller";
import userRouteV1 from "./user/user-controller";
import clientRouteV1 from "./client/client-controller";
import { Bindings } from "@/lib/types";

const app = new Hono<{ Bindings: Bindings }>();

app.use(
    "/api/*",
    cors({
        origin: ["http://localhost:5173", "http://10.0.0.253:5173"],
        allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests", "Content-Type", "Authorization", "Set-Cookie"],
        allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PATCH", "PUT"],
        exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
        credentials: true,
    }),
);

app.route("/api/v1", authRouteV1);
app.route("/api/v1", userRouteV1);
app.route("/api/v1", clientRouteV1);

export default app;
