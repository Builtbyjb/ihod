import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Bindings } from "@/lib/types";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import type { ResponsePayload } from "@/lib/types";
import { users, organizations, members } from "@/db/schema";

const setupProfileSchema = z.object({
    firstname: z.string().min(2),
    lastname: z.string().min(2),
    username: z.string().min(2),
    businessName: z.string().min(2),
    businessType: z.string().min(2),
    currency: z.string().min(2),
    businessAddress: z.string().min(2),
    city: z.string().min(2),
    country: z.string().min(2),
});

const userRouteV1 = new Hono<{ Bindings: Bindings }>().basePath("/user");

userRouteV1.post(
    "/setup-profile",
    zValidator("json", setupProfileSchema),
    async (c) => {
        const data = c.req.valid("json");
        const db = drizzle(c.env.DB);
        const refreshToken = getCookie(c, "refresh_token");
        if (!refreshToken) return c.json({ message: "No refresh token" }, 401);

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("JWT secret not configured");
            return c.json({ message: "Internal server error" }, 500);
        }

        // TODO: Handle verification failure
        const decoded = (await verify(
            refreshToken,
            secret,
            "HS256",
        )) as ResponsePayload;

        // TODO: Check if setupCompleted is already true

        // update user table
        await db.update(users).set({
            firstname: data.firstname,
            lastname: data.lastname,
            username: data.username,
            setupCompleted: true,
        }).where(eq(users.id, decoded.userId));

        // Create organization
        const organization = await db.insert(organizations).values({
            name: data.businessName,
            type: data.businessType,
            address: data.businessAddress,
            city: data.city,
            country: data.country,
        }).returning({ id: organizations.id }).get();

        // Create member
        // TODO: Define roles
        await db.insert(members).values({
            userId: decoded.userId,
            organizationId: organization.id,
            roleId: 1,
        });

        return c.json({ message: "Profile setup completed" });
    },
);

export default userRouteV1;
