/**
 * Utility functions for error handling in the backend
 */

/**
 * Extracts error message from unknown error type
 * Replaces `catch (error: any)` pattern with proper TypeScript typing
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
};

/**
 * Standard API response format
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Creates a success response
 */
export const successResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
  success: true,
  data,
  message,
});

/**
 * Creates an error response
 */
export const errorResponse = (message: string, error?: string): ApiResponse => ({
  success: false,
  message,
  error,
});
