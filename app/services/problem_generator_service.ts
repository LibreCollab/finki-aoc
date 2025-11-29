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

  // --- WEEK 1 LOGIC (Example: Sum of random numbers) ---
  private static generateWeek1() {
    const numbers: number[] = []
    for (let i = 0; i < 100; i++) {
      numbers.push(Math.floor(Math.random() * 1000) + 1)
    }

    const input = numbers.join('\n')
    const solution = numbers.reduce((a, b) => a + b, 0).toString()

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