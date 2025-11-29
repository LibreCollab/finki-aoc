import { DateTime } from 'luxon'

export class GameTimeService {
  /**
   * CONFIGURATION
   * Set IS_DEBUG to true to force a specific date.
   * Set IS_DEBUG to false to use the real server time.
   */
  private static IS_DEBUG = true
  private static DEBUG_DATE = '2025-12-05' // Simulates Week 1

  private static getNow(): DateTime {
    if (this.IS_DEBUG) {
      return DateTime.fromISO(this.DEBUG_DATE)
    }
    return DateTime.now()
  }

  static getCurrentWeek() {
    const now = this.getNow()

    if (now.month !== 12) {
      return { 
        isValid: false, 
        week: 0, 
        message: 'There are no FINKI AoC problems at this time. See you in December!' 
      }
    }

    const day = now.day
    let week = 0

    if (day >= 1 && day <= 7) week = 1
    else if (day >= 8 && day <= 14) week = 2
    else if (day >= 15 && day <= 21) week = 3
    else week = 4

    return { 
      isValid: true, 
      week: week, 
      message: null 
    }
  }
}