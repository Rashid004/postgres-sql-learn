import type { NextFunction, Request, Response } from "express";
import { ApiResponseHelper } from "./api-response.js";
import { ApiError } from "./errors.js";

// Postgres error shape (node-postgres), keyed by SQLSTATE code — same idea as
// Gulamali-Group-ERP's error-handler.ts, trimmed to the one code worth
// special-casing for a small project: unique_violation.
interface PgError extends Error {
  code?: string;
}

// This is what makes `next(error)` in every controller meaningful — it's the
// one place that turns a thrown error into an HTTP response, so controllers
// never format error JSON themselves.
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // Express only treats a 4-argument function as error middleware.
  _next: NextFunction,
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json(ApiResponseHelper.error(err.message));
    return;
  }

  const pgErr = err as PgError;
  if (pgErr.code === "23505") {
    res
      .status(409)
      .json(ApiResponseHelper.error("This record already exists."));
    return;
  }

  console.error(err);
  res
    .status(500)
    .json(ApiResponseHelper.error("Something went wrong on our end."));
};
