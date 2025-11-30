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
      case 5:
        return this.generateWeek5()
      default:
        throw new Error('Unknown week')
    }
  }

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

  private static generateWeek2() {
    const N = 2000
    // Generate random "Vibe Scores" between -50 and 50
    const diaryEntries: number[] = []
    for (let i = 0; i < N; i++) {
      diaryEntries.push(Math.floor(Math.random() * 101) - 50)
    }

    // Solve: Find Maximum Subarray Sum (Kadane's Algorithm)
    let maxSoFar = -Infinity
    let maxEndingHere = 0

    for (const score of diaryEntries) {
      maxEndingHere = maxEndingHere + score

      if (maxSoFar < maxEndingHere) {
        maxSoFar = maxEndingHere
      }

      // If the running sum drops below zero, it's better to start a new era \o/
      // than to carry that negative baggage forward ;)
      if (maxEndingHere < 0) {
        maxEndingHere = 0
      }
    }

    // Edge Case: If Kadane's returns 0 because of the reset logic but the array
    // contained all negatives, we technically need the max single element.
    // However, standard Kadane handles "maxSoFar" correctly if initialized to -Infinity.
    // If we want to strictly handle "all negatives", the logic above works
    // (maxSoFar will capture the largest negative number before maxEndingHere resets).

    const input = diaryEntries.join(',')
    const solution = maxSoFar.toString()

    return { input, solution }
  }

  private static generateWeek3() {
    // 1. Generate Random Graph Data
    const numConnections = 1500
    const maxUserId = 1000
    const connections: string[] = []

    // We use a Set to store edges effectively for the solver logic
    // But for generation, we just push strings
    const adjacencyList = new Map<number, number[]>()

    const addEdge = (u: number, v: number) => {
      if (!adjacencyList.has(u)) adjacencyList.set(u, [])
      if (!adjacencyList.has(v)) adjacencyList.set(v, [])
      adjacencyList.get(u)!.push(v)
      adjacencyList.get(v)!.push(u)
    }

    for (let i = 0; i < numConnections; i++) {
      const userA = Math.floor(Math.random() * maxUserId) + 1
      let userB = Math.floor(Math.random() * maxUserId) + 1

      // Prevent self-loops
      while (userB === userA) {
        userB = Math.floor(Math.random() * maxUserId) + 1
      }

      connections.push(`${userA}-${userB}`)
      addEdge(userA, userB)
    }

    // 2. Solve: Largest Connected Component (DFS)
    const visited = new Set<number>()
    let maxGroupSize = 0

    // Helper DFS function
    const getComponentSize = (node: number): number => {
      let size = 1
      visited.add(node)

      const neighbors = adjacencyList.get(node) || []
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          size += getComponentSize(neighbor)
        }
      }
      return size
    }

    // Iterate over all known nodes in the map
    for (const [user] of adjacencyList) {
      if (!visited.has(user)) {
        const size = getComponentSize(user)
        if (size > maxGroupSize) {
          maxGroupSize = size
        }
      }
    }

    // Edge case: If no connections generated (unlikely with 1500 edges), max is 0.
    // But technically a single person is a group of 1 if they exist.
    // Based on problem statement "largest group sharing rumors", if no DMs happened, result is 0 or 1.
    // Let's assume input always has pairs.

    const input = connections.join(',')
    const solution = maxGroupSize.toString()

    return { input, solution }
  }

  private static generateWeek4() {
    const Rows = 50
    const Cols = 50
    const wallProbability = 0.3 // 30% chance of a wall

    // 1. Generate Grid
    const grid: string[][] = []
    for (let r = 0; r < Rows; r++) {
      const row: string[] = []
      for (let c = 0; c < Cols; c++) {
        if (Math.random() < wallProbability) {
          row.push('#')
        } else {
          row.push('.')
        }
      }
      grid.push(row)
    }

    // 2. Place Start (S) and End (E)
    // Ensure they aren't on the same spot
    const sR = 0,
      sC = 0
    const eR = Rows - 1,
      eC = Cols - 1

    grid[sR][sC] = 'S'
    grid[eR][eC] = 'E'

    // 3. Solve (BFS for Shortest Path)
    // Directions: Up, Down, Left, Right
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]

    const queue: [number, number, number][] = [[sR, sC, 0]] // [row, col, steps]
    const visited = new Set<string>()
    visited.add(`${sR},${sC}`)

    let shortestPath = -1

    while (queue.length > 0) {
      const [r, c, steps] = queue.shift()!

      // Found the building!
      if (r === eR && c === eC) {
        shortestPath = steps
        break
      }

      for (const [dr, dc] of directions) {
        const nr = r + dr
        const nc = c + dc

        // Check bounds
        if (nr >= 0 && nr < Rows && nc >= 0 && nc < Cols) {
          const cell = grid[nr][nc]
          const key = `${nr},${nc}`

          // Check if walkable and not visited
          if (cell !== '#' && !visited.has(key)) {
            visited.add(key)
            queue.push([nr, nc, steps + 1])
          }
        }
      }
    }

    const inputHeader = `${Rows} ${Cols}`
    const gridString = grid.map((row) => row.join('')).join('\n')
    const input = `${inputHeader}\n${gridString}`

    return { input, solution: shortestPath.toString() }
  }

  private static generateWeek5() {
    const fragments = [
      {
        // Fragment 1: The Conspiracy
        // Target: "THE_BUILDING_IS_A_LIE"
        // Logic: CAT( "THE_BUILDING_IS_", REV("EIL_A") )
        // HEX("THE_BUILDING_IS_") -> 5448455f4255494c44494e475f49535f
        // HEX("EIL_A") -> 45494c5f41
        input: 'CAT(HEX(5448455f4255494c44494e475f49535f),REV(HEX(45494c5f41)))',
        solution: 'THE_BUILDING_IS_A_LIE',
      },
      {
        // Fragment 2: The Budget Allocation
        // Target: "WE_BOUGHT_CAPYBARAS_AND_MECHANICAL_KEYBOARDS"
        // Logic: CAT( "WE_BOUGHT_", REV("SARABYPAC"), "_AND_MECHANICAL_KEYBOARDS" )
        // HEX("WE_BOUGHT_") -> 57455f424f554748545f
        // HEX("SARABYPAC") -> 534152414259504143 (which is CAPYBARAS reversed)
        // HEX("_AND_MECHANICAL_KEYBOARDS") -> 5f414e445f4d454348414e4943414c5f4b4559424f41524453
        input:
          'CAT(HEX(57455f424f554748545f),REV(HEX(534152414259504143)),HEX(5f414e445f4d454348414e4943414c5f4b4559424f41524453))',
        solution: 'WE_BOUGHT_CAPYBARAS_AND_MECHANICAL_KEYBOARDS',
      },
      {
        // Fragment 3: The Campus Cat
        // Target: "MACO_SAYS_MEOW"
        // Logic: CAT( "MACO_SAYS_", REV("WOEM") )
        // HEX("MACO_SAYS_") -> 4d41434f5f534159535f
        // HEX("WOEM") -> 574f454d (which is MEOW reversed)
        input: 'CAT(HEX(4d41434f5f534159535f),REV(HEX(574f454d)))',
        solution: 'MACO_SAYS_MEOW',
      },
    ]

    const randomIndex = Math.floor(Math.random() * fragments.length)
    const selected = fragments[randomIndex]

    return {
      input: selected.input,
      solution: selected.solution,
    }
  }
}
