import { Context } from "hono";
import { ErrorResult, InvoiceNumber, TokenPayload } from "./types";
import { getCookie } from "hono/cookie";
import { verify, sign } from "hono/jwt";

export function generateOTP(): string {
    const otp = (crypto.getRandomValues(new Uint32Array(1))[0] % 90000000) + 10000000;
    return otp.toString();
}

export function getNewInvoiceNumber(invoiceNumber: InvoiceNumber): InvoiceNumber {
    let year = 0;
    let currentNumber = 0;

    if (getCurrentYear() > invoiceNumber.year) {
        year = getCurrentYear();
        currentNumber = 1;
    } else {
        year = invoiceNumber.year;
        currentNumber = invoiceNumber.currentNumber + 1;
    }

    return { year, currentNumber };
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
        return new ErrorResult("Error verifying token", 403);
    }
}

export async function signToken(c: Context, payload: TokenPayload): Promise<Error | string> {
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

export function getCurrentYear(): number {
    return new Date().getFullYear();
}

// Helper to verify Paystack HMAC-SHA512 signature
export async function verifyPaystackSignature(secret: string, body: string, signature: string): Promise<boolean> {
    const encoder = new TextEncoder();

    // Import the secret key
    const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-512" }, false, [
        "sign",
    ]);

    // Sign the body
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(body));

    // Convert to hex string
    const hash = Array.from(new Uint8Array(signatureBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    return hash === signature;
}

export function getBlobURL(c: Context, key: string): string {
    return `${c.env.SERVER_URL}/api/v1/blobs/${key}`;
}
