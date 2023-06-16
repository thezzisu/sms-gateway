import { Type } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import * as tencent from 'tencentcloud-sdk-nodejs-sms'

const SmsClient = tencent.sms.v20210111.Client

const Body = Type.Object({
  credential: Type.Object({
    secretId: Type.String(),
    secretKey: Type.String()
  }),
  params: Type.Any()
})

const BodyChecker = TypeCompiler.Compile(Body)

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!BodyChecker.Check(body)) throw createError({ statusCode: 400 })
  const client = new SmsClient({
    credential: body.credential,
    region: 'ap-beijing',
    profile: {
      httpProfile: {
        endpoint: 'sms.tencentcloudapi.com'
      }
    }
  })
  const resp = await client.SendSms(body.params)
  return resp
})
