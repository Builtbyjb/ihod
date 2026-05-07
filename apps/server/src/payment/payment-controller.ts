import { Hono } from "hono";
import { Bindings } from "@/lib/types";

const paymentRouteV1 = new Hono<{ Bindings: Bindings }>().basePath("/payments");

export default paymentRouteV1;
