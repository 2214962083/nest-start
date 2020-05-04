import {IsNumber, IsNotEmpty, IsOptional, Length, IsArray, IsEmail} from 'class-validator'

export class RegisterDto {
  @IsOptional()
  @IsNotEmpty({message: '用户手机号不能为空'})
  @Length(1, 30, {message: '用户手机号长度在1字符以上，30字符以内'})
  readonly tel?: string

  @IsOptional()
  @IsNotEmpty({message: '用户邮箱号不能为空'})
  @IsEmail({}, {message: '用户邮箱格式不正确'})
  @Length(1, 60, {message: '用户邮箱号长度在1字符以上，60字符以内'})
  readonly email?: string

  @IsOptional()
  @IsNotEmpty({message: '用户名不能为空'})
  @Length(2, 30, {message: '用户名长度在2字符以上，30字符以内'})
  readonly user?: string

  @IsOptional()
  @IsNotEmpty({message: '密码不能为空'})
  @Length(8, 30, {message: '密码长度在8字符以上，30字符以内'})
  readonly password?: string

  @IsOptional()
  @IsNotEmpty({message: '验证码不能为空'})
  @IsNumber({allowInfinity: false, allowNaN: false}, {message: '验证码必须为数字'})
  readonly verificationCode?: number
}

export class RegisterWithPasswordDto {
  @IsNotEmpty({message: '用户名不能为空'})
  @Length(2, 30, {message: '用户名长度在2字符以上，30字符以内'})
  readonly user: string

  @IsNotEmpty({message: '密码不能为空'})
  @Length(8, 30, {message: '密码长度在8字符以上，30字符以内'})
  readonly password: string
}

export class RegisterWithVerificationCodeDto {
  @IsOptional()
  @IsNotEmpty({message: '用户手机号不能为空'})
  @Length(1, 30, {message: '用户手机号长度在1字符以上，30字符以内'})
  readonly tel?: string

  @IsOptional()
  @IsNotEmpty({message: '用户邮箱号不能为空'})
  @IsEmail({}, {message: '用户邮箱格式不正确'})
  @Length(1, 60, {message: '用户邮箱号长度在1字符以上，60字符以内'})
  readonly email?: string

  @IsNotEmpty({message: '验证码不能为空'})
  @IsNumber({allowInfinity: false, allowNaN: false}, {message: '验证码必须为数字'})
  readonly verificationCode: number

  @IsOptional()
  @IsNotEmpty({message: '密码不能为空'})
  @Length(8, 30, {message: '密码长度在8字符以上，30字符以内'})
  readonly password?: string

  @IsOptional()
  @IsNotEmpty({message: '用户名不能为空'})
  @Length(2, 30, {message: '用户名长度在2字符以上，30字符以内'})
  readonly user?: string
}
