
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 400,
    public code = "APP_ERROR",
  ) {
    super(message)
  }

  static unauthorized(msg = "Unauthorized") {
    return new AppError(msg, 401, "UNAUTHORIZED")
  }

  static forbidden(msg = "Forbidden") {
    return new AppError(msg, 403, "FORBIDDEN")
  }

  static notFound(msg = "Not Found") {
    return new AppError(msg, 404, "NOT_FOUND")
  }
}


export class UnauthorizedError extends Error {
  status = 401

  constructor(message = "Unauthorized") {
    super(message)
    this.name = "UnauthorizedError"
  }
}

export class ForbiddenError extends Error {
  status = 403

  constructor(message = "Forbidden") {
    super(message)
    this.name = "ForbiddenError"
  }
}