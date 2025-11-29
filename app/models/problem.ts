import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Problem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare week: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare inputExample: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}