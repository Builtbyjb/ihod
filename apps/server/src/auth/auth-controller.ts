import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Bindings } from "@/lib/types";
import { drizzle } from "drizzle-orm/d1";
import { DrizzleQueryError, eq } from "drizzle-orm";
import { members, organizations, users } from "@/db/schema";
import { generateOTP } from "@/lib/utils";
import { sign, verify } from "hono/jwt";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import type { JWTPayload } from "hono/utils/jwt/types";
import type { ResponsePayload } from "@/lib/types";

const authRouteV1 = new Hono<{ Bindings: Bindings }>().basePath("/auth");

type OTPPayload = JWTPayload & {
    userId: number;
    otp: string;
};

const loginSchema = z.object({
    email: z.string().email(),
});

const otpSchema = z.object({
    otp: z.string().length(8),
});

// TODO: Improved error handling

authRouteV1.post("/login", zValidator("json", loginSchema), async (c) => {
    const { email } = c.req.valid("json");
    const db = drizzle(c.env.DB);

    // Create user
    let result;
    try {
        result = await db.insert(users).values({ email: email }).returning({ id: users.id }).get();
    } catch (error) {
        // Fetch existing user if insert fails
        if (error instanceof DrizzleQueryError) {
            result = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).get();
        }
    }

    if (!result) {
        console.log("Error creating or finding user")
        return c.json({ message: "Internal server error" }, 500);
    }

    // Generate a OTP
    const otp = generateOTP();
    const sender = c.env.EMAIL_DOMAIN;
    if (!sender) {
        console.error("EMAIL_DOMAIN not configured");
        return c.json({ message: "Internal server error" }, 500);
    }

    // Send OTP to user name
    await c.env.SEND_EMAIL.send({
        from: sender,
        to: email,
        subject: "Your OTP code",
        text: `Your OTP code is: ${otp}`,
    });

    const exp = 60 * 30; // Token expires in 30 minutes
    const payload: OTPPayload = {
        userId: result.id,
        otp: otp,
        exp: Math.floor(Date.now() / 1000) + exp,
    };

    const secret = c.env.JWT_SECRET;
    if (!secret) {
        console.error("JWT secret not configured");
        return c.json({ message: "Internal server error" }, 500);
    }

    const token = await sign(payload, secret);

    setCookie(c, "otp_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: exp
    });

    return c.json({ message: "OTP sent to your email" }, 200);
});

authRouteV1.post("/verify-otp", zValidator("json", otpSchema), async (c) => {
    const db = drizzle(c.env.DB);

    const { otp } = c.req.valid("json");
    const otpToken = getCookie(c, "otp_token");
    if (!otpToken) {
        return c.json({ message: "OTP token not found" }, 400);
    }

    const secret = c.env.JWT_SECRET;
    if (!secret) {
        console.error("JWT secret not configured");
        return c.json({ message: "Internal server error" }, 500);
    }

    // TODO: Handle verification failure
    const decoded: OTPPayload = (await verify(otpToken, secret, "HS256")) as OTPPayload;
    if (decoded.otp !== otp) {
        return c.json({ message: "Invalid OTP" }, 400);
    }

    // Verify user exists
    const user = await db.select().from(users).where(eq(users.id, decoded.userId)).get();
    if (!user) return c.json({ message: "User not found" }, 404);

    // Verify user is part of an organization
    const member = await db.select().from(members).where(eq(members.userId, decoded.userId)).get()
    if (!member) return c.json({ message: "Member not found" }, 404);

    const exp = 60 * 60 * 24 * 90; // Token expires in 90 days
    const payload: ResponsePayload = {
        userId: decoded.userId,
        organizationId: member.organizationId,
        exp: Math.floor(Date.now() / 1000) + exp,
    };

    const refreshToken = await sign(payload, secret);

    setCookie(c, "refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        path: "/",
        maxAge: exp
    });

    const accessToken = await sign(
        {
            userId: decoded.userId,
            organizationId: member.id,
            exp: Math.floor(Date.now() / 1000) + 60 * 30, // 30 minutes
        },
        secret,
    );

    return c.json({
        message: "OTP verified",
        setupCompleted: user.setupCompleted,
        accessToken: accessToken,
    });
});

authRouteV1.get("/refresh-token", async (c) => {
    const db = drizzle(c.env.DB);

    const refreshToken = getCookie(c, "refresh_token");
    if (!refreshToken) return c.json({ message: "No refresh token" }, 401);

    const secret = c.env.JWT_SECRET;
    if (!secret) {
        console.error("JWT secret not configured");
        return c.json({ message: "Internal server error" }, 500);
    }

    // TODO: Handle verification failure
    const decoded = (await verify(refreshToken, secret, "HS256")) as ResponsePayload;

    // Get organization id
    const member = await db.select().from(members).where(eq(members.userId, decoded.userId)).get()
    if (!member) return c.json({ message: "User organization not found" }, 404);

    const accessToken = await sign(
        {
            userId: decoded.userId,
            organizationId: member.organizationId,
            exp: Math.floor(Date.now() / 1000) + 60 * 30, // 30 minutes
        },
        secret,
    );

    const response = {
        message: "Token refreshed",
        accessToken: accessToken,
    }

    return c.json(response);
});

authRouteV1.get("/logout", (c) => {
    deleteCookie(c, "refresh_token");
    return c.json({ message: "Logged out" });
});

export default authRouteV1;
