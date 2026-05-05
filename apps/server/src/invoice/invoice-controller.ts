import { Hono } from "hono";
import { Bindings, TokenPayload } from "@/lib/types";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { verify } from "hono/utils/jwt/jwt";
import { getCookie } from "hono/cookie";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, sql, desc } from "drizzle-orm";
import { clients, invoices } from "@/db/schema";
import { generateInvoiceNumber, getCurrentYear } from "@/lib/utils";

const invoiceRouteV1 = new Hono<{ Bindings: Bindings }>();

const invoiceFormSchema = z.object({
    clientId: z.string(),
    issueDate: z.coerce.date(),
    dueDate: z.coerce.date(),
    taxRate: z.number().min(0).max(100),
    status: z.enum(["draft", "sent", "paid", "overdue"]),
    items: z.array(
        z.object({
            description: z.string(),
            quantity: z.number().positive(),
            unitPrice: z.number().positive(),
        }),
    ),
    currency: z.string(),
    notes: z.string(),
});

invoiceRouteV1.get("/", async (c) => {
    const clientId = c.req.param("clientId");
    if (!clientId) return c.json({ message: "No client Id" }, 400);

    const db = drizzle(c.env.DB);

    const refreshToken = getCookie(c, "refresh_token");
    if (!refreshToken) return c.json({ message: "No refresh token" }, 401);

    const secret = c.env.JWT_SECRET;
    if (!secret) {
        console.log("JWT secret not configured");
        return c.json({ message: "Internal Server Error" }, 500);
    }

    // TODO: Better error handling
    const decoded = (await verify(refreshToken, secret, "HS256")) as TokenPayload;

    // TODO: Better error handling
    const result = await db
        .select()
        .from(invoices)
        .where(and(eq(invoices.clientId, clientId), eq(invoices.deleted, false)))
        .orderBy(desc(invoices.createdAt));

    return c.json({ message: "All Invoices", data: result }, 200);
});

invoiceRouteV1.get("/:invoiceId", async (c) => {
    const clientId = c.req.param("clientId");
    if (!clientId) return c.json({ message: "No client Id" }, 400);

    const invoiceId = c.req.param("invoiceId");
    if (!invoiceId) return c.json({ message: "No invoice Id" }, 400);

    const db = drizzle(c.env.DB);

    const refreshToken = getCookie(c, "refresh_token");
    if (!refreshToken) return c.json({ message: "No refresh token" }, 401);

    const secret = c.env.JWT_SECRET;
    if (!secret) {
        console.log("JWT secret not configured");
        return c.json({ message: "Internal Server Error" }, 500);
    }

    // TODO: Better error handling
    (await verify(refreshToken, secret, "HS256")) as TokenPayload;

    const clientResult = await db.select().from(clients).where(eq(clients.id, clientId)).get();
    if (!clientResult) return c.json({ message: "Client not found" }, 404);

    const invoiceResult = await db
        .select()
        .from(invoices)
        .where(and(eq(invoices.clientId, clientId), eq(invoices.id, invoiceId)))
        .get();
    if (!invoiceResult) return c.json({ message: "Invoice not found" }, 404);

    return c.json({ invoice: invoiceResult, client: clientResult }, 200);
});

invoiceRouteV1.post("/create", zValidator("json", invoiceFormSchema), async (c) => {
    const db = drizzle(c.env.DB);
    const data = c.req.valid("json");

    const refreshToken = getCookie(c, "refresh_token");
    if (!refreshToken) return c.json({ message: "No refresh token" }, 401);

    const secret = c.env.JWT_SECRET;
    if (!secret) {
        console.log("JWT secret not configured");
        return c.json({ message: "Internal Server Error" }, 500);
    }

    // TODO: Better error handling
    (await verify(refreshToken, secret, "HS256")) as TokenPayload;

    // TODO: Better error handling
    await db.insert(invoices).values({
        id: "inv-" + getCurrentYear() + "-" + generateInvoiceNumber(),
        clientId: data.clientId,
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        status: data.status,
        taxRate: data.taxRate,
        items: data.items,
        notes: data.notes,
        currency: data.currency,
    });

    return c.json({ message: "Invoice created" }, 200);
});

invoiceRouteV1.put("/:invoiceId/edit", zValidator("json", invoiceFormSchema), async (c) => {
    const invoiceId = c.req.param("invoiceId");
    const db = drizzle(c.env.DB);
    const data = c.req.valid("json");
    const refreshToken = getCookie(c, "refresh_token");
    if (!refreshToken) return c.json({ message: "No refresh token" }, 401);

    const secret = c.env.JWT_SECRET;
    if (!secret) {
        console.log("JWT secret not configured");
        return c.json({ message: "Internal Server Error" }, 500);
    }

    // TODO: Better error handling
    (await verify(refreshToken, secret, "HS256")) as TokenPayload;

    // TODO: Better error handling
    await db
        .update(invoices)
        .set({
            issueDate: data.issueDate,
            dueDate: data.dueDate,
            status: data.status,
            taxRate: data.taxRate,
            items: data.items,
            notes: data.notes,
            currency: data.currency,
            updatedAt: sql`(unixepoch())`,
        })
        .where(eq(invoices.id, invoiceId));

    return c.json({ message: "Invoice Updated" }, 200);
});

invoiceRouteV1.delete("/:invoiceId/delete", async (c) => {
    const invoiceId = c.req.param("invoiceId");
    const db = drizzle(c.env.DB);

    const refreshToken = getCookie(c, "refresh_token");
    if (!refreshToken) return c.json({ message: "No refresh token" }, 401);

    const secret = c.env.JWT_SECRET;
    if (!secret) {
        console.log("JWT secret not configured");
        return c.json({ message: "Internal Server Error" }, 500);
    }

    // TODO: Better error handling
    (await verify(refreshToken, secret, "HS256")) as TokenPayload;

    // TODO: Better error handling
    await db.update(invoices).set({ deleted: false }).where(eq(invoices.id, invoiceId));

    return c.json({ message: "Invoice deleted" }, 200);
});

export default invoiceRouteV1;
