import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Problem from '#models/problem'
import UserProblemState from '#models/user_problem_state'
import { ProblemGeneratorService } from '#services/problem_generator_service'
import { GameTimeService } from '#services/game_time_service'

export default class ProblemsController {
  
  async getProblem({ request, response }: HttpContext) {
    const { discord_id, username } = request.body()

    if (!discord_id || !username) {
      return response.badRequest({ error: 'Missing discord_id or username' })
    }

    const { isValid, week, message } = GameTimeService.getCurrentWeek()
    if (!isValid) {
      return response.ok({ message })
    }

    const user = await User.updateOrCreate(
      { discordId: discord_id },
      { username: username }
    )

    const problem = await Problem.findBy('week', week)
    if (!problem) return response.notFound({ error: 'Problem not found' })

    let state = await UserProblemState.query()
      .where('user_id', user.id)
      .andWhere('problem_id', problem.id)
      .first()

    if (!state) {
      const { input, solution } = ProblemGeneratorService.generate(week)
      state = await UserProblemState.create({
        userId: user.id,
        problemId: problem.id,
        inputData: input,
        solution: solution,
        isSolved: false
      })
    }

    return response.ok({
      week: week,
      title: problem.title,
      description: problem.description,
      user_input: state.inputData,
      is_solved: state.isSolved
    })
  }

  async submitAnswer({ request, response }: HttpContext) {
    const { discord_id, answer } = request.body()

    if (!discord_id || !answer) {
      return response.badRequest({ error: 'Missing discord_id or answer' })
    }

    const { isValid, week } = GameTimeService.getCurrentWeek()
    if (!isValid) {
      return response.badRequest({ error: 'Competition is not active.' })
    }

    const user = await User.findBy('discord_id', discord_id)
    if (!user) return response.notFound({ error: 'User not found' })

    const problem = await Problem.findBy('week', week)
    if (!problem) return response.notFound({ error: 'No active problem' })

    const state = await UserProblemState.query()
      .where('user_id', user.id)
      .andWhere('problem_id', problem.id)
      .first()

    if (!state) {
      return response.badRequest({ error: 'You have not requested the problem yet.' })
    }

    if (state.isSolved) {
      return response.ok({ status: 'already_solved', message: 'You already solved this!' })
    }

    if (state.solution.trim() === answer.toString().trim()) {
      state.isSolved = true
      await state.save()
      return response.ok({ status: 'correct', message: 'Correct! Great job.' })
    } else {
      return response.ok({ status: 'incorrect', message: 'That is not the correct answer.' })
    }
  }
}