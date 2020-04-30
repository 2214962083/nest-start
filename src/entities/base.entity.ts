import {PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm'

/**
 * 数据表基础字段
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn({
    comment: '自增id，主键具有唯一性',
  })
  id: number

  @CreateDateColumn({
    comment: '此数据创建时间',
    nullable: false,
  })
  createTime: number

  @UpdateDateColumn({
    comment: '此数据更新时间',
    nullable: false,
  })
  updateTime: number
}
