export default defineNuxtRouteMiddleware((to) => {
  const cookieLocale = useCookie('i18n_redirected').value
  if (!cookieLocale || cookieLocale === 'ar') return

  const firstSegment = to.fullPath.split('/').filter(Boolean)[0]
  const knownLocales = ['ar', 'en']
  if (knownLocales.includes(firstSegment)) return

  return navigateTo('/' + cookieLocale + to.fullPath, { redirectCode: 302 })
})
