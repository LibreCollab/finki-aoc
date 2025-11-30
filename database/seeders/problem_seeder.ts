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
3,5,2,7,4`,
      },
      {
        week: 2,
        title: 'Week 2: Stella\'s Diary',
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
        title: 'Week 4: TODO',
        description: 'Coming soon...',
        inputExample: '...',
      },
    ])
  }
}