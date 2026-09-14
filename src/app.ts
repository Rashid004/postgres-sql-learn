import express from "express";
import { productRoutes } from "./modules/products/product.routes.js";
import { orderRoutes } from "./modules/orders/order.routes.js";
import { errorHandler } from "./shared/error-handler.js";

export const app = express();

app.use(express.json());

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.get("/health", (_req, res) => res.json({ ok: true }));

// Must be registered last — Express only calls a 4-arg middleware for
// errors passed to `next(error)`.
app.use(errorHandler);
