// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    ollama: {
      host: '',
      modelName: '',
    },
    tmdb: {
      apiKey: '',
    },
  },
  routeRules: {
    '/': {
      cache: { swr: true, maxAge: 60 * 24 },
    },
  },
  app: {
    head: {
      meta: [
        /* <meta name = "viewport" content = "width=device-width, minimum-scale=1.0, maximum-scale = 1.0, user-scalable = no"> */
        { name: 'viewport', content: 'width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no' },
      ],
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    'shadcn-nuxt',
  ],
  eslint: {
    config: {
      stylistic: true,
    },
  },
  shadcn: {
    prefix: 'Ui',
    componentDir: './app/components/ui',
  },
})
