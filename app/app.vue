<template>
  <div>
    <Header />
    <div class="pt-16 pb-16 md:pb-0">
      <LinksBar />
      <NuxtPage />
    </div>
    <Footer/>
    <MobileBottomBar/>
  </div>
</template>

<script setup>
const { locale } = useI18n()

const dirMap = { ar: 'rtl', en: 'ltr' }

useHead({
  htmlAttrs: {
    dir: computed(() => dirMap[locale.value] || 'ltr'),
  },
})
</script>
