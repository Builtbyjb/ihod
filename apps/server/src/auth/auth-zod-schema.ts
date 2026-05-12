import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
});

export const otpSchema = z.object({
    otp: z.string().length(8),
});

export const signupSchema = z.object({
    firstname: z.string().min(2),
    lastname: z.string().min(2),
    email: z.string().min(2),
    username: z.string().min(2),
    businessName: z.string().min(2),
    businessType: z.string().min(2),
    businessAddress: z.string().min(2),
    city: z.string().min(2),
    country: z.string().min(2),
    website: z.string(),
});

export const PaystackCustomerResponseSchema = z.object({
    status: z.boolean(),
    message: z.string(),
    data: z.object({
        email: z.string().email(),
        integration: z.number(),
        domain: z.string(),
        customer_code: z.string(),
        id: z.number(),
        identified: z.boolean(),
    }),
});
