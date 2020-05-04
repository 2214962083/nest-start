import {SearchDto} from './common.dto'
import {HttpResultPaginate} from '@app/interfaces'
import {BaseEntity} from '@app/entities'
import {DeleteResult} from 'typeorm'

export abstract class CommonController<Entity extends BaseEntity> {
  constructor() {}

  abstract async search(searchDto: SearchDto): Promise<HttpResultPaginate<Entity[]>>

  abstract async findById(...args: any[]): Promise<Entity>

  abstract async create(...args: any[]): Promise<Entity>

  abstract async delete(...args: any[]): Promise<DeleteResult>

  abstract async update(...args: any[]): Promise<Entity>
}
