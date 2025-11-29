import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import User from '#models/user'
import Problem from '#models/problem'
import UserProblemState from '#models/user_problem_state'
import { ProblemGeneratorService } from '#services/problem_generator_service'

export default class ProblemsController {

  async getProblem({ request, response }: HttpContext) {
    const { discord_id, username } = request.body()

    if (!discord_id || !username) {
      return response.badRequest({ error: 'Missing discord_id or username' })
    }

    const user = await User.updateOrCreate(
      { discordId: discord_id },
      { username: username }
    )

    const now = DateTime.fromISO('2025-12-05') 
    // const now = DateTime.now()

    if (now.month !== 12) {
       return response.ok({ message: 'Not December yet.' })
    }

    const day = now.day
    let currentWeek = 0
    if (day >= 1 && day <= 7) currentWeek = 1
    else if (day >= 8 && day <= 14) currentWeek = 2
    else if (day >= 15 && day <= 21) currentWeek = 3
    else currentWeek = 4

    const problem = await Problem.findBy('week', currentWeek)
    if (!problem) return response.notFound({ error: 'Problem not found' })


    let state = await UserProblemState.query()
      .where('user_id', user.id)
      .andWhere('problem_id', problem.id)
      .first()

    if (!state) {
      const { input, solution } = ProblemGeneratorService.generate(currentWeek)
      
      state = await UserProblemState.create({
        userId: user.id,
        problemId: problem.id,
        inputData: input,
        solution: solution,
        isSolved: false
      })
    }

    return response.ok({
      week: currentWeek,
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

    const user = await User.findBy('discord_id', discord_id)
    if (!user) return response.notFound({ error: 'User not found' })

    const now = DateTime.fromISO('2025-12-05') 
    // const now = DateTime.now()

    const day = now.day
    let currentWeek = 0
    if (day >= 1 && day <= 7) currentWeek = 1
    else if (day >= 8 && day <= 14) currentWeek = 2
    else if (day >= 15 && day <= 21) currentWeek = 3
    else currentWeek = 4

    const problem = await Problem.findBy('week', currentWeek)
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