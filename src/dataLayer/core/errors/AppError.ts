export type AppErrorCode =
  | 'STORAGE_READ_FAILED'
  | 'STORAGE_WRITE_FAILED'
  | 'MALFORMED_DATA'
  | 'UNSUPPORTED_SCHEMA'
  | 'ABORTED'
  | 'ID_GENERATION_FAILED'
  | 'DUPLICATE_BOOKING_ID'
  | 'HOLD_EXPIRED'
  | 'INVALID_BOOKING'
  | 'UNKNOWN';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly cause?: unknown;

  constructor(code: AppErrorCode, message: string = code, cause?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.cause = cause;
  }
}

export const isAppError = (error: unknown): error is AppError =>
  error instanceof AppError;

export const toAppError = (
  error: unknown,
  fallbackCode: AppErrorCode = 'UNKNOWN',
): AppError =>
  isAppError(error)
    ? error
    : new AppError(
        fallbackCode,
        error instanceof Error ? error.message : fallbackCode,
        error,
      );

export const toAppErrorCode = (
  error: unknown,
  fallbackCode: AppErrorCode = 'UNKNOWN',
): AppErrorCode => toAppError(error, fallbackCode).code;
