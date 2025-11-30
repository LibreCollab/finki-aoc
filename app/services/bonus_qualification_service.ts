import UserProblemState from '#models/user_problem_state'

export class BonusQualificationService {
  /**
   * Checks if a user qualifies for the hidden bonus content.
   * Rules:
   * 1. Must have solved all 4 standard weeks.
   * 2. Must have a total score > 350 points.
   */
  static async checkBonusQualification(userId: number): Promise<boolean> {
    const stats = await UserProblemState.query()
      .where('userId', userId)
      .andWhere('isSolved', true)
      .join('problems', 'user_problem_states.problem_id', 'problems.id')
      .whereIn('problems.week', [1, 2, 3, 4])
      .pojo<{ total_score: number; count: number }>()
      .sum('user_problem_states.points as total_score')
      .count('* as count')
      .first()

    const totalScore = Number(stats?.total_score || 0)
    const solvedCount = Number(stats?.count || 0)

    return solvedCount >= 4 && totalScore > 350
  }
}
