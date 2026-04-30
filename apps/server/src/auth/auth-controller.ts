import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { Bindings } from "@/lib/types";
import { drizzle } from "drizzle-orm/d1";
import { DrizzleQueryError, eq } from "drizzle-orm";
import { members, organizations, users } from "@/db/schema";
import { parseToken, signToken, sendOTPEmail } from "@/lib/utils";
import { setCookie, deleteCookie } from "hono/cookie";
import type { OTPPayload, TokenPayload } from "@/lib/types";
import { ErrorResult } from "@/lib/types";
import { getAccessTokenExp, ACCESS_TOKEN_MAX_AGE, getRefreshTokenExp, REFRESH_TOKEN_MAX_AGE } from "@/lib/constants";
import { loginSchema, otpSchema, signupSchema } from "./auth-zod-schema";

const authRouteV1 = new Hono<{ Bindings: Bindings }>().basePath("/auth");

// TODO: Improved error handling

authRouteV1.post("/login", zValidator("json", loginSchema), async (c) => {
    const { email } = c.req.valid("json");
    const db = drizzle(c.env.DB);

    let user = await db.select().from(users).where(eq(users.email, email)).get();
    if (!user) {
        console.log("Error finding user");
        return c.json({ message: "User not found" }, 404);
    }

    const otp = await sendOTPEmail(c, email);
    if (otp instanceof Error) return c.json({ message: "Internal server error" }, 500);

    const payload: OTPPayload = {
        userId: user.id,
        currentOrgId: user.currentOrgId,
        otp: otp,
        exp: getAccessTokenExp(),
    };

    const signResult = await signToken(c, payload);
    if (signResult instanceof Error) return c.json({ message: signResult.message }, 500);

    setCookie(c, "otp_token", signResult, {
        httpOnly: true,
        secure: true,
        sameSite: c.env.ENV === "dev" ? "none" : "lax",
        path: "/",
        maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    return c.json({ message: "OTP sent to your email" }, 200);
});

authRouteV1.post("/signup", zValidator("json", signupSchema), async (c) => {
    const data = c.req.valid("json");
    const db = drizzle(c.env.DB);

    // Check if user exists
    const prevUser = await db.select().from(users).where(eq(users.email, data.email)).get();
    if (prevUser) return c.json({ message: "A user will this email address exists" }, 400);

    let organization: { id: number } | undefined;
    let user: { id: number } | undefined;
    let member: { id: number } | undefined;

    try {
        // Create organization
        organization = await db
            .insert(organizations)
            .values({
                name: data.businessName,
                type: data.businessType,
                address: data.businessAddress,
                city: data.city,
                country: data.country,
                website: data.website,
            })
            .returning({ id: organizations.id })
            .get();

        // Create user
        user = await db
            .insert(users)
            .values({
                email: data.email,
                firstname: data.firstname,
                lastname: data.lastname,
                username: data.username,
                currentOrgId: organization.id,
            })
            .returning({ id: users.id })
            .get();

        // Create member
        member = await db
            .insert(members)
            .values({
                userId: user.id,
                organizationId: organization.id,
                roleId: 1,
            })
            .returning({ id: members.id })
            .get();

        const otp = await sendOTPEmail(c, data.email);
        if (otp instanceof Error) return c.json({ message: "Internal server error" }, 500);

        const payload: OTPPayload = {
            userId: user.id,
            currentOrgId: organization.id,
            otp: otp,
            exp: getAccessTokenExp(),
        };

        const signResult = await signToken(c, payload);
        if (signResult instanceof Error) return c.json({ message: signResult.message }, 500);

        setCookie(c, "otp_token", signResult, {
            httpOnly: true,
            secure: true,
            sameSite: c.env.ENV === "dev" ? "None" : "lax",
            path: "/",
            maxAge: ACCESS_TOKEN_MAX_AGE,
        });

        return c.json({ message: "Sign up completed" }, 200);
    } catch (error) {
        console.log(error);

        // Clean up on failure
        if (error instanceof DrizzleQueryError) {
            if (user?.id) await db.delete(users).where(eq(users.id, user.id));
            if (organization?.id) await db.delete(organizations).where(eq(organizations.id, organization.id));
            if (member?.id) await db.delete(members).where(eq(members.id, member.id));
        }

        return c.json({ message: "internal server error" }, 500);
    }
});

authRouteV1.post("/verify-otp", zValidator("json", otpSchema), async (c) => {
    const db = drizzle(c.env.DB);
    const { otp } = c.req.valid("json");

    const parsed = await parseToken(c, "otp_token");
    if (parsed instanceof ErrorResult) return c.json({ message: parsed.message }, parsed.code);

    // Verify OTP code
    if (!parsed.otp) return c.json({ message: "OTP not found" }, 400);
    if (parsed.otp !== otp) return c.json({ message: "Invalid OTP" }, 400);

    // Verify user exists
    const user = await db.select().from(users).where(eq(users.id, parsed.userId)).get();
    if (!user) return c.json({ message: "User not found" }, 404);

    // Get organization details
    const organization = await db.select().from(organizations).where(eq(organizations.id, parsed.currentOrgId)).get();
    if (!organization) return c.json({ message: "User organization not found" }, 404);

    const refreshPayload: TokenPayload = {
        userId: parsed.userId,
        username: user.username,
        email: user.email,
        currentOrgId: parsed.currentOrgId,
        organizationName: organization.name,
        exp: getRefreshTokenExp(),
    };

    const refreshToken = await signToken(c, refreshPayload);
    if (refreshToken instanceof Error) return c.json({ message: refreshToken.message }, 500);

    setCookie(c, "refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: c.env.ENV === "dev" ? "none" : "lax",
        path: "/",
        maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    const accessPayload: TokenPayload = {
        userId: parsed.userId,
        username: user.username,
        email: user.email,
        currentOrgId: parsed.currentOrgId,
        organizationName: organization.name,
        exp: getAccessTokenExp(),
    };

    const accessToken = await signToken(c, accessPayload);
    if (accessToken instanceof Error) c.json({ message: accessToken.message }, 500);

    return c.json(
        {
            accessToken: accessToken,
            user: {
                username: user.username,
                organizationName: organization.name,
                email: user.email,
            },
        },
        200,
    );
});

authRouteV1.get("/refresh-token", async (c) => {
    const db = drizzle(c.env.DB);

    const parsed = await parseToken(c, "refresh_token");
    if (parsed instanceof ErrorResult) return c.json({ message: parsed.message }, parsed.code);

    // Get organization details
    const organization = await db.select().from(organizations).where(eq(organizations.id, parsed.currentOrgId)).get();
    if (!organization) return c.json({ message: "User organization not found" }, 404);

    const accessPayload: TokenPayload = {
        userId: parsed.userId,
        username: parsed.username,
        email: parsed.email,
        currentOrgId: parsed.currentOrgId,
        organizationName: organization.name,
        exp: getAccessTokenExp(),
    };

    const accessToken = await signToken(c, accessPayload);
    if (accessToken instanceof Error) c.json({ message: accessToken.message }, 500);

    return c.json(
        {
            accessToken: accessToken,
            user: {
                username: parsed.username,
                organizationName: organization.name,
                email: parsed.email,
            },
        },
        200,
    );
});

authRouteV1.get("/logout", (c) => {
    deleteCookie(c, "refresh_token");
    return c.json({ message: "Logged out" });
});

export default authRouteV1;
