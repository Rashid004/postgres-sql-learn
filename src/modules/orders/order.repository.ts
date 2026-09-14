import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { orderItems, orders, products } from "../../db/schema/index.js";
import { ConflictError, NotFoundError } from "../../shared/errors.js";

export interface CheckoutItem {
  productId: number;
  quantity: number;
}

/**
 * Checkout spans three tables (products, orders, order_items) and must
 * commit or fail as one unit — same shape as Gulamali-Group-ERP's
 * organization.repository.ts writes: read the row `for("update")` to lock
 * it, mutate, then write the dependent rows, all inside one `db.transaction`.
 *
 * Errors are thrown here rather than in the service because the transaction
 * has to abort WHILE the row lock is still held — returning `undefined` and
 * letting the service decide would mean committing first and checking after,
 * which is too late.
 */
export const checkout = async (customerName: string, items: CheckoutItem[]) =>
  db.transaction(async (tx) => {
    let totalCents = 0;
    const lineItems: {
      productId: number;
      quantity: number;
      unitPriceCents: number;
    }[] = [];

    for (const item of items) {
      const [product] = await tx
        .select()
        .from(products)
        .where(eq(products.id, item.productId))
        .for("update");

      if (!product) {
        throw new NotFoundError(`Product ${item.productId} not found.`);
      }
      if (product.stock < item.quantity) {
        throw new ConflictError(`Not enough stock for "${product.name}".`);
      }

      await tx
        .update(products)
        .set({ stock: product.stock - item.quantity })
        .where(eq(products.id, product.id));

      totalCents += product.priceCents * item.quantity;
      lineItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPriceCents: product.priceCents,
      });
    }

    const [order] = await tx
      .insert(orders)
      .values({ customerName, totalCents })
      .returning();

    await tx
      .insert(orderItems)
      .values(lineItems.map((line) => ({ ...line, orderId: order!.id })));

    return order!;
  });

export const findOrderById = async (id: number) => {
  const [row] = await db.select().from(orders).where(eq(orders.id, id));
  return row;
};

export const findOrderItems = async (orderId: number) =>
  db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
