import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Bindings } from "@/lib/types";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { users, organizations, members } from "@/db/schema";

const userRouteV1 = new Hono<{ Bindings: Bindings }>().basePath("/user");

export default userRouteV1;
