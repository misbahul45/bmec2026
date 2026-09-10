
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 400,
    public code = "APP_ERROR",
    public field?: string,
  ) {
    super(message)
    this.name = "AppError"
  }

  static unauthorized(msg = "Akses tidak terotorisasi. Silakan login terlebih dahulu.") {
    return new AppError(msg, 401, "UNAUTHORIZED")
  }

  static forbidden(msg = "Anda tidak memiliki izin untuk melakukan aksi ini.") {
    return new AppError(msg, 403, "FORBIDDEN")
  }

  static notFound(entity = "Resource") {
    return new AppError(`${entity} tidak ditemukan`, 404, "NOT_FOUND")
  }

  static badRequest(msg = "Permintaan tidak valid") {
    return new AppError(msg, 400, "BAD_REQUEST")
  }

  static conflict(msg = "Data sudah ada atau terjadi konflik") {
    return new AppError(msg, 409, "CONFLICT")
  }

  static internal(msg = "Terjadi kesalahan internal pada server") {
    return new AppError(msg, 500, "INTERNAL_ERROR")
  }
}


export class UnauthorizedError extends Error {
  status = 401
  code = "UNAUTHORIZED"

  constructor(message = "Akses tidak terotorisasi. Silakan login terlebih dahulu.") {
    super(message)
    this.name = "UnauthorizedError"
  }
}

export class ForbiddenError extends Error {
  status = 403
  code = "FORBIDDEN"

  constructor(message = "Anda tidak memiliki izin untuk melakukan aksi ini.") {
    super(message)
    this.name = "ForbiddenError"
  }
}