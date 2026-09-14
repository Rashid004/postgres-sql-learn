import { Router } from "express";
import * as controller from "./order.controller.js";

export const orderRoutes = Router();

orderRoutes.post("/checkout", controller.checkout);
orderRoutes.get("/:id", controller.getById);
