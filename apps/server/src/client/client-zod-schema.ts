import { z } from "zod";

export const clientFormSchema = z.object({
    name: z.string().nonempty(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    country: z.string(),
})

export const clientSchema = z.object({
    id: z.string(),
    organizationId: z.number(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    country: z.string(),
    createdAt: z.date(),
})

export const clientListSchema = z.array(
    z.object({
        id: z.string(),
        organizationId: z.number(),
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        address: z.string(),
        city: z.string(),
        country: z.string(),
        createdAt: z.date(),
    })
)
