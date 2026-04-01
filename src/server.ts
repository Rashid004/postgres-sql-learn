import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { closePool } from "./db/pool";

const server = app.listen(env.PORT, () => {
  logger.info(`Server running at http://localhost:${env.PORT}`);
});

const shutdown = async (signal: string): Promise<void> => {
  logger.info({ signal }, "Shutting down server");

  server.close(async (error?: Error) => {
    if (error) {
      logger.error({ err: error }, "Error while closing HTTP server");
      process.exit(1);
    }

    await closePool();
    process.exit(0);
  });
};

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
