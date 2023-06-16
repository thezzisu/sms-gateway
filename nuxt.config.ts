// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    tencentSecretId: '',
    tencentSecretKey: '',
    tencentSmsAppId: '',
    tencentSmsSign: '',
    tencentSmsTemplateId: '',
    apiTokens: ''
  }
})
