// Same shape as Gulamali-Group-ERP's shared/response/api-response.ts,
// trimmed (no pagination — this project has no paginated list endpoints).
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta: {
    timestamp: string;
  };
}

export class ApiResponseHelper {
  static success<T>(data: T, message = "Success"): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      meta: { timestamp: new Date().toISOString() },
    };
  }

  static error(message: string, error?: string): ApiResponse<null> {
    return {
      success: false,
      message,
      ...(error !== undefined && { error }),
      meta: { timestamp: new Date().toISOString() },
    };
  }
}
