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

authRouteV1.post("/login", zValidator("json", loginSchema), (c) => {
  const { email } = c.req.valid("json");
  console.log(email);
  // Create user
  // Generate a OTP
  // Send OTP to user name
  // Create a short lived jwt token that stores user id and otp in an http Only cookie
  return c.json({ message: "OTP sent to your email" });
});

authRouteV1.post("/verify-otp", zValidator("json", otpSchema), (c) => {
  const { otp } = c.req.valid("json");
  // Get the OTP and user id from the refresh token cookie
  // verify the received OTP is the equal to the one stored in the cookie
  // If equal:
  //  delete the tmp refresh token cookie
  // Generate long lived refresh and access token
  // store the refresh token in a httpOnly cookie
  // send access token in response along with user data
  // Include setupCompleted in user data
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
