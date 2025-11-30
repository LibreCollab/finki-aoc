import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Problem from '#models/problem'

export default class extends BaseSeeder {
  async run() {
    await Problem.updateOrCreateMany('week', [
      {
        week: 1,
        title: 'Week 1: Capybara Picnic Groups',
        description: `Capybaras are planning a picnic. Each capybara has a "friendliness score". 
        
A group of capybaras is valid if:
1. The group contains at least 2 capybaras.
2. The difference between the maximum and minimum friendliness scores in the group is at most K.

Input Format:
The first line contains the integer K.
The second line contains the list of friendliness scores separated by commas.

Your Task:
Return the maximum number of capybaras that can attend a single valid picnic group. If no valid group can be formed, return 0.`,
        inputExample: `2
3,5,2,7,4

Explanation:
Sorted scores: [2, 3, 4, 5, 7]
Valid groups with diff <= 2: [2,3,4], [3,4,5], [5,7], etc.
The largest group is [2, 3, 4] (size 3).
Output: 3`,
      },
      {
        week: 2,
        title: "Week 2: Stella's Diary",
        description: `Stella keeps a meticulous diary. Every day, she rates her "Vibe Score" as an integer (positive for great days, negative for terrible days).

Stella wants to look back and find her "Golden Era". A "Golden Era" is defined as a contiguous sequence of days where the sum of Vibe Scores is maximized.

Input Format:
A single line containing a list of integers (Vibe Scores) separated by commas.

Your Task:
Return the sum of the "Golden Era" (the maximum sum of any contiguous subarray).
Note: If all numbers are negative, the solution is the single largest number (closest to 0).`,
        inputExample: `10,-5,40,-60,15
        
Explanation: The sequence [10, -5, 40] sums to 45. The sequence [15] is 15. The max is 45.`,
      },
      {
        week: 3,
        title: 'Week 3: The Gossip Protocol',
        description: `The FINKI Discord regulars are spreading rumors about the upcoming exam results.

The rumor spreads via Direct Messages (DMs). If User A DMs User B, they share all the information they know. This is transitive: if A talks to B, and B talks to C, then A, B, and C all know the same rumors.

We have a log of all DMs that happened today. Each user is identified by a unique ID.

Input Format:
A single line containing a list of DM pairs separated by commas. Each pair is separated by a hyphen.
Example: "1-2,2-3,5-6" means User 1 talked to User 2, User 2 talked to User 3, and User 5 talked to User 6.

Your Task:
Identify the separate groups of students sharing rumors. Return the size of the **largest** group of students who all share the same rumor.`,
        inputExample: `1-2,2-3,4-5
        
Explanation: 
Group 1: {1, 2, 3} (Size 3)
Group 2: {4, 5} (Size 2)
Result: 3`,
      },
      {
        week: 4,
        title: 'Week 4: The Phantom Building',
        description: `It has been 10 years. The Dean claims the new FINKI building exists on a secret blueprint, hidden within a labyrinth of bureaucracy and construction fences.

You have obtained a satellite scan of the supposed construction site represented as a 2D grid:
- 'S' is your starting position (The Barracks).
- 'E' is the entrance to the New Building.
- '#' represents concrete walls or bureaucratic red tape (impassable).
- '.' represents open ground.

Input Format:
The first line contains two integers: R (rows) and C (columns).
The following R lines represent the grid.

Your Task:
Find the **minimum number of steps** to get from 'S' to 'E'.
If the building is (as expected) a lie and cannot be reached, return -1.`,
        inputExample: `5 5
S..#.
.#...
...#.
.##..
...#E

Explanation: 
Path: (0,0) -> (0,1) -> (0,2) -> (1,2) -> (1,3) -> (1,4) -> (2,4) -> (3,4) -> (4,4)
Result: 8`,
      },
      {
        week: 5,
        title: 'BONUS: System Override: The Kernel Panic',
        description: `**FATAL ERROR.** 

The Dean's message is trapped inside the Kernel's execution layer. You have dumped the raw function calls from the memory stack.

To retrieve the message, you must implement an interpreter for the FINKI Kernel Language (FKL).

**Supported Functions:**
1. \`HEX(s)\`: Decodes a Hexadecimal string into ASCII. (e.g., \`HEX(4869)\` -> "Hi")
2. \`REV(s)\`: Reverses the string. (e.g., \`REV(ABC)\` -> "CBA")
3. \`REP(n, s)\`: Repeats the string \`s\`, \`n\` times.
4. \`CAT(s1, s2, ...)\`: Concatenates multiple strings.
5. **Nesting:** Functions can be nested arbitrarily deep.

**Input Format:**
A single string representing a nested function call.

**Input Example:**
\`CAT(REP(2, REV(HEX(4f454e))), _WAKE_UP)\`

**Execution Trace:**
1. \`HEX(4f454e)\` -> "NEO"
2. \`REV("NEO")\` -> "OEN"
3. \`REP(2, "OEN")\` -> "OENOEN"
4. \`CAT("OENOEN", "_WAKE_UP")\` -> "OENOEN_WAKE_UP"

**Your Task:**
Evaluate the expression and return the final string.`,
        inputExample: `CAT(REP(2,REV(HEX(4f454e))),_WAKE_UP)
        
Explanation: OENOEN_WAKE_UP`,
      },
    ])
  }
}
