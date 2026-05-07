import { Hono } from "hono";
import { Bindings, ErrorResult } from "@/lib/types";
import { parseToken, verifyPaystackSignature } from "@/lib/utils";
import { plans, freePlan } from "@/lib/store";
import { PaystackPlanResponseSchema } from "./payment-zod-schema";

const paymentRouteV1 = new Hono<{ Bindings: Bindings }>().basePath("/payments");

paymentRouteV1.get("/plans", async (c) => {
    try {
        const response = await fetch("https://api.paystack.co/plan", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${c.env.PAYSTACK_SECRET}`,
            },
        });

        const result: any = await response.json();
        const parsedResult = PaystackPlanResponseSchema.parse(result.data);

        const subPlans = parsedResult.map((r) => {
            return {
                id: r.id,
                planCode: r.plan_code,
                name: r.name,
                description: r.description,
                amount: r.amount / 100,
                currency: r.currency,
                interval: r.interval,
                features: plans[r.plan_code].features,
                disabled: plans[r.plan_code].disabled,
                featured: plans[r.plan_code].featured,
                cta: plans[r.plan_code].cta,
            };
        });

        return c.json({ plans: [freePlan, ...subPlans] }, 200);
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return c.json({ message: error.message }, 500);
        }
        return c.json({ message: "Internal Server Error" }, 500);
    }
});

paymentRouteV1.post("/subscribe", async (c) => {
    // TODO: Validate data
    const data = await c.req.json();

    const parsedToken = await parseToken(c, "refresh_token");
    if (parsedToken instanceof ErrorResult) return c.json({ message: parsedToken.message }, parsedToken.code);

    try {
        const response = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${c.env.PAYSTACK_SECRET}`,
            },
            body: JSON.stringify({
                email: parsedToken.email,
                amount: 0,
                plan: data.planCode,
            }),
        });

        const result = await response.json();
        // TODO: Validate result

        // TODO: Save plan Code and plan id to organizations table
        return c.json({ data: result }, 200);
    } catch (error) {
        console.log(error);
    }
});

paymentRouteV1.get("/callback", async (c) => {
    // Get the reference from the URL
    const reference = c.req.query("reference");

    if (!reference) {
        return c.json({ error: "No reference found" }, 400);
    }

    try {
        // Verify transaction
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${c.env.PAYSTACK_SECRET}`,
            },
        });

        const data: any = await response.json();
        // console.log(data);

        if (data.status && data.data.status === "success") {
            // Success: Update your DB (e.g., set user as "active")
            // Then redirect the user to your frontend success page
            return c.redirect("http://localhost:5173/settings/billing");
        } else {
            // Payment failed or is still pending
            return c.redirect("http://localhost:5173/settings/billing");
        }
    } catch (error) {
        console.log(error);
        return c.json({ error: "Verification failed" }, 500);
    }
});

paymentRouteV1.post("/webhook", async (c) => {
    const signature = c.req.header("x-paystack-signature") ?? "";

    // Get the raw body as a string for verification
    const body = await c.req.text();

    // Verify the signature
    const isValidSignature = verifyPaystackSignature(c.env.PAYSTACK_SECRET, body, signature);

    if (!isValidSignature) {
        return c.json({ message: "Invalid signature" }, 401);
    }

    // Parse the body and handle events
    const event = JSON.parse(body);

    if (event.event === "charge.success") {
        // Update your database here
        // console.log(event);
    }

    // Always return a 200 OK to acknowledge receipt
    return c.json({ status: "success" }, 200);
});

export default paymentRouteV1;
