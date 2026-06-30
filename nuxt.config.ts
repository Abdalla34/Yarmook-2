// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss', '@vee-validate/nuxt', '@nuxtjs/i18n'
  ],

  i18n: {
    locales: [
      { code: 'ar', iso: 'ar-SA', dir: 'rtl', name: 'العربية' },
      { code: 'en', iso: 'en-US', dir: 'ltr', name: 'English' },
    ],
    defaultLocale: 'ar',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    vueI18n: 'i18n.config.ts',
  },
  css: ['@/assets/css/tailwind.css'],
  runtimeConfig: {
    public: {
      apiBase: 'https://alyarmook.demo.asol-tec.com/api',
    },
  },
})
