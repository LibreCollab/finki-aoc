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

    // --- WEEK 2 LOGIC ---
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

    // --- WEEK 3 LOGIC (Placeholder) ---
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

    // --- WEEK 4 LOGIC (Placeholder) ---
    private static generateWeek4() {
        return { input: 'TODO Week 4', solution: '0' }
    }
}