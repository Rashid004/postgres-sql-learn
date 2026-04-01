import "dotenv/config";

const toNumber = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsedValue = Number(value);

  return Number.isNaN(parsedValue) ? fallback : parsedValue;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: toNumber(process.env.PORT, 3000),
  LOG_LEVEL: process.env.LOG_LEVEL ?? "info",
  DATABASE_URL: process.env.DATABASE_URL ?? "",
} as const;
