import { logger } from "../config/logger";
import {
  type DatabaseSnapshot,
  getDatabaseSnapshot,
} from "../repository/database.repository";

export interface DatabaseStatus {
  connected: boolean;
  snapshot: DatabaseSnapshot | null;
  message: string;
}

export const getDatabaseStatus = async (): Promise<DatabaseStatus> => {
  try {
    const snapshot = await getDatabaseSnapshot();

    return {
      connected: true,
      snapshot,
      message: "PostgreSQL connection is working.",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected database error.";

    logger.error({ err: error }, "Database status check failed");

    return {
      connected: false,
      snapshot: null,
      message,
    };
  }
};
