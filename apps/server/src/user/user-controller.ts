import { Hono } from "hono";
import { Bindings, ErrorResult, Client, Invoice } from "@/lib/types";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, sql } from "drizzle-orm";
import { users, organizations, members, clients, invoices } from "@/db/schema";
import { parseToken } from "@/lib/utils";
import {
    countPaidInvoices,
    calculateRevenue,
    countPendingAmount,
    getInvoiceData,
    getMonthlyRevenues,
    getRecentInvoices,
} from "./user-service";

const userRouteV1 = new Hono<{ Bindings: Bindings }>().basePath("/user");

userRouteV1.get("/dashboard-stats", async (c) => {
    const db = drizzle(c.env.DB);

    const parsedToken = await parseToken(c, "refresh_token");
    if (parsedToken instanceof ErrorResult) return c.json({ message: parsedToken.message }, parsedToken.code);

    // TODO: Better error handling
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
