import { Hono } from "hono";
import { cors } from "hono/cors";
import authRouteV1 from "./auth/controller/auth-controller";
import userRouteV1 from "./user/controller/user-controller";
import { Bindings } from "@/lib/types";

const app = new Hono<{ Bindings: Bindings }>();

app.use(
    "/api/*",
    cors({
        origin: ["http://localhost:5173"],
        allowHeaders: [
            "X-Custom-Header",
            "Upgrade-Insecure-Requests",
            "Content-Type",
            "Authorization",
        ],
        allowMethods: ["POST", "GET", "OPTIONS"],
        exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
        maxAge: 600,
        credentials: true,
    }),
);

app.route("/api/v1", authRouteV1);
app.route("/api/v1", userRouteV1);

export default app;
