import { Hono } from "hono";
import { Bindings } from "@/lib/types";

const clientRouteV1 = new Hono<{ Bindings: Bindings }>().basePath("/client")

clientRouteV1.post("/create", (c) => {
    const data = c.req.json();
    console.log(data)

    return c.json({ message: "Client created" }, 200)
})


export default clientRouteV1;
