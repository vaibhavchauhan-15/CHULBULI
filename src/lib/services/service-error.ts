export class ServiceError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.name = 'ServiceError'
    this.statusCode = statusCode
  }
}

export function getServiceErrorStatus(error: unknown, fallback: number = 500) {
  if (error instanceof ServiceError) return error.statusCode
  return fallback
}
