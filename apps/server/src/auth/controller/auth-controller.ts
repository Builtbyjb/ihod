import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const loginSchema = z.object({
  email: z.string().email(),
});

const otpSchema = z.object({
  otp: z.string().length(8),
});

const authRouteV1 = new Hono().basePath("/auth");
// authRouteV1.get("/", (c) => {
//   return c.text("Auth route");
// });

authRouteV1.post("/login", zValidator("json", loginSchema), (c) => {
  const { email } = c.req.valid("json");
  console.log(email);
  return c.json({ message: "Login successful" });
});

authRouteV1.post("/verify-otp", zValidator("json", otpSchema), (c) => {
  const { otp } = c.req.valid("json");
  console.log(otp);
  return c.json({ message: "OTP verified" });
});

authRouteV1.post("/refresh-token", (c) => {
  return c.json({ message: "Refresh token" });
});

authRouteV1.post("/logout", (c) => {
  return c.json({ message: "Logout" });
  // app.post("/api/auth/logout", (req, res) => {
  //   const refreshToken = req.cookies.refreshToken;

  //   // 1. Revoke the token in DB so it can never be used again
  //   await db.revokeRefreshToken(refreshToken);

  //   // 2. Clear the cookie
  //   res.clearCookie("refreshToken", { httpOnly: true, secure: true });

  //   res.json({ success: true });
  // });
});

export default authRouteV1;
