import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import User from '#models/user'
import Problem from '#models/problem'

export default class ProblemsController {
  
  async getProblem({ request, response }: HttpContext) {
    const { discord_id, username } = request.body()

    if (!discord_id || !username) {
      return response.badRequest({ error: 'Missing discord_id or username' })
    }

    await User.updateOrCreate(
      { discordId: discord_id },
      { username: username }
    )

    const now = DateTime.fromISO('2025-12-01') 
    // const now = DateTime.now()

    if (now.month !== 12) {
      return response.ok({ 
        message: 'There are no FINKI AoC problems at this time. See you in December!' 
      })
    }

    const day = now.day
    let currentWeek = 0

    if (day >= 1 && day <= 7) currentWeek = 1
    else if (day >= 8 && day <= 14) currentWeek = 2
    else if (day >= 15 && day <= 21) currentWeek = 3
    else currentWeek = 4

    const problem = await Problem.findBy('week', currentWeek)

    if (!problem) {
      return response.notFound({ error: 'Problem for this week not found.' })
    }

    return response.ok({
      week: currentWeek,
      title: problem.title,
      description: problem.description,
      input_example: problem.inputExample
    })
  }
}