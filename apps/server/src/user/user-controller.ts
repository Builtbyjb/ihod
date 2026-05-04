import { Hono } from "hono";
import { Bindings, ErrorResult, Client, Invoice } from "@/lib/types";
import { drizzle } from "drizzle-orm/d1";
import { eq, and } from "drizzle-orm";
import { users, organizations, members, clients, invoices } from "@/db/schema";
import { parseToken, countPaidInvoices, calculateRevenue, countPendingAmount } from "@/lib/utils";

const userRouteV1 = new Hono<{ Bindings: Bindings }>().basePath("/user");

userRouteV1.get("/dashboard-stats", async (c) => {
    const db = drizzle(c.env.DB);

    const parsedToken = await parseToken(c, "refresh_token");
    if (parsedToken instanceof ErrorResult) return c.json({ message: parsedToken.message }, parsedToken.code);

    const allClients: Client[] = await db
        .select()
        .from(clients)
        .where(and(eq(clients.organizationId, parsedToken.currentOrgId), eq(clients.deleted, false)));

    if (allClients.length === 0) return c.json({ message: "No clients found" }, 200);

    const totalClients = allClients.length;

    let allInvoices: Invoice[] = [];

    // Get all invoices for all clients
    for (const client of allClients) {
        const clientInvoices = await db
            .select()
            .from(invoices)
            .where(and(eq(invoices.clientId, client.id)));

        allInvoices.push(...clientInvoices);
    }

    const totalRevenue = calculateRevenue(allInvoices);
    const paidInvoices = countPaidInvoices(allInvoices);
    const pendingAmount = countPendingAmount(allInvoices);

    const dashboardStats = { totalRevenue, paidInvoices, pendingAmount, totalClients };
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
