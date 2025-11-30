import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_problem_states'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('problem_id').unsigned().references('problems.id').onDelete('CASCADE')

      table.text('input_data').notNullable()
      table.string('solution').notNullable()
      table.boolean('is_solved').defaultTo(false)

      table.unique(['user_id', 'problem_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
