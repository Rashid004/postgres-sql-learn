import express, { type NextFunction, type Request, type Response } from "express";
import pinoHttp from "pino-http";

import { logger } from "./config/logger";
import { router } from "./routes";

const app = express();

app.use(express.json());
app.use(
  pinoHttp({
    logger,
  }),
);

app.use(router);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

app.use(
  (error: Error, _req: Request, res: Response, _next: NextFunction): void => {
    logger.error({ err: error }, "Unhandled application error");

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  },
);

export { app };
