import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Problem from '#models/problem'
import UserProblemState from '#models/user_problem_state'
import { ProblemGeneratorService } from '#services/problem_generator_service'
import { GameTimeService } from '#services/game_time_service'
import { ScoringService } from '#services/scoring_service'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import { BonusQualificationService } from '#services/bonus_qualification_service'

export default class ProblemsController {
  async getProblem({ request, response }: HttpContext) {
    const { discord_id, username } = request.body()

    if (!discord_id || !username) {
      return response.badRequest({ error: 'Missing discord_id or username' })
    }

    const { isValid, week, message } = GameTimeService.getCurrentWeek()
    if (!isValid) {
      return response.ok({ status: 'too_early', message: message })
    }

    const user = await User.updateOrCreate({ discordId: discord_id }, { username: username })

    const problem = await Problem.findBy('week', week)
    if (!problem) {
      return response.notFound({ error: 'Problem not found' })
    }

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
        isSolved: false,
      })
    }

    return response.ok({
      week: week,
      title: problem.title,
      description: problem.description,
      input_example: problem.inputExample,
      user_input: state.inputData,
      is_solved: state.isSolved,
    })
  }

  async submitAnswer({ request, response }: HttpContext) {
    const { discord_id, answer } = request.body()

    if (!discord_id || !answer) {
      return response.badRequest({ error: 'Missing discord_id or answer' })
    }

    const { isValid, week, message } = GameTimeService.getCurrentWeek()
    if (!isValid) {
      return response.ok({ status: 'too_early', message: message })
    }

    const user = await User.findBy('discord_id', discord_id)
    if (!user) {
      return response.notFound({ error: 'User not found' })
    }

    const problem = await Problem.findBy('week', week)
    if (!problem) {
      return response.notFound({ error: 'No active problem' })
    }

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
      const { rank, points } = await ScoringService.calculateScore(problem.id)

      state.isSolved = true
      state.solvedAt = DateTime.now()
      state.points = points
      await state.save()

      const qualifiesForBonus = await BonusQualificationService.checkBonusQualification(user.id)

      return response.ok({
        status: 'correct',
        message: `Correct! You ranked #${rank} and earned ${points} points.${
          qualifiesForBonus
            ? "\n\nPssst! You've qualified for the super secret bonus problem! Type `/aoc bonus` for more information."
            : ''
        }`,
        has_qualified_for_bonus: qualifiesForBonus,
      })
    } else {
      return response.ok({ status: 'incorrect', message: 'That is not the correct answer.' })
    }
  }

  async getLeaderboard({ response }: HttpContext) {
    const leaderboard = await db
      .from('users')
      .leftJoin('user_problem_states', 'users.id', 'user_problem_states.user_id')
      .select('users.username', 'users.discord_id')
      .sum('user_problem_states.points as total_score')
      .groupBy('users.id', 'users.username', 'users.discord_id')
      .orderBy('total_score', 'desc')
      .limit(100)

    const formatted = leaderboard.map((entry, index) => ({
      rank: index + 1,
      username: entry.username,
      discord_id: entry.discord_id,
      total_score: Number(entry.total_score || 0),
    }))

    const activeLeaderboard = formatted.filter((u) => u.total_score > 0)

    if (activeLeaderboard.length === 0) {
      return response.ok({ data: [] })
    }

    return response.ok({ data: activeLeaderboard })
  }

  async getBonusProblem({ request, response }: HttpContext) {
    const { discord_id } = request.body()
    if (!discord_id) {
      return response.badRequest({ error: 'Missing discord_id' })
    }

    const user = await User.findBy('discord_id', discord_id)
    if (!user) {
      return response.notFound({ error: 'User not found' })
    }

    const isQualified = await BonusQualificationService.checkBonusQualification(user.id)
    if (!isQualified) {
      return response.forbidden({ error: 'Not qualified.' })
    }

    const BONUS_WEEK = 5
    const problem = await Problem.findBy('week', BONUS_WEEK)
    if (!problem) {
      return response.notFound({ error: 'Bonus not configured' })
    }

    let state = await UserProblemState.query()
      .where('user_id', user.id)
      .andWhere('problem_id', problem.id)
      .first()

    if (!state) {
      const { input, solution } = ProblemGeneratorService.generate(BONUS_WEEK)
      state = await UserProblemState.create({
        userId: user.id,
        problemId: problem.id,
        inputData: input,
        solution: solution,
        isSolved: false,
      })
    }

    return response.ok({
      week: BONUS_WEEK,
      is_bonus: true,
      title: problem.title,
      description: problem.description,
      input_example: problem.inputExample,
      user_input: state.inputData,
      is_solved: state.isSolved,
    })
  }

  async submitBonusAnswer({ request, response }: HttpContext) {
    const { discord_id, answer } = request.body()
    if (!discord_id || !answer) {
      return response.badRequest({ error: 'Missing data' })
    }

    const user = await User.findBy('discord_id', discord_id)
    if (!user) return response.notFound({ error: 'User not found' })

    const isQualified = await BonusQualificationService.checkBonusQualification(user.id)
    if (!isQualified) {
      return response.forbidden({ error: 'Not qualified.' })
    }

    const BONUS_WEEK = 5
    const problem = await Problem.findBy('week', BONUS_WEEK)
    if (!problem) {
      return response.notFound({ error: 'Bonus problem not found' })
    }

    const state = await UserProblemState.query()
      .where('user_id', user.id)
      .andWhere('problem_id', problem.id)
      .first()

    if (!state) {
      return response.badRequest({ error: 'Bonus problem not requested yet' })
    }
    if (state.isSolved) {
      return response.ok({ status: 'already_solved', message: 'You already graduated!' })
    }

    if (state.solution.trim() === answer.toString().trim()) {
      state.isSolved = true
      state.solvedAt = DateTime.now()
      state.points = 0
      await state.save()

      return response.ok({
        status: 'correct',
        message: 'GRADUATED',
        diploma: `
      ____________________________________________
     |                                            |
     |            FINKI ADVENT OF CODE            |
     |                CERTIFICATE                 |
     |                                            |
     |   This certifies that [${user.username}]   |
     |   has survived the algorithms.             |
     |                                            |
     |       (o_  <-- Capybara Stamp              |
     |       //\\                                 |
     |____________________________________________|`,
      })
    }

    return response.ok({ status: 'incorrect', message: 'Incorrect.' })
  }
}
