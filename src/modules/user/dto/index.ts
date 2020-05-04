import {IsNumber, IsNotEmpty, IsArray} from 'class-validator'
export * from './create-user.dto'
export * from './update-user.dto'

export class UserIdDto {
  @IsNotEmpty({message: '用户id不能为空'})
  @IsNumber({allowNaN: false, allowInfinity: false}, {message: 'id必须为数字'})
  readonly userId: number
}
