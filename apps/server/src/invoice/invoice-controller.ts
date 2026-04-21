import { Hono } from "hono";
import { Bindings } from "@/lib/types";
import { z } from "zod"
import { zValidator } from "@hono/zod-validator";

const invoiceRouteV1 = new Hono<{ Bindings: Bindings }>().basePath("/invoice")

const invoiceFormSchema = z.object({
    clientId: z.number(),
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
    notes: z.string(),
});

invoiceRouteV1.post("/create", zValidator("json", invoiceFormSchema), (c) => {
    const data = c.req.valid("json")
    console.log(data)
    return c.json({ message: "Invoice created" })
})

export default invoiceRouteV1;
