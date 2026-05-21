import { Hono } from "hono";
import { Bindings, TokenPayload } from "@/lib/types";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, desc } from "drizzle-orm";
import { clients, invoices, organizations } from "@/db/schema";
import { getNewInvoiceNumber } from "@/lib/utils";

const invoiceRouteV1 = new Hono<{ Bindings: Bindings }>().basePath("/invoices");

const invoiceFormSchema = z.object({
    clientId: z.string(),
    issueDate: z.coerce.date(),
    dueDate: z.coerce.date(),
    discount: z.number().min(0).max(100),
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

/* Returns all the invoices created for a client */
invoiceRouteV1.get("/", async (c) => {
    const clientId = c.req.param("clientId");
    if (!clientId) return c.json({ message: "No client Id" }, 400);

    const db = drizzle(c.env.DB);

    const result = await db
        .select()
        .from(invoices)
        .where(and(eq(invoices.clientId, clientId), eq(invoices.deleted, false)))
        .orderBy(desc(invoices.createdAt));

    return c.json({ message: "All Invoices", data: result }, 200);
});

/* Gets a single invoices for a client using the invoice id */
invoiceRouteV1.get("/:invoiceId", async (c) => {
    const clientId = c.req.param("clientId");
    if (!clientId) return c.json({ message: "No client Id" }, 400);

    const invoiceId = c.req.param("invoiceId");
    if (!invoiceId) return c.json({ message: "No invoice Id" }, 400);

    const db = drizzle(c.env.DB);

    const clientResult = await db.select().from(clients).where(eq(clients.id, clientId)).get();
    if (!clientResult) return c.json({ message: "Client not found" }, 404);

    const invoiceResult = await db
        .select()
        .from(invoices)
        .where(and(eq(invoices.clientId, clientId), eq(invoices.id, invoiceId), eq(invoices.deleted, false)))
        .get();
    if (!invoiceResult) return c.json({ message: "Invoice not found" }, 404);

    return c.json({ invoice: invoiceResult, client: clientResult }, 200);
});

invoiceRouteV1.post(
    "/create",
    zValidator("json", invoiceFormSchema, (result, c) => {
        if (!result.success) {
            console.error(`Zod Validation Error: ${result.error}`);
            return c.json({ message: "Zod Validation Error" }, 400);
        }
    }),
    async (c) => {
        const db = drizzle(c.env.DB);
        const data = c.req.valid("json");
        const jwtPayload = c.get("jwtPayload") as TokenPayload;

        // Get previous organization invoice number
        const organization = await db
            .select()
            .from(organizations)
            .where(eq(organizations.id, jwtPayload.currentOrgId))
            .get();

        if (!organization) return c.json({ message: "Organization not found" }, 404);

        const newInvoiceNumber = getNewInvoiceNumber(organization.invoiceNumber);

        const invoiceNumber = "INV-" + newInvoiceNumber.year + "-" + newInvoiceNumber.currentNumber;

        // Create Invoice
        await db.insert(invoices).values({
            id: crypto.randomUUID(),
            invoiceNumber: invoiceNumber,
            clientId: data.clientId,
            issueDate: data.issueDate,
            dueDate: data.dueDate,
            status: data.status,
            discount: data.discount,
            taxRate: data.taxRate,
            items: data.items,
            notes: data.notes,
            currency: data.currency,
        });

        // Bookkeeping: Updating organizations invoice number
        await db
            .update(organizations)
            .set({ invoiceNumber: newInvoiceNumber })
            .where(eq(organizations.id, jwtPayload.currentOrgId));

        return c.json({ message: "Invoice created" }, 200);
    },
);

invoiceRouteV1.put(
    "/:invoiceId/edit",
    zValidator("json", invoiceFormSchema, (result, c) => {
        if (!result.success) {
            console.error(`Zod Validation Error: ${result.error}`);
            return c.json({ message: "Zod Validation Error" }, 400);
        }
    }),
    async (c) => {
        const invoiceId = c.req.param("invoiceId");
        const db = drizzle(c.env.DB);
        const data = c.req.valid("json");

        await db
            .update(invoices)
            .set({
                issueDate: data.issueDate,
                dueDate: data.dueDate,
                status: data.status,
                discount: data.discount,
                taxRate: data.taxRate,
                items: data.items,
                notes: data.notes,
                currency: data.currency,
            })
            .where(eq(invoices.id, invoiceId));

        return c.json({ message: "Invoice Updated" }, 200);
    },
);

invoiceRouteV1.delete("/:invoiceId/delete", async (c) => {
    const invoiceId = c.req.param("invoiceId");
    const db = drizzle(c.env.DB);

    await db.update(invoices).set({ deleted: false }).where(eq(invoices.id, invoiceId));
    return c.json({ message: "Invoice deleted" }, 200);
});

export default invoiceRouteV1;
