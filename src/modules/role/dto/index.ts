import {IsNumber, IsNotEmpty, IsArray} from 'class-validator'
export * from './create-role.dto'
export * from './update-role.dto'

export class RoleIdDto {
  @IsNotEmpty({message: '角色id不能为空'})
  @IsNumber({allowNaN: false, allowInfinity: false}, {message: 'id必须为数字'})
  readonly roleId: number
}
