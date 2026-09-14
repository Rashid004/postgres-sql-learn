// Simplified version of Gulamali-Group-ERP's shared/errors/error.ts —
// operational errors we throw on purpose, that the error handler turns into
// the matching HTTP response instead of a generic 500.
export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "The request could not be understood.") {
    super(message, 400);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "The requested resource was not found.") {
    super(message, 404);
  }
}

export class ConflictError extends ApiError {
  constructor(message = "This conflicts with an existing resource.") {
    super(message, 409);
  }
}
