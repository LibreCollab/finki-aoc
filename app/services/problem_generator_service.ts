export class ProblemGeneratorService {
  static generate(week: number): { input: string; solution: string } {
    switch (week) {
      case 1:
        return this.generateWeek1()
      case 2:
        return this.generateWeek2()
      case 3:
        return this.generateWeek3()
      case 4:
        return this.generateWeek4()
      default:
        throw new Error('Unknown week')
    }
  }

  // --- WEEK 1 LOGIC ---
private static generateWeek1() {
    const N = 2000
    const MAX_SCORE = 1000
    const k = Math.floor(Math.random() * 95) + 5 

    const capybaras: number[] = []
    for (let i = 0; i < N; i++) {
      capybaras.push(Math.floor(Math.random() * MAX_SCORE) + 1)
    }

    const sorted = [...capybaras].sort((a, b) => a - b)
    
    let left = 0
    let maxGroupSize = 0

    for (let right = 0; right < sorted.length; right++) {
      while (sorted[right] - sorted[left] > k) {
        left++
      }

      const currentSize = right - left + 1

      if (currentSize >= 2) {
        maxGroupSize = Math.max(maxGroupSize, currentSize)
      }
    }

    const input = `${k}\n${capybaras.join(',')}`
    const solution = maxGroupSize.toString()

    return { input, solution }
  }

  // --- WEEK 2 LOGIC (Placeholder) ---
  private static generateWeek2() {
    return { input: 'TODO Week 2', solution: '0' }
  }

  // --- WEEK 3 LOGIC (Placeholder) ---
  private static generateWeek3() {
    return { input: 'TODO Week 3', solution: '0' }
  }

  // --- WEEK 4 LOGIC (Placeholder) ---
  private static generateWeek4() {
    return { input: 'TODO Week 4', solution: '0' }
  }
}