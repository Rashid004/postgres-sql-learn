import { BadRequestError, NotFoundError } from "../../shared/errors.js";
import * as repository from "./product.repository.js";

export interface CreateProductInput {
  name: string;
  priceCents: number;
  stock: number;
}

export interface UpdateProductInput {
  name?: string;
  priceCents?: number;
  stock?: number;
}

// Business rules live here, never in the repository or the controller.
export const createProduct = async (input: CreateProductInput) => {
  if (input.priceCents < 0) {
    throw new BadRequestError("priceCents cannot be negative.");
  }
  if (input.stock < 0) {
    throw new BadRequestError("stock cannot be negative.");
  }

  return repository.insertProduct(input);
};

export const listProducts = async () => repository.listProducts();

export const getProductById = async (id: number) => {
  const product = await repository.findProductById(id);
  if (!product) {
    throw new NotFoundError("Product not found.");
  }
  return product;
};

export const updateProduct = async (
  id: number,
  input: UpdateProductInput,
) => {
  if (input.priceCents !== undefined && input.priceCents < 0) {
    throw new BadRequestError("priceCents cannot be negative.");
  }
  if (input.stock !== undefined && input.stock < 0) {
    throw new BadRequestError("stock cannot be negative.");
  }

  const product = await repository.updateProduct(id, input);
  if (!product) {
    throw new NotFoundError("Product not found.");
  }
  return product;
};

export const deleteProduct = async (id: number) => {
  const product = await repository.deleteProduct(id);
  if (!product) {
    throw new NotFoundError("Product not found.");
  }
};
