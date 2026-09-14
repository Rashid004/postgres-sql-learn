import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import "dotenv/config";

const run = async (): Promise<void> => {
  const connectionString = process.env.DATABASE_URL;

  const pool = new Pool({ connectionString, max: 1 });

  try {
    const db = drizzle(pool);
    await migrate(db, { migrationsFolder: "src/db/migrations" });
    console.log("Migrations applied");
  } finally {
    await pool.end();
  }
};

run().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
