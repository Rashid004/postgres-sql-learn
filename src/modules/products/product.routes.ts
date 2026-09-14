import { Router } from "express";
import * as controller from "./product.controller.js";

export const productRoutes = Router();

productRoutes.get("/", controller.list);
productRoutes.get("/:id", controller.getById);
productRoutes.post("/", controller.create);
productRoutes.patch("/:id", controller.update);
productRoutes.delete("/:id", controller.remove);
