import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Problem from '#models/problem'

export default class UserProblemState extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare problemId: number

  @column()
  declare inputData: string

  @column()
  declare solution: string

  @column()
  declare isSolved: boolean

  @column()
  declare points: number

  @column.dateTime()
  declare solvedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Problem)
  declare problem: BelongsTo<typeof Problem>
}