import type { Request, Response } from "express";

import { getDatabaseStatus } from "../service/database.service";

export const getDatabaseInfo = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const databaseStatus = await getDatabaseStatus();

  res.status(databaseStatus.connected ? 200 : 503).json({
    success: databaseStatus.connected,
    ...databaseStatus,
  });
};
