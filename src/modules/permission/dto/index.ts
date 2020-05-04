import {IsNumber, IsNotEmpty, IsArray} from 'class-validator'
export * from './create-permission.dto'
export * from './update-permission.dto'

export class PermissionIdDto {
  @IsNotEmpty({message: '权限id不能为空'})
  @IsNumber({allowNaN: false, allowInfinity: false}, {message: 'id必须为数字'})
  readonly permissionId: number
}
