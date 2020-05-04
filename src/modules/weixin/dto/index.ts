import {IsNumber, IsNotEmpty, IsArray} from 'class-validator'
export * from './create-weixin-user.dto'
export * from './update-weixin-user.dto'

export class WeixinUserIdDto {
  @IsNotEmpty({message: '微信用户 id 不能为空'})
  @IsNumber({allowNaN: false, allowInfinity: false}, {message: '微信用户 id 必须为数字'})
  readonly weixinUserId: number
}
