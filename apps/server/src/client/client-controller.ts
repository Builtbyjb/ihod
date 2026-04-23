import { Hono } from "hono";
import { Bindings, ResponsePayload } from "@/lib/types";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getCookie } from "hono/cookie";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, sql, like } from "drizzle-orm";
import { clients, invoices, members } from "@/db/schema";
import { verify } from "hono/utils/jwt/jwt";
import invoiceRouteV1 from "@/invoice/invoice-controller";

const clientFormSchema = z.object({
    name: z.string().nonempty(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    country: z.string(),
})

const allClientsFetchSchema = z.array(
    z.object({
        id: z.string(),
        organizationId: z.number(),
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        address: z.string(),
        city: z.string(),
        country: z.string(),
        createdAt: z.date(),
    })
)

const clientRouteV1 = new Hono<{ Bindings: Bindings }>().basePath("/clients")

clientRouteV1.get("/", async (c) => {
    const db = drizzle(c.env.DB)

    const refreshToken = getCookie(c, "refresh_token")
    if (!refreshToken) return c.json({ message: "No refresh token" }, 401)

    const secret = c.env.JWT_SECRET;
    if (!secret) {
        console.error("JWT secret not configured");
        return c.json({ message: "Internal Server Error" }, 500)
    }

    // TODO: Better error handling
    const decoded = (await verify(refreshToken, secret, "HS256")) as ResponsePayload;

    const member = await db.select().from(members).where(eq(members.userId, decoded.userId))
    if (member.length == 0) return c.json("User is not part of an organization", 400)

    // TODO: Better error handling
    const result = await db.select().from(clients)
        .where(
            and(
                eq(clients.organizationId, member[0].organizationId),
                eq(clients.deleted, false)
            )
        );

    const parsedResult = allClientsFetchSchema.parse(result);

    return c.json({ message: "All Clients", data: parsedResult }, 200)
})

clientRouteV1.get("/:id", async (c) => {
    const id = c.req.param("id")

    const db = drizzle(c.env.DB)

    const refreshToken = getCookie(c, "refresh_token")
    if (!refreshToken) return c.json({ message: "No refresh token" }, 401)

    const secret = c.env.JWT_SECRET;
    if (!secret) {
        console.error("JWT secret not configured");
        return c.json({ message: "Internal Server Error" }, 500)
    }

    //  TODO: Better error handling
    (await verify(refreshToken, secret, "HS256")) as ResponsePayload;

    // TODO: Improve and add pagination
    const client = await db.select().from(clients).where(
        and(
            eq(clients.id, id),
            eq(clients.deleted, false)
        )
    ).get()
    if (!client) return c.json("Client not found", 404)

    const invoicesResult = await db.select().from(invoices).where(eq(invoices.clientId, client.id))

    return c.json({ clientInfo: client, invoices: invoicesResult }, 200)
})

clientRouteV1.post("/create", zValidator("json", clientFormSchema), async (c) => {
    const data = c.req.valid("json");
    const db = drizzle(c.env.DB)

    const refreshToken = getCookie(c, "refresh_token")
    if (!refreshToken) return c.json({ message: "No refresh token" }, 401)

    const secret = c.env.JWT_SECRET;
    if (!secret) {
        console.error("JWT secret not configured");
        return c.json({ message: "Internal Server Error" }, 500)
    }

    //  TODO: Better error handling
    const decoded = (await verify(refreshToken, secret, "HS256")) as ResponsePayload;

    const result = await db.select().from(members).where(eq(members.userId, decoded.userId))
    if (result.length == 0) return c.json("User is not part of an organization", 400)

    //  TODO: Better error handling
    await db.insert(clients).values({
        id: crypto.randomUUID(),
        organizationId: result[0].organizationId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country
    })

    return c.json({ message: "Client created" }, 200)
})

clientRouteV1.delete("/delete/:id", async (c) => {
    const db = drizzle(c.env.DB)

    const id = c.req.param('id')

    const refreshToken = getCookie(c, "refresh_token");
    if (!refreshToken) return c.json({ message: "No refresh token" }, 401)

    const secret = c.env.JWT_SECRET;
    if (!secret) {
        console.log("JWT secret not configured")
        return c.json({ message: "Internal Server Error" }, 500)
    }

    // TODO: Better error handling
    (await verify(refreshToken, secret, "HS256")) as ResponsePayload

    // TODO: Better error handling
    await db.update(clients).set({ deleted: true }).where(eq(clients.id, id))

    return c.json({ message: "Client Deleted" }, 200)
})

clientRouteV1.put("/edit/:id", zValidator("json", clientFormSchema), async (c) => {
    const db = drizzle(c.env.DB)
    const data = c.req.valid("json")

    const id = c.req.param("id")
    // TODO: Better error handling

    const refreshToken = getCookie(c, "refresh_token");
    if (!refreshToken) return c.json({ message: "No refresh token" }, 401)

    const secret = c.env.JWT_SECRET;
    if (!secret) {
        console.log("JWT secret not configured")
        return c.json({ message: "Internal Server Error" }, 500)
    }

    // TODO: Better error handling
    (await verify(refreshToken, secret, "HS256")) as ResponsePayload

    await db.update(clients).set({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country,
        updatedAt: sql`(unixepoch())`
    }).where(eq(clients.id, id))

    return c.json({ message: "Client data edited" }, 200)
})

clientRouteV1.post("/search", async (c) => {
    const db = drizzle(c.env.DB)
    const data = await c.req.json()

    const refreshToken = getCookie(c, "refresh_token");
    if (!refreshToken) return c.json({ message: "No refresh token" }, 401)

    const secret = c.env.JWT_SECRET;
    if (!secret) {
        console.log("JWT secret not configured")
        return c.json({ message: "Internal Server Error" }, 500)
    }

    // TODO: Better error handling
    const decoded = (await verify(refreshToken, secret, "HS256")) as ResponsePayload

    const member = await db.select().from(members).where(eq(members.userId, decoded.userId))
    if (member.length == 0) return c.json("User is not part of an organization", 400)

    // TODO: Better error handling
    const result = await db.select().from(clients)
        .where(and(
            eq(clients.organizationId, member[0].organizationId),
            like(clients.name, `%${data.query}%`),
            eq(clients.deleted, false)
        ))

    return c.json({ data: result }, 200)
})

clientRouteV1.route("/:clientId/invoices", invoiceRouteV1)
export default clientRouteV1;
