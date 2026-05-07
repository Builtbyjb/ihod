import { z } from "zod";

export const PaystackPlanResponseSchema = z.array(
    z.object({
        plan_code: z.string(),
        name: z.string(),
        description: z.string(),
        amount: z.number(),
        interval: z.string(),
        currency: z.string(),
        id: z.number(),
    }),
);
