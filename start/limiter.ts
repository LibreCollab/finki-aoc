import limiter from '@adonisjs/limiter/services/main'

export const globalLimiter = limiter.define('global', (ctx) => {
  return limiter.allowRequests(200).every('1 minute').usingKey(`global_${ctx.request.ip()}`)
})

export const gameLimiter = limiter.define('game', (ctx) => {
  const discordId = ctx.request.input('discord_id')

  const key = discordId ? `game_user_${discordId}` : `game_ip_${ctx.request.ip()}`

  return limiter.allowRequests(10).every('1 minute').usingKey(key)
})
