import { Context } from "hono";
import { ErrorResult, OTPPayload, TokenPayload } from "./types";
import { getCookie } from "hono/cookie";
import { verify, sign } from "hono/jwt";

export function generateOTP(): string {
    const otp = (crypto.getRandomValues(new Uint32Array(1))[0] % 90000000) + 10000000;
    return otp.toString();
}

export function generateInvoiceNumber(length: number = 4): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => chars[byte % chars.length]).join("");
}

export async function parseToken(c: Context, tokenName: string): Promise<TokenPayload | ErrorResult> {
    const token = getCookie(c, tokenName);
    if (!token) {
        console.log(tokenName + " token not found");
        return new ErrorResult(tokenName + " token not found", 404);
    }

    const secret = c.env.JWT_SECRET;
    if (!secret) {
        console.error("JWT secret not configured");
        return new ErrorResult("Internal Server Error", 500);
    }

    try {
        return (await verify(token, secret, "HS256")) as TokenPayload;
    } catch (error) {
        console.log(error);
        return new ErrorResult("Internal Server Error", 500);
    }
}

export async function signToken(c: Context, payload: TokenPayload | OTPPayload): Promise<Error | string> {
    const secret = c.env.JWT_SECRET;
    if (!secret) {
        console.error("JWT secret not configured");
        return new Error("Internal Server Error");
    }

    return await sign(payload, secret);
}

export async function sendOTPEmail(c: Context, email: string): Promise<Error | string> {
    // Generate a OTP
    const otp = generateOTP();
    const sender = c.env.EMAIL_DOMAIN;
    if (!sender) {
        console.error("EMAIL_DOMAIN not configured");
        return new Error("Sender not configured");
    }

    // Send OTP to user name
    await c.env.SEND_EMAIL.send({
        from: sender,
        to: email,
        subject: "Your OTP code",
        text: `Your OTP code is: ${otp}`,
    });

    return otp;
}
