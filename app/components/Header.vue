<template>
  <div
    v-if="menuOpen"
    class="fixed inset-0 bg-black/50 z-40 md:hidden"
    @click="menuOpen = false"
  />
  <header class="relative z-50 bg-white text-black shadow-md flex justify-center">
    <div class="container max-w-auto px-4">
      <div class="flex items-center justify-between p-4">
        <NuxtLink to="/" class="font-bold text-lg">Yarmook</NuxtLink>
        <div v-if="token" class="icons-user flex gap-2">
          <div class="w-20 h-10 hidden bg-yellow-200 rounded-lg md:flex items-center justify-center">
            <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="w-20 h-10 hidden bg-yellow-200 rounded-lg md:flex items-center justify-center">
            <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
          <div class="w-20 h-10 hidden bg-yellow-200 rounded-lg md:flex items-center justify-center">
            <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 17h14M5 17l-2-4h18l-2 4M5 17a2 2 0 01-2 2H2m20 0h-1a2 2 0 01-2-2M5 17l-1-5h16l-1 5M8 9l1-3h6l1 3M4 9h16" />
            </svg>
          </div>
        </div>
        <div v-else class="icons-user flex gap-2">
          <NuxtLink to="/create-account" class="w-20 h-10 hidden bg-yellow-200 rounded-lg md:flex items-center justify-center">
            <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </NuxtLink>
          <NuxtLink to="/cart" class="w-20 h-10 hidden bg-yellow-200 rounded-lg md:flex items-center justify-center">
            <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </NuxtLink>
        </div>
        <div class="md:hidden flex align-middle gap-2">

          <div class="w-10 h-10  bg-yellow-200 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>

          <button @click="menuOpen = !menuOpen">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!menuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

        </div>
      </div>
      <nav v-if="menuOpen" class="md:hidden flex flex-col gap-2 pb-4 px-4">
        <NuxtLink to="/" exact-active-class="active" class="hover:text-gray-600" @click="menuOpen = false">Home</NuxtLink>
        <NuxtLink to="/my-orders" exact-active-class="active" class="hover:text-gray-600" @click="menuOpen = false">My Orders</NuxtLink>
        <NuxtLink to="/services" exact-active-class="active" class="hover:text-gray-600" @click="menuOpen = false">Services</NuxtLink>
        <NuxtLink to="/offers" exact-active-class="active" class="hover:text-gray-600" @click="menuOpen = false">Offers</NuxtLink>
        <NuxtLink to="/memberships" exact-active-class="active" class="hover:text-gray-600" @click="menuOpen = false">Memberships</NuxtLink>
        <NuxtLink to="/spare-parts" exact-active-class="active" class="hover:text-gray-600" @click="menuOpen = false">Spare Parts</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
const { token } = useGlobalApi()
const menuOpen = ref(false)
</script>
