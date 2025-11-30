import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import logger from '@adonisjs/core/services/logger'

export default class LoggerMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    const start = Date.now()
    const method = request.method()
    const url = request.url()
    const body = method !== 'GET' ? request.body() : undefined

    await next()

    const duration = Date.now() - start
    const status = response.getStatus()

    const logData: Record<string, unknown> = { method, url, status, duration: `${duration}ms` }

    // Log request body for non-GET requests
    if (body && Object.keys(body).length > 0) {
      logData.body = body
    }

    // Log response body for error responses
    if (status >= 400) {
      const responseBody = response.getBody()
      if (responseBody) {
        logData.response = responseBody
      }
    }

    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'
    logger[level](logData, `${method} ${url}`)
  }
}
