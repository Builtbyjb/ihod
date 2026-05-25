import { Hono } from "hono";
import { Bindings, Client, Invoice, TokenPayload } from "@/lib/types";
import { drizzle } from "drizzle-orm/d1";
import { eq, and } from "drizzle-orm";
import { clients, invoices, organizations, users } from "@/db/schema";
import {
    countPaidInvoices,
    calculateRevenue,
    countPendingAmount,
    getInvoiceData,
    getMonthlyRevenues,
    getRecentInvoices,
} from "./user-service";
import { authMiddleware } from "@/middleware/auth-middleware";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getBlobURL } from "@/lib/utils";

const userRouteV1 = new Hono<{ Bindings: Bindings }>().basePath("/user");
userRouteV1.use("*", authMiddleware());

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const UserProfileSettingSchema = z.object({
    username: z.string(),
    avatar: z
        .instanceof(Blob)
        .optional()
        .refine((blob) => !blob || blob?.size <= MAX_IMAGE_SIZE, `Max image size is 5mb.`)
        .refine(
            (blob) => !blob || ACCEPTED_IMAGE_TYPES.includes(blob?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported.",
        ),
});

const BusinessSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    // phone: z.string(),
    website: z.string(),
    address: z.string(),
    city: z.string(),
    country: z.string(),
    logo: z
        .instanceof(Blob)
        .optional()
        .refine((blob) => !blob || blob?.size <= MAX_IMAGE_SIZE, `Max image size is 5MB.`)
        .refine(
            (blob) => !blob || ACCEPTED_IMAGE_TYPES.includes(blob?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported.",
        ),
});

userRouteV1.get("/dashboard", async (c) => {
    const db = drizzle(c.env.DB);
    const jwtPayload = c.get("jwtPayload") as TokenPayload;

    const allClients: Client[] = await db
        .select()
        .from(clients)
        .where(and(eq(clients.organizationId, jwtPayload.currentOrgId), eq(clients.deleted, false)));

    if (allClients.length === 0) return c.json({ message: "No clients found" }, 404);

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

    const totalRevenue: number = calculateRevenue(allInvoices);
    const paidInvoices = countPaidInvoices(allInvoices);
    const pendingAmount = countPendingAmount(allInvoices);
    const invoiceData = getInvoiceData(allInvoices);
    const monthlyRevenues = getMonthlyRevenues(allInvoices);
    const recentInvoices = getRecentInvoices(allInvoices);

    const data = {
        topStats: { totalRevenue, paidInvoices, pendingAmount, totalClients },
        invoiceData,
        monthlyRevenues,
        recentInvoices,
    };

    return c.json({ message: "Success", data }, 200);
});

userRouteV1.get("/settings", async (c) => {
    const db = drizzle(c.env.DB);
    const jwtPayload = c.get("jwtPayload") as TokenPayload;

    const user = await db.select().from(users).where(eq(users.id, jwtPayload.userId)).get();
    if (!user) return c.json({ message: "User not found" }, 404);

    const organization = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, jwtPayload.currentOrgId))
        .get();

    if (!organization) return c.json({ message: "User organization not found" }, 404);

    const setting = {
        user: {
            avatarURL: user.avatarURL,
            username: user.username,
        },
        business: {
            logoURL: organization.logoURL,
            name: organization.name,
            email: user.email,
            website: organization.website,
            address: organization.address,
            city: organization.city,
            country: organization.country,
        },
    };
    return c.json({ message: "Profile setting", data: setting }, 200);
});

userRouteV1.put("/settings/profile", zValidator("form", UserProfileSettingSchema), async (c) => {
    const data = c.req.valid("form");
    const db = drizzle(c.env.DB);

    // console.log(data);
    const jwtPayload = c.get("jwtPayload") as TokenPayload;

    let blobURL: string | null = null;
    if (data.avatar) {
        const value = await c.env.R2.put(`${jwtPayload.userId}-avatar`, data.avatar, {
            httpMetadata: {
                contentType: data.avatar.type,
            },
        });
        // console.log(value);

        blobURL = getBlobURL(c, value?.key);
    }

    await db
        .update(users)
        .set({ avatarURL: blobURL || users.avatarURL, username: data.username })
        .where(eq(users.id, jwtPayload.userId));

    return c.json({ message: "User profile updated" }, 200);
});

userRouteV1.put("/settings/business", zValidator("form", BusinessSchema), async (c) => {
    const data = c.req.valid("form");
    const db = drizzle(c.env.DB);

    // console.log(data);
    const jwtPayload = c.get("jwtPayload") as TokenPayload;

    let blobURL: string | null = null;
    if (data.logo) {
        const value = await c.env.R2.put(`${jwtPayload.currentOrgId}-logo`, data.logo, {
            httpMetadata: {
                contentType: data.logo.type,
            },
        });
        // console.log(value);

        blobURL = getBlobURL(c, value?.key);
    }

    await db
        .update(organizations)
        .set({
            logoURL: blobURL || organizations.logoURL,
            name: data.name,
            address: data.address,
            city: data.city,
            country: data.country,
            website: data.website,
        })
        .where(eq(organizations.id, jwtPayload.currentOrgId));

    return c.json({ message: "Business Profile updated" }, 200);
});

export default userRouteV1;
