// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss', '@vee-validate/nuxt'
  ],
  css: ['@/assets/css/tailwind.css'],
  runtimeConfig: {
    public: {
      apiBase: 'https://alyarmook.demo.asol-tec.com/api',
    },
  },
})
