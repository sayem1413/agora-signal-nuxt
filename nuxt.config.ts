// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },
  app: {
    head: {
      title: 'Agora Signal NUXT',
      charset: 'utf-8',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
    }
  },
  css: [
    
  ],
  runtimeConfig: {
    public: {
      AGORA_SDK_APP_ID: process.env.NUXT_AGORA_SDK_APP_ID,
      AGORA_SDK_APP_KEY: process.env.NUXT_AGORA_SDK_APP_KEY,
      API_URL: process.env.NUXT_API_URL,
    }
  },
  plugins: [
    '~/plugins/axios'
  ],
})
