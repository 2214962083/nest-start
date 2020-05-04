import {IsNumber, IsNotEmpty, IsOptional, Length, IsArray, IsEmail} from 'class-validator'

export * from './login.dto'
export * from './register.dto'

export class SendCodeDto {
  @IsOptional()
  @IsNotEmpty({message: '用户手机号不能为空'})
  @Length(1, 30, {message: '用户手机号长度在1字符以上，30字符以内'})
  readonly tel?: string

  @IsOptional()
  @IsNotEmpty({message: '用户邮箱号不能为空'})
  @IsEmail({}, {message: '用户邮箱格式不正确'})
  @Length(1, 60, {message: '用户邮箱号长度在1字符以上，60字符以内'})
  readonly email?: string
}
