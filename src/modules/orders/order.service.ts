import { BadRequestError, NotFoundError } from "../../shared/errors.js";
import * as repository from "./order.repository.js";
import type { CheckoutItem } from "./order.repository.js";

export const checkout = async (customerName: string, items: CheckoutItem[]) => {
  if (!items?.length) {
    throw new BadRequestError("items is required.");
  }

  return repository.checkout(customerName, items);
};

export const getOrderById = async (id: number) => {
  const order = await repository.findOrderById(id);
  if (!order) {
    throw new NotFoundError("Order not found.");
  }

  const items = await repository.findOrderItems(id);
  return { ...order, items };
};
