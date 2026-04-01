import { Pool } from "pg";

import { env } from "../config/env";
import { logger } from "../config/logger";

export const pool = env.DATABASE_URL
  ? new Pool({
      connectionString: env.DATABASE_URL,
      ssl:
        env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
    })
  : null;

if (!pool) {
  logger.warn(
    "DATABASE_URL is missing. Database routes will respond, but PostgreSQL will not connect yet.",
  );
}

export const closePool = async (): Promise<void> => {
  if (!pool) {
    return;
  }

  await pool.end();
  logger.info("PostgreSQL pool closed.");
};
