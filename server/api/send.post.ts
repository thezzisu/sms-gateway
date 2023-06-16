import { Type } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import * as tencent from 'tencentcloud-sdk-nodejs-sms'

const C = TypeCompiler.Compile(
  Type.Object({
    targets: Type.Array(Type.String()),
    type: Type.String(),
    content: Type.String()
  })
)

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  console.log(config)
  const tokens: string[] = config.apiTokens.split(',')
  const token = getHeader(event, 'X-API-TOKEN')
  if (!token || !tokens.includes(token)) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  const client = new tencent.sms.v20210111.Client({
    credential: {
      secretId: config.tencentSecretId,
      secretKey: config.tencentSecretKey
    },
    region: 'ap-beijing',
    profile: {
      httpProfile: {
        endpoint: 'sms.tencentcloudapi.com'
      }
    }
  })
  const body = await readBody(event)
  if (!C.Check(body)) {
    throw createError({ statusCode: 400, message: 'Bad Request' })
  }
  const resp = await client.SendSms({
    PhoneNumberSet: body.targets,
    SmsSdkAppId: '' + config.tencentSmsAppId,
    SignName: '' + config.tencentSmsSign,
    TemplateId: '' + config.tencentSmsTemplateId,
    // 你有{1}条{2}消息，校验码{3}
    TemplateParamSet: ['1', body.type, body.content]
  })
  return resp
})
