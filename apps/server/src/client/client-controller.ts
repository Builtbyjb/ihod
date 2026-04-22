import { Hono } from "hono";
import { Bindings, ResponsePayload } from "@/lib/types";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getCookie } from "hono/cookie";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { clients } from "@/db/schema";
import { verify } from "hono/utils/jwt/jwt";

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
        id: z.number(),
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

    // TODO: Better error handling
    const result = await db.select().from(clients).where(eq(clients.organizationId, decoded.organizationId))
    const parsedResult = allClientsFetchSchema.parse(result);

    return c.json({ message: "All Clients", data: parsedResult }, 200)
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

    //  TODO: Better error handling
    await db.insert(clients).values({
        organizationId: decoded.organizationId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country
    })

    return c.json({ message: "Client created" }, 200)
})


export default clientRouteV1;
