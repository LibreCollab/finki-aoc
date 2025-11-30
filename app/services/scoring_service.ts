import UserProblemState from '#models/user_problem_state'

export class ScoringService {
  /**
   * Calculates the rank and points for a new valid submission.
   * Logic: 1st place = 100pts, 2nd = 99pts, ... 100th+ = 1pt.
   */
  static async calculateScore(problemId: number): Promise<{ rank: number; points: number }> {
    const solversCount = await UserProblemState.query()
      .where('problem_id', problemId)
      .andWhere('is_solved', true)
      .count('* as total')

    const count = Number(solversCount[0].$extras.total || 0)
    
    const rank = count + 1

    let points = 100 - (rank - 1)
    
    if (points < 1) {
      points = 1
    }

    return { rank, points }
  }
}