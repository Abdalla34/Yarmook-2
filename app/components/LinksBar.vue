<template>
  <div class="hidden md:block px-5 pt-1 pb-1 mt-4">
    <div class="flex items-center justify-center gap-6 px-4 py-3 max-w-4xl mx-auto bg-white border border-gray-200 rounded-[20px] shadow-sm">
      <template v-for="link in links" :key="link.to">
        <NuxtLink :to="localePath(link.to)" custom v-slot="{ navigate, isExactActive }">
          <span @click="navigate" :class="['text-black font-medium transition-all px-2 py-1 rounded-lg cursor-pointer inline-flex items-center gap-1', isExactActive ? 'opacity-100 bg-main-color' : 'opacity-50 hover:opacity-80']">
            <IconsHomeIcon v-if="link.to === '/'" :active="isExactActive" />
            <IconsOffersIcon v-if="link.to === '/offers'" :active="isExactActive" />
            <IconsMyOrders v-if="link.to === '/my-orders'" :active="isExactActive" />
            <IconsServicesIcon v-if="link.to === '/services'" :active="isExactActive" />
            <IconsSparePartsIcon v-if="link.to === '/spare-parts'" :active="isExactActive" />
            {{ link.label }}
          </span>
        </NuxtLink>
      </template>
    </div>
  </div>
</template>

<script setup>
const localePath = useLocalePath()
const { t } = useI18n()

const links = [
  { to: '/', label: computed(() => t('home')) },
  { to: '/my-orders', label: computed(() => t('my_orders')) },
  { to: '/services', label: computed(() => t('services')) },
  { to: '/offers', label: computed(() => t('offers')) },
  // { to: '/memberships', label: computed(() => t('memberships')) },
  { to: '/spare-parts', label: computed(() => t('spare_parts')) },
]
</script>
