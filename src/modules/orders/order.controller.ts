import type { NextFunction, Request, Response } from "express";
import { ApiResponseHelper } from "../../shared/api-response.js";
import * as service from "./order.service.js";

export const checkout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { customerName, items } = req.body;
    const order = await service.checkout(customerName, items);
    res.status(201).json(ApiResponseHelper.success(order, "Order placed"));
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const order = await service.getOrderById(Number(req.params.id));
    res.json(ApiResponseHelper.success(order));
  } catch (error) {
    next(error);
  }
};
