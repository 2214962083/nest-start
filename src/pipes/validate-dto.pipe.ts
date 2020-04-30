import {Injectable, PipeTransform, ArgumentMetadata, BadRequestException, Type, Logger} from '@nestjs/common'
import {plainToClass} from 'class-transformer'
import {validate, ValidationError} from 'class-validator'
import {ParamsError} from '@app/interfaces'
import {HttpValidationError} from '@app/errors/validation.error'

/**
 * @class ValidationPipe
 * @classdesc 验证所有使用 class-validator 的 class 模型
 * @remarks 前端数据合法校验, 用于校验前端的数据是否跟 dto 文件定义的类型一样。
 */
@Injectable()
export class ValidateDto implements PipeTransform<any> {
  /**
   * @function transform
   * @param value 前端传来的数据
   * @param metadata 定义接收的元数据
   * @description 使用 class-vlidator 检验前端发来的值是否合法，不合法则抛出特定的错误。合法则进入 service 流程
   */
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    Logger.debug(`开始校验数据：${JSON.stringify(value, null, 4)}`, 'ArgumentMetadata')

    if (!value) throw new BadRequestException('提交的字段数据为空')

    const {metatype} = metadata

    // 元数据类型为空，或者元数据类型不是String, Boolean, Number, Array, Object，直接放行数据，因为可能是buffer这种。
    if (!metatype || this.isUnValidType(metatype)) return value

    // metatype 为 dto，此处是把 value 转为 dto 的结构的 class
    const dtoClass = plainToClass(metatype, value, {enableImplicitConversion: true})
    //debugger
    const errors = await validate(dtoClass)
    if (errors.length > 0) {
      throw new HttpValidationError({
        message: '提交的数据有错误',
        error: this.buildError(errors),
      })
    }
    return value
  }

  /**
   * @function isValidType
   * @description 校验前端传的参数值的类型是否合法
   */
  private isUnValidType(metatype: Type<any>): boolean {
    const types = [String, Boolean, Number, Array, Object]
    return !!types.find(type => metatype === type)
  }

  /**
   * @function buildError
   * @description 根据校验抛出的错误构建错误体
   */
  private buildError(errors: ValidationError[]): ParamsError[] {
    const result: ParamsError[] = []

    errors.forEach(error => {
      const errorInfo: ParamsError = {
        param: '',
        msg: '',
      }
      errorInfo.param = error.property
      Object.keys(error.constraints).forEach(errorType => {
        if (errorInfo.msg) errorInfo.msg += '。'
        errorInfo.msg += error.constraints[errorType]
      })
      result.push(errorInfo)
    })

    return result
  }
}
