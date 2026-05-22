class AppError extends Error {
  public statusCode: number;
  public errors: string;

  constructor(statusCode: number, message: string, errors?: string) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors || message;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
