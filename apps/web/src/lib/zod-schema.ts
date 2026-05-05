import * as z from "zod";

export const InvoiceStatusSchema = z.enum(["draft", "sent", "paid", "overdue"]);

export const ClientSchema = z.object({
    id: z.string(),
    organizationId: z.number(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    country: z.string(),
    createdAt: z.string(),
});

export const InvoiceItemSchema = z.object({
    description: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
});

export const InvoiceSchema = z.object({
    id: z.number(),
    invoiceNumber: z.string(),
    clientId: z.string(),
    client: ClientSchema,
    items: z.array(InvoiceItemSchema),
    taxRate: z.number(),
    status: InvoiceStatusSchema,
    issueDate: z.string(),
    dueDate: z.string(),
    currency: z.string(),
    notes: z.string(),
    createdAt: z.string(),
});

export const TopStatsSchema = z.object({
    totalRevenue: z.number(),
    paidInvoices: z.number(),
    pendingAmount: z.number(),
    totalClients: z.number(),
});
