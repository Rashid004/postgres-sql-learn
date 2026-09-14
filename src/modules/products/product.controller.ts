import type { NextFunction, Request, Response } from "express";
import { ApiResponseHelper } from "../../shared/api-response.js";
import * as service from "./product.service.js";

// Controllers only: parse the request, call the service, shape the response.
// No drizzle, no business rules — those live in repository/service.

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const product = await service.createProduct(req.body);
    res
      .status(201)
      .json(ApiResponseHelper.success(product, "Product created"));
  } catch (error) {
    next(error);
  }
};

export const list = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const products = await service.listProducts();
    res.json(ApiResponseHelper.success(products));
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
    const product = await service.getProductById(Number(req.params.id));
    res.json(ApiResponseHelper.success(product));
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const product = await service.updateProduct(
      Number(req.params.id),
      req.body,
    );
    res.json(ApiResponseHelper.success(product, "Product updated"));
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await service.deleteProduct(Number(req.params.id));
    res.json(ApiResponseHelper.success(null, "Product deleted"));
  } catch (error) {
    next(error);
  }
};
