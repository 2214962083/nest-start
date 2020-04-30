import {ApiModelProperty} from '@nestjs/swagger'
import {HttpMessage, HttpError} from '@app/interfaces'
import {ServiceCode, Sort} from '@app/enums'
import * as TEXT from '@app/constants/text.constant'
import {isNumber} from 'lodash'
import {IsNotEmpty, IsArray, IsOptional, IsEnum, Length, IsNumber} from 'class-validator'

const serviceCodes: number[] = []
const valueIsNumber = (value: unknown): value is number => isNumber(value)
for (const key in ServiceCode) {
  const value = ServiceCode[key]
  valueIsNumber(value) && serviceCodes.push(value)
}

export abstract class HttpResBaseDto {
  code: ServiceCode
  message: HttpMessage
  error: HttpError
}

export class HttpResSuccessDto extends HttpResBaseDto {
  @ApiModelProperty({
    description: '业务逻辑码',
    default: ServiceCode.SUCCESS,
    type: Number,
  })
  code: ServiceCode

  @ApiModelProperty({description: '响应消息', type: String, default: TEXT.HTTP_DEFAULT_SUCCESS_TEXT})
  message: HttpMessage

  @ApiModelProperty({description: '响应错误', type: String, default: ''})
  error: HttpError

  @ApiModelProperty({description: '响应成功主体', type: String, default: ''})
  result: unknown
}

export class HttpResErrorDto extends HttpResBaseDto {
  @ApiModelProperty({
    description: '业务逻辑错误码',
    enum: serviceCodes,
    default: ServiceCode.ERROR,
    type: Number,
  })
  code: ServiceCode

  @ApiModelProperty({description: '响应消息', type: String, default: TEXT.HTTP_DEFAULT_ERROR_TEXT})
  message: HttpMessage

  @ApiModelProperty({description: '响应错误', type: String})
  error: HttpError
}

export class FindByPropertyDto {
  @IsNotEmpty({message: '属性名不能为空'})
  readonly propertyName: string

  @IsNotEmpty({message: '属性值不能为空'})
  readonly propertyValue: any

  @IsOptional()
  @IsNotEmpty({message: 'relations 不能为空'})
  @IsArray({message: 'relations 必须为数组'})
  readonly relations?: string[]
}

export class FindByPropertyArrayDto {
  @IsNotEmpty({message: '属性名不能为空'})
  readonly propertyName: string

  @IsNotEmpty({message: '属性值不能为空'})
  @IsArray({message: '属性值须为数组'})
  readonly propertyValues: any[]

  @IsOptional()
  @IsNotEmpty({message: 'relations 不能为空'})
  @IsArray({message: 'relations 必须为数组'})
  readonly relations?: string[]
}

export class SearchDto<Entity = any> {
  @IsOptional()
  @IsNotEmpty({message: '排序顺序不能为空'})
  @IsEnum(Sort, {message: '排序顺序值不合法'})
  readonly sort?: Sort

  @IsOptional()
  @IsNotEmpty({message: '排序字段不能为空'})
  readonly sortBy?: keyof Entity

  @IsOptional()
  @IsNotEmpty({message: '查找字段不能为空'})
  @Length(1, 20, {message: '查找字段长度在1字符以上，20字符以内'})
  readonly field?: keyof Entity

  @IsOptional()
  @IsNotEmpty({message: '关键词不能为空'})
  @Length(1, 15, {message: '关键词长度在1字符以上，15字符以内'})
  readonly keyWord?: string

  @IsNotEmpty({message: '当前页码不能为空'})
  @IsNumber({allowInfinity: false, allowNaN: false}, {message: '当前页码必须为数字'})
  readonly currentPage: number

  @IsOptional()
  @IsNotEmpty({message: '每页条数不能为空'})
  @IsNumber({allowInfinity: false, allowNaN: false}, {message: '每页条数必须为数字'})
  readonly pageSize?: number

  @IsOptional()
  @IsNotEmpty({message: 'relations 不能为空'})
  readonly relations?: string | string[]
}
