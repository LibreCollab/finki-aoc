import { test } from '@japa/runner'
import { ProblemGeneratorService } from '#services/problem_generator_service'

test.group('Problem Generator Service', () => {
  const ITERATIONS = 10

  /**
   * WEEK 1: Capybara Picnic Groups (Sliding Window)
   */
  test('Week 1: Correctly calculates max group size (x10 iterations)', async ({ assert }) => {
    for (let i = 0; i < ITERATIONS; i++) {
      const { input, solution } = ProblemGeneratorService.generate(1)

      const [kLine, listLine] = input.split('\n')
      const K = Number(kLine)
      const capybaras = listLine.split(',').map(Number)

      const sorted = [...capybaras].sort((a, b) => a - b)
      let left = 0
      let maxGroupSize = 0

      for (let right = 0; right < sorted.length; right++) {
        while (sorted[right] - sorted[left] > K) {
          left++
        }
        const currentSize = right - left + 1
        if (currentSize >= 2) {
          maxGroupSize = Math.max(maxGroupSize, currentSize)
        }
      }

      assert.equal(solution, maxGroupSize.toString(), `Iteration ${i + 1}: Failed Week 1`)
    }
  })

  /**
   * WEEK 2: Stella's Golden Era (Kadane's Algorithm)
   */
  test('Week 2: Correctly calculates maximum subarray sum (x10 iterations)', async ({ assert }) => {
    for (let i = 0; i < ITERATIONS; i++) {
      const { input, solution } = ProblemGeneratorService.generate(2)
      const diaryEntries = input.split(',').map(Number)

      let maxSoFar = -Infinity
      let maxEndingHere = 0

      for (const score of diaryEntries) {
        maxEndingHere += score
        if (maxSoFar < maxEndingHere) {
          maxSoFar = maxEndingHere
        }
        if (maxEndingHere < 0) {
          maxEndingHere = 0
        }
      }

      assert.equal(solution, maxSoFar.toString(), `Iteration ${i + 1}: Failed Week 2`)
    }
  })

  /**
   * WEEK 3: The Gossip Protocol (Graph / Connected Components)
   */
  test('Week 3: Correctly identifies largest connected component (x10 iterations)', async ({
    assert,
  }) => {
    for (let i = 0; i < ITERATIONS; i++) {
      const { input, solution } = ProblemGeneratorService.generate(3)
      const pairs = input.split(',')

      const graph = new Map<number, number[]>()
      const allNodes = new Set<number>()

      const addEdge = (u: number, v: number) => {
        if (!graph.has(u)) graph.set(u, [])
        if (!graph.has(v)) graph.set(v, [])
        graph.get(u)!.push(v)
        graph.get(v)!.push(u)
        allNodes.add(u)
        allNodes.add(v)
      }

      pairs.forEach((pair) => {
        const [u, v] = pair.split('-').map(Number)
        addEdge(u, v)
      })

      const visited = new Set<number>()
      let maxComponentSize = 0

      for (const node of allNodes) {
        if (!visited.has(node)) {
          let currentComponentSize = 0
          const queue = [node]
          visited.add(node)

          while (queue.length > 0) {
            const current = queue.shift()!
            currentComponentSize++
            const neighbors = graph.get(current) || []
            for (const neighbor of neighbors) {
              if (!visited.has(neighbor)) {
                visited.add(neighbor)
                queue.push(neighbor)
              }
            }
          }
          if (currentComponentSize > maxComponentSize) {
            maxComponentSize = currentComponentSize
          }
        }
      }

      assert.equal(solution, maxComponentSize.toString(), `Iteration ${i + 1}: Failed Week 3`)
    }
  })

  /**
   * WEEK 4: The Phantom Building (Grid BFS)
   */
  test('Week 4: Correctly finds shortest path in grid (x10 iterations)', async ({ assert }) => {
    for (let i = 0; i < ITERATIONS; i++) {
      const { input, solution } = ProblemGeneratorService.generate(4)

      const lines = input.split('\n')
      const [dims, ...gridRows] = lines
      const [R, C] = dims.split(' ').map(Number)

      const grid = gridRows.map((line) => line.split(''))

      let startR = 0,
        startC = 0
      for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
          if (grid[r][c] === 'S') {
            startR = r
            startC = c
          }
        }
      }

      const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]
      const queue: [number, number, number][] = [[startR, startC, 0]]
      const visited = new Set<string>()
      visited.add(`${startR},${startC}`)

      let oraclePath = -1

      while (queue.length > 0) {
        const [r, c, steps] = queue.shift()!

        if (grid[r][c] === 'E') {
          oraclePath = steps
          break
        }

        for (const [dr, dc] of directions) {
          const nr = r + dr
          const nc = c + dc

          if (nr >= 0 && nr < R && nc >= 0 && nc < C) {
            const cell = grid[nr][nc]
            const key = `${nr},${nc}`

            if (cell !== '#' && !visited.has(key)) {
              visited.add(key)
              queue.push([nr, nc, steps + 1])
            }
          }
        }
      }

      assert.equal(solution, oraclePath.toString(), `Iteration ${i + 1}: Failed Week 4`)
    }
  })
})
