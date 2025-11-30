import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_problem_states'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('points').defaultTo(0)
      table.timestamp('solved_at').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('points')
      table.dropColumn('solved_at')
    })
  }
}
