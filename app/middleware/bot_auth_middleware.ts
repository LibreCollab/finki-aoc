import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import env from '#start/env'

export default class BotAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { request, response } = ctx

    const authHeader = request.header('Authorization')
    const expectedToken = env.get('BOT_ACCESS_TOKEN')

    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return response.unauthorized({ 
        error: 'Unauthorized. Invalid or missing access token.' 
      })
    }

    await next()
  }
}