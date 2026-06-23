<template>
  <div class="px-5 pt-4 pb-1">
    <div class="flex items-center justify-center gap-2 px-4 py-3 max-w-4xl mx-auto bg-white border border-gray-200 rounded-[20px] shadow-sm overflow-x-auto">
      <NuxtLink v-for="link in links" :key="link.to" :to="link.to" custom v-slot="{ navigate, isExactActive }">
        <span @click="navigate" :class="['text-black font-medium transition-all px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap', isExactActive ? 'bg-main-color' : 'opacity-50 hover:opacity-80']">
          {{ link.label }}
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const links = [
  { to: '/my-cars', label: 'My Cars' },
  { to: '/wallet', label: 'Wallet' },
  { to: '/language', label: 'Language' },
  { to: '/points', label: 'Points' },
  { to: '/vouchers', label: 'Vouchers' },
  { to: '/help', label: 'Help' },
]
</script>
