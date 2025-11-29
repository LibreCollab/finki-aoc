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
        title: 'Week 2: Reindeer Logistics',
        description: 'Coming soon...',
        inputExample: '...',
      },
      {
        week: 3,
        title: 'Week 3: Elf Shift Schedules',
        description: 'Coming soon...',
        inputExample: '...',
      },
      {
        week: 4,
        title: 'Week 4: Gift Wrapping Optimization',
        description: 'Coming soon...',
        inputExample: '...',
      },
    ])
  }
}