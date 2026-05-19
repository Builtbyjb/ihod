import { Hono } from "hono";
import { Bindings, TokenPayload } from "@/lib/types";
import { verifyPaystackSignature } from "@/lib/utils";
import { plans, freePlan } from "@/lib/store";
import {
    PaystackPlanResponseSchema,
    PaystackSubscriptionSchema,
    PaystackSubscribeSchema,
    CallbackResponseSchema,
} from "./payment-zod-schema";
import { authMiddleware } from "@/middleware/auth-middleware";
import { zValidator } from "@hono/zod-validator";
import { drizzle } from "drizzle-orm/d1";
import { organizations } from "@/db/schema";
import { eq } from "drizzle-orm";

const paymentRouteV1 = new Hono<{ Bindings: Bindings }>().basePath("/payments");
paymentRouteV1.use("/paystack/*", authMiddleware());

paymentRouteV1.get("/paystack/plans", async (c) => {
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

paymentRouteV1.post("/paystack/subscribe", zValidator("json", PaystackSubscribeSchema), async (c) => {
    const data = c.req.valid("json");
    const jWtPayload = c.get("jwtPayload") as TokenPayload;

    try {
        const response = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${c.env.PAYSTACK_SECRET}`,
            },
            body: JSON.stringify({
                email: jWtPayload.email,
                amount: 0,
                plan: data.planCode,
            }),
        });

        // TODO: Validate result
        const result = await response.json();

        return c.json({ data: result }, 200);
    } catch (error) {
        console.log(error);
        return c.json({ error: "Internal Server Error" }, 500);
    }
});

paymentRouteV1.get("/paystack/subscriptions", async (c) => {
    const jwtPayload = c.get("jwtPayload") as TokenPayload;

    try {
        const response = await fetch(`https://api.paystack.co/subscription?customer=${jwtPayload.paystackCustomerId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${c.env.PAYSTACK_SECRET}`,
            },
        });

        const result: any = await response.json();

        const subs = result.data.map((r: any) => {
            return {
                id: r.id,
                planName: r.plan.name,
                status: r.status,
                amount: {
                    currency: r.plan.currency,
                    value: r.amount / 100,
                },
                subscriptionCode: r.subscription_code,
                emailToken: r.email_token,
                nextBillingCycle: r.next_payment_date,
            };
        });

        return c.json({ data: subs }, 200);
    } catch (error) {
        console.log(error);
        return c.json({ error: "Internal Server Error" }, 500);
    }
});

paymentRouteV1.post("/paystack/subcriptions/enable", zValidator("json", PaystackSubscriptionSchema), async (c) => {
    const data = c.req.valid("json");

    try {
        const response = await fetch("https://api.paystack.co/subscription/enable", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${c.env.PAYSTACK_SECRET}`,
            },
            body: JSON.stringify({
                code: data.subscriptionCode,
                token: data.emailToken,
            }),
        });

        if (!response.ok) throw new Error("An error occurred while enabling subscription");
        // TODO: update subscription status to disable

        const result: any = await response.json();

        return c.json({ message: result.message }, 200);
    } catch (error) {
        console.log(error);
        return c.json({ error: "Internal Server Error" }, 500);
    }
});

paymentRouteV1.post("/paystack/subcriptions/disable", zValidator("json", PaystackSubscriptionSchema), async (c) => {
    const data = c.req.valid("json");

    try {
        const response = await fetch("https://api.paystack.co/subscription/disable", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${c.env.PAYSTACK_SECRET}`,
            },
            body: JSON.stringify({
                code: data.subscriptionCode,
                token: data.emailToken,
            }),
        });

        if (!response.ok) throw new Error("An error occurred while disabling subscription");
        // TODO: update subscription status to disable

        const result: any = await response.json();

        return c.json({ message: result.message }, 200);
    } catch (error) {
        console.log(error);
        return c.json({ error: "Internal Server Error" }, 500);
    }
});

paymentRouteV1.post("/paystack/subscriptions/update", zValidator("json", PaystackSubscriptionSchema), async (c) => {
    const data = c.req.valid("json");

    try {
        const response = await fetch(`https://api.paystack.co/subscription/${data.subscriptionCode}/manage/link`, {
            headers: {
                Authorization: `Bearer ${c.env.PAYSTACK_SECRET}`,
            },
        });

        if (!response.ok) throw new Error("An error occurred while fetching subscription update link");

        const result: any = await response.json();
        return c.json({ updateLink: result.data.link }, 200);
    } catch (error) {
        console.log(error);
        return c.json({ error: "Internal Server Error" }, 500);
    }
});

paymentRouteV1.get("/paystack-fn/callback", async (c) => {
    // Get the reference from the URL
    const reference = c.req.query("reference");
    const db = drizzle(c.env.DB);

    if (!reference) return c.json({ error: "No reference found" }, 400);

    try {
        // Verify transaction
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${c.env.PAYSTACK_SECRET}`,
            },
        });

        const data: any = await response.json();
        const parsedData = CallbackResponseSchema.parse(data);
        // console.log("Callback: ", data);

        const url = c.env.FRONTEND_URL;
        if (!url) {
            console.log("Frontend url not set");
            return c.json({ error: "Internal Server Error" }, 500);
        }

        if (parsedData.status && parsedData.data.status === "success") {
            // Update db on success
            await db
                .update(organizations)
                .set({
                    paystackSubscriptionStatus: "active",
                    paystackPlanCode: parsedData.data.planCode,
                    paystackPlanId: parsedData.data.plan.id,
                })
                .where(eq(organizations.paystackCustomerId, parsedData.data.customer.id));
        }

        return c.redirect(`${url}/settings/billing`);
    } catch (error) {
        console.log(error);
        return c.json({ error: "Verification failed" }, 500);
    }
});

paymentRouteV1.post("/paystack-fn/webhook", async (c) => {
    const signature = c.req.header("x-paystack-signature") ?? "";

    // Get the raw body as a string for verification
    const body = await c.req.text();

    // Verify the signature
    const isValidSignature = verifyPaystackSignature(c.env.PAYSTACK_SECRET, body, signature);
    if (!isValidSignature) return c.json({ message: "Invalid signature" }, 401);

    // Parse the body and handle events
    // const event = JSON.parse(body);
    // console.log("Webhook: ", event);

    // if (event.event === "charge.success") {}

    // Return a 200 OK to acknowledge receipt
    return c.json({ status: "success" }, 200);
});

export default paymentRouteV1;
