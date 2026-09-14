import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { products, type NewProduct } from "../../db/schema/index.js";

// The only file that queries the `products` table — same rule the ERP
// enforces: one repository per table, nothing else touches drizzle for it.

export const insertProduct = async (values: NewProduct) => {
  const [row] = await db.insert(products).values(values).returning();
  return row!;
};

export const listProducts = async () => db.select().from(products);

export const findProductById = async (id: number) => {
  const [row] = await db.select().from(products).where(eq(products.id, id));
  return row;
};

export const updateProduct = async (
  id: number,
  values: Partial<NewProduct>,
) => {
  const [row] = await db
    .update(products)
    .set(values)
    .where(eq(products.id, id))
    .returning();
  return row;
};

export const deleteProduct = async (id: number) => {
  const [row] = await db.delete(products).where(eq(products.id, id)).returning();
  return row;
};
