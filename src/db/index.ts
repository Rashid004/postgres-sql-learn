import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema/index.js";

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({ connectionString });

export const db = drizzle(pool, { schema });
