import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Problem from '#models/problem'

export default class extends BaseSeeder {
  async run() {
    await Problem.updateOrCreateMany('week', [
      {
        week: 1,
        title: 'Week 1: The Sleigh Mechanic',
        description: 'Santa needs help fixing the engine...',
        inputExample: '1, 2, 3, 4',
      },
      {
        week: 2,
        title: 'Week 2: Reindeer Logistics',
        description: 'Calculate the optimal path for the reindeer...',
        inputExample: 'Path: A -> B',
      },
      {
        week: 3,
        title: 'Week 3: Elf Shift Schedules',
        description: 'Sort the elves into valid work groups...',
        inputExample: 'Elf A: Night Shift',
      },
      {
        week: 4,
        title: 'Week 4: Gift Wrapping Optimization',
        description: 'Calculate the surface area of the gifts...',
        inputExample: '2x3x4',
      },
    ])
  }
}