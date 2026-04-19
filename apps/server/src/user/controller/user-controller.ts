import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const setupProfileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  username: z.string().min(2),
  businessName: z.string().min(2),
  businessType: z.string().min(2),
  currency: z.string().min(2),
  businessAddress: z.string().min(2),
});

const userRouteV1 = new Hono().basePath("/user");

userRouteV1.post(
  "/setup-profile",
  zValidator("json", setupProfileSchema),
  (c) => {
    const data = c.req.valid("json");
    // decode refresh token from cookie
    // get user id from decoded token
    // update user table
    // Create member
    // Create organization
    console.log(data);
    return c.json({ message: "Setup profile" });
  },
);

export default userRouteV1;
