<template>
  <div class="hidden md:block px-5 pt-1 pb-1 mt-4">
    <div class="flex items-center justify-center gap-8 px-1 py-3 max-w-2xl mx-auto bg-white border border-gray-200 rounded-[20px] shadow-sm">
      <NuxtLink v-for="link in links" :key="link.to" :to="link.to" :exact-active-class="link.activeClass" class="text-black font-medium transition-all px-2 py-1 rounded-lg opacity-50 hover:opacity-80">{{ link.label }}</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const links = [
  { to: '/', label: 'Home', activeClass: 'opacity-100' },
  { to: '/my-orders', label: 'My Orders', activeClass: 'opacity-100' },
  { to: '/services', label: 'Services', activeClass: 'opacity-100' },
  { to: '/offers', label: 'Offers', activeClass: 'opacity-100' },
  { to: '/memberships', label: 'Memberships', activeClass: 'opacity-100' },
  { to: '/spare-parts', label: 'Spare Parts', activeClass: 'opacity-100' },
]
</script>
