<template>
  <div class="w-full px-3 pt-4 pb-1 md:px-5">
    <div class="flex items-center md:justify-center gap-2 px-4 py-3 max-w-4xl mx-auto bg-white border border-gray-200 rounded-[20px] shadow-sm overflow-x-auto [&::-webkit-scrollbar]:hidden">
      <NuxtLink v-for="link in links" :key="link.to" :to="link.to" custom v-slot="{ navigate, isExactActive }">
        <span @click="navigate" :class="['text-black font-medium transition-all px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap text-sm md:text-base', isExactActive ? 'bg-main-color' : 'opacity-50 hover:opacity-80']">
          {{ link.label }}
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
})

const allLinks = [
  { to: '/my-cars', label: 'My Cars' },
  { to: '/wallet', label: 'Wallet' },
  { to: '/language', label: 'Language' },
  { to: '/points', label: 'Points' },
  { to: '/vouchers', label: 'Vouchers' },
  { to: '/memberships', label: 'Memberships' },
  { to: '/help', label: 'Help' },
]

const guestOnly = ['/language', '/help']

const links = computed(() => {
  if (props.isLoggedIn) return allLinks
  return allLinks.filter(link => guestOnly.includes(link.to))
})
</script>
