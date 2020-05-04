import {RedisService} from '@app/helper/cache/cache.service'
import {Repository, DeleteResult, FindManyOptions, Like, FindOneOptions} from 'typeorm'
import {merge, isNil, isArray} from 'lodash'
import {SearchDto, FindByPropertyDto, FindByPropertyArrayDto} from './common.dto'
import {HttpResultPaginate} from '@app/interfaces'
import {Sort} from '@app/enums'
import {BaseEntity} from '@app/entities'

export abstract class CommonService<Entity extends BaseEntity> {
  /**
   * 搜索的默认的 relations
   */
  public searchRelations: string[] = []

  /**
   * 根据实体属性值查找某个实体的默认的 relations
   */
  public findByPropertyRelations: string[] = []

  /**
   * 根据实体属性值数组查找实体数组的默认的 relations
   */
  public findByPropertyArrayRelations: string[] = []

  constructor(public readonly repository: Repository<Entity>, public readonly redisService: RedisService) {}

  /**
   * 根据条件搜索实体
   * @param searchDto 搜索条件
   * @param where 额外条件
   * @returns 实体列表
   */
  async search(searchDto: SearchDto, where?: FindOneOptions['where']): Promise<HttpResultPaginate<Entity[]>> {
    const {sort, sortBy, field, keyWord, currentPage, pageSize, relations} = searchDto
    const _sort = isNil(sort) ? Sort.ASC : sort
    const _sortBy = isNil(sortBy) ? 'id' : sortBy
    const _field = isNil(field) ? 'id' : field
    const _currentPage = isNil(currentPage) ? 1 : currentPage
    const _pageSize = isNil(pageSize) ? 20 : pageSize
    const _relations = isNil(relations) ? this.searchRelations : relations
    //debugger
    const defaultOptions: FindManyOptions = {
      relations: isArray(_relations) ? _relations : [_relations],
      order: {
        [_sortBy]: _sort,
      },
      take: _pageSize,
      skip: (_currentPage - 1) * _pageSize,
      cache: true,
    }
    if (!isNil(keyWord)) {
      merge(defaultOptions, {
        where: {
          [_field]: Like('%' + keyWord + '%'),
        },
      })
    }
    if (!isNil(where)) merge(defaultOptions, {where})
    const [entities, total] = await this.repository.findAndCount(defaultOptions)
    return {
      data: entities,
      pagination: {
        total,
        currentPage: _currentPage,
        totalPage: Math.ceil(total / _pageSize),
        pageSize: _pageSize,
      },
    } as HttpResultPaginate<Entity[]>
  }

  /**
   * 根据实体属性值查找某个实体
   * @param findByPropertyDto 属性名与属性值
   * @returns 某个实体
   */
  async findByProperty(findByPropertyDto: FindByPropertyDto): Promise<Entity> {
    const {propertyName, propertyValue, relations} = findByPropertyDto
    const entity: Entity = await this.repository.findOne({
      where: {
        [propertyName]: propertyValue,
      },
      relations: relations || this.findByPropertyRelations,
    })
    return entity
  }

  /**
   * 根据实体属性值数组查找实体数组
   * @param findByPropertyArrayDto 属性名字与属性值数组
   * @returns 实体数组
   */
  async findByPropertyArray(findByPropertyArrayDto: FindByPropertyArrayDto): Promise<Entity[]> {
    const {propertyName, propertyValues, relations} = findByPropertyArrayDto

    if (isNil(propertyValues) || propertyValues.length === 0) return []

    const entities: Entity[] = []
    for (let i = 0; i < propertyValues.length; i++) {
      const entity: Entity = await this.repository.findOne({
        where: {
          [propertyName]: propertyValues[i],
        },
        relations: relations || this.findByPropertyArrayRelations,
      })
      if (isNil(entity)) continue
      entities.push(entity)
    }
    return entities
  }

  /**
   * 创建实体
   * @param 创建实体所用到的数据
   * @returns 实体
   */
  abstract async create(...args: any[]): Promise<Entity>

  /**
   * 删除实体
   * @param id 实体id
   */
  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id)
  }

  /**
   * 更新实体
   * @param 更新实体所用到的数据
   * @returns 实体
   */
  abstract async update(...args: any[]): Promise<Entity>
}
