import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Bindings } from "@/lib/types";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { users, organizations, members } from "@/db/schema";

const userRouteV1 = new Hono<{ Bindings: Bindings }>().basePath("/user");

userRouteV1.get("/dashboard-stats", async (c) => {
    const dashboardStats = { totalRevenue: 2_500_000, paidInvoices: 25, pendingAmount: 10, totalClients: 87 };

    return c.json(dashboardStats, 200);
});

userRouteV1.get("/revenue-stats", async (c) => {
    const tmp = [
        { month: "Jan", revenue: 15000 },
        { month: "Feb", revenue: 7000 },
        { month: "Mar", revenue: 1300 },
        { month: "Apr", revenue: 10000 },
        { month: "May", revenue: 22500 },
        { month: "Jun", revenue: 12500 },
        { month: "Jul", revenue: 15600 },
        { month: "Aug", revenue: 9700 },
        { month: "Sep", revenue: 6500 },
        { month: "Oct", revenue: 5500 },
        { month: "Nov", revenue: 80085 },
        { month: "Dec", revenue: 69420 },
    ];

    return c.json(tmp, 200);
});

userRouteV1.get("/invoice-data", async (c) => {
    const tmp = [
        { status: "paid", count: 100 },
        { status: "sent", count: 75 },
        { status: "draft", count: 10 },
        { status: "overdue", count: 15 },
    ];

    return c.json(tmp, 200);
});

userRouteV1.get("/recent-invoice", async (c) => {
    const tmp = [];

    return c.json(tmp, 200);
});

export default userRouteV1;
