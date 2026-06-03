// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@vueuse/nuxt',
    '@nuxt/image',
    'nuxt-echarts',
  ],

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    sqidsAlphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    public: {
      appUrl: '',
    },
  },

  routeRules: {
    '/app/**': { ssr: false },
    '/protect/**': { ssr: false },
  },

  compatibilityDate: '2025-07-15',

  vite: {
    optimizeDeps: {
      include: [
        '@internationalized/date',
        'zod',
      ],
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },
})
