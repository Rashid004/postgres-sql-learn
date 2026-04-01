import { pool } from "../db/pool";

export interface DatabaseSnapshot {
  currentTime: string;
  currentDatabase: string;
  currentUser: string;
}

export const getDatabaseSnapshot = async (): Promise<DatabaseSnapshot> => {
  if (!pool) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const result = await pool.query<{
    currentTime: Date;
    currentDatabase: string;
    currentUser: string;
  }>(`
    SELECT
      NOW() AS "currentTime",
      current_database() AS "currentDatabase",
      current_user AS "currentUser"
  `);

  const row = result.rows[0];

  return {
    currentTime: row.currentTime.toISOString(),
    currentDatabase: row.currentDatabase,
    currentUser: row.currentUser,
  };
};
