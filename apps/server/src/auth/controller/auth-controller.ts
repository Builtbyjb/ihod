import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Bindings } from "@/lib/types";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { generateOTP } from "@/auth/service/auth-service";
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
    // NOTE: This could error
    const result = await db
        .insert(users)
        .values({ email: email })
        .returning({ id: users.id });

    // Generate a OTP
    const otp = generateOTP();

    // TODO: Send OTP to user name

    // Create a short lived jwt token that stores user id and otp in an http Only cookie
    const payload: OTPPayload = {
        userId: result[0].id,
        otp: otp,
        exp: Math.floor(Date.now() / 1000) + 60 * 30, // Token expires in 30 minutes
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("JWT secret not configured");
        return c.json({ message: "Internal server error" }, 500);
    }

    const token = await sign(payload, secret);

    setCookie(c, "otp_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        path: "/",
        maxAge: 60 * 30, // 30 minutes
    });

    return c.json({ message: "OTP sent to your email" });
});

authRouteV1.post("/verify-otp", zValidator("json", otpSchema), async (c) => {
    const db = drizzle(c.env.DB);

    const { otp } = c.req.valid("json");
    const otpToken = getCookie(c, "otp_token");
    if (!otpToken) {
        return c.json({ message: "OTP token not found" }, 400);
    }

    // TODO: Handle verification failure
    const decoded: OTPPayload = (await verify(
        otpToken,
        "mySecretKey",
        "HS256",
    )) as OTPPayload;

    if (decoded.otp !== otp) {
        return c.json({ message: "Invalid OTP" }, 400);
    }

    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 90; // Token expires in 90 days
    const payload: ResponsePayload = {
        userId: decoded.userId,
        exp: exp,
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("JWT secret not configured");
        return c.json({ message: "Internal server error" }, 500);
    }

    const refreshToken = await sign(payload, secret);

    setCookie(c, "refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        path: "/",
        maxAge: 60 * 30, // 30 minutes
    });

    const result = await db
        .select()
        .from(users)
        .where(eq(users.id, decoded.userId))
        .get();

    if (!result) return c.json({ message: "User not found" }, 404);

    const accessToken = await sign(
        {
            userId: decoded.userId,
            exp: Math.floor(Date.now() / 1000) + 60 * 30, // 30 minutes
        },
        secret,
    );

    return c.json({
        message: "OTP verified",
        setupCompleted: result.setupCompleted,
        accessToken: accessToken,
    });
});

authRouteV1.post("/refresh-token", async (c) => {
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

    const accessToken = await sign(
        {
            userId: decoded.userId,
            exp: Math.floor(Date.now() / 1000) + 60 * 30, // 30 minutes
        },
        secret,
    );

    return c.json({ message: "Refresh token", accessToken: accessToken });
});

authRouteV1.post("/logout", (c) => {
    deleteCookie(c, "refresh_token");
    return c.json({ message: "Logged out" });
});

export default authRouteV1;
