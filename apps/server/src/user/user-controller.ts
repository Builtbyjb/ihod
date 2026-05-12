import { Hono } from "hono";
import { Bindings, Client, Invoice, TokenPayload } from "@/lib/types";
import { drizzle } from "drizzle-orm/d1";
import { eq, and } from "drizzle-orm";
import { clients, invoices } from "@/db/schema";
import {
    countPaidInvoices,
    calculateRevenue,
    countPendingAmount,
    getInvoiceData,
    getMonthlyRevenues,
    getRecentInvoices,
} from "./user-service";
import { authMiddleware } from "@/middleware/auth-middleware";

const userRouteV1 = new Hono<{ Bindings: Bindings }>().basePath("/user");
userRouteV1.use("*", authMiddleware());

userRouteV1.get("/dashboard", async (c) => {
    const db = drizzle(c.env.DB);
    const jwtPayload = c.get("jwtPayload") as TokenPayload;

    let allClients: Client[] = [];

    try {
        allClients = await db
            .select()
            .from(clients)
            .where(and(eq(clients.organizationId, jwtPayload.currentOrgId), eq(clients.deleted, false)));
    } catch (error) {
        console.log(error);
        return c.json({ message: "An error occurred while fetching all clients" }, 500);
    }

    if (allClients.length === 0) return c.json({ message: "No clients found" }, 200);

    const totalClients = allClients.length;

    const allInvoices: Invoice[] = [];

    // Get all invoices for all clients
    for (const client of allClients) {
        const clientInvoices = await db
            .select()
            .from(invoices)
            .where(and(eq(invoices.clientId, client.id), eq(invoices.deleted, false)));

        allInvoices.push(...clientInvoices);
    }

    const totalRevenue = calculateRevenue(allInvoices);
    const paidInvoices = countPaidInvoices(allInvoices);
    const pendingAmount = countPendingAmount(allInvoices);
    const invoiceData = getInvoiceData(allInvoices);
    const monthlyRevenues = getMonthlyRevenues(allInvoices);
    const recentInvoices = getRecentInvoices(allInvoices);

    const dashboardStats = {
        topStats: { totalRevenue, paidInvoices, pendingAmount, totalClients },
        invoiceData,
        monthlyRevenues,
        recentInvoices,
    };
    return c.json(dashboardStats, 200);
});

export default userRouteV1;
