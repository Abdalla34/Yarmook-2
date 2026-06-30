<template>
  <div
    v-if="menuOpen"
    class="fixed inset-0 bg-black/50 z-40 md:hidden"
    @click="menuOpen = false"
  />
  <header class="fixed top-0 left-0 w-full z-50 text-black flex justify-center transition-all duration-300"
    :class="scrolled ? 'bg-white shadow-md' : 'bg-transparent'">
    <div class="container max-w-auto px-4">
      <div class="flex items-center justify-between p-4">
        <NuxtLink to="/" class="font-bold text-lg"><img src="/Yarmook Logo.png" alt=""></NuxtLink>
        <div v-if="token" class="icons-user flex gap-2">
          <div @click="navigateTo(localePath('/profile'))" class="w-20 h-10 cursor-pointer hidden bg-yellow-200 rounded-lg md:flex items-center justify-center">
            <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <NuxtLink to="/cart" class="w-20 h-10 hidden bg-yellow-200 rounded-lg md:flex items-center justify-center relative">
            <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <span v-if="cartCount > 0"
              class="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {{ cartCount }}
            </span>
          </NuxtLink>
          <NuxtLink to="/my-cars" class="w-20 h-10 hidden bg-yellow-200 rounded-lg md:flex items-center justify-center">
            <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 17h14M5 17l-2-4h18l-2 4M5 17a2 2 0 01-2 2H2m20 0h-1a2 2 0 01-2-2M5 17l-1-5h16l-1 5M8 9l1-3h6l1 3M4 9h16" />
            </svg>
          </NuxtLink>
        </div>
        <div v-else class="icons-user flex gap-2">
          <NuxtLink to="/create-account" class="w-20 h-10 hidden bg-yellow-200 rounded-lg md:flex items-center justify-center">
            <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </NuxtLink>
          <NuxtLink to="/cart" class="w-20 h-10 hidden bg-yellow-200 rounded-lg md:flex items-center justify-center relative">
            <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <span v-if="cartCount > 0"
              class="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {{ cartCount }}
            </span>
          </NuxtLink>
        </div>
        <div class="md:hidden flex align-middle gap-2">

          <NuxtLink to="/cart" class="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center relative">
            <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <span v-if="cartCount > 0"
              class="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {{ cartCount }}
            </span>
          </NuxtLink>

          <button @click="menuOpen = !menuOpen">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!menuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

        </div>
      </div>
      <Transition name="slide-right">
        <nav v-if="menuOpen"
          class="fixed top-0 right-0 h-full w-72 z-50 flex flex-col bg-white shadow-xl">
          <div class="flex items-center justify-between p-4 border-b border-gray-100">
            <img src="/Yarmook Logo.png" class="h-8" alt="Yarmook" />
            <button @click="menuOpen = false">
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="token" class="flex gap-3 px-4 py-4 border-b border-gray-100">
            <NuxtLink to="/profile" @click="menuOpen = false"
              class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-yellow-200 text-sm font-semibold">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </NuxtLink>
            <NuxtLink to="/my-cars" @click="menuOpen = false"
              class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-yellow-200 text-sm font-semibold">
              <IconsCarIcon />
              My Cars
            </NuxtLink>
          </div>

          <div v-else class="px-4 py-4 border-b border-gray-100">
            <NuxtLink to="/create-account" @click="menuOpen = false"
              class="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-yellow-200 text-sm font-semibold">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </NuxtLink>
          </div>

          <div class="flex-1 flex flex-col gap-1 px-4 py-4 overflow-y-auto">
            <NuxtLink to="/" active-class="bg-main-color/30 font-bold" class="rounded-xl px-5 py-3.5 text-base font-medium hover:bg-main-color/20 transition" @click="menuOpen = false">Home</NuxtLink>
            <NuxtLink to="/my-orders" active-class="bg-main-color/30 font-bold" class="rounded-xl px-5 py-3.5 text-base font-medium hover:bg-main-color/20 transition" @click="menuOpen = false">My Orders</NuxtLink>
            <NuxtLink to="/services" active-class="bg-main-color/30 font-bold" class="rounded-xl px-5 py-3.5 text-base font-medium hover:bg-main-color/20 transition" @click="menuOpen = false">Services</NuxtLink>
            <NuxtLink to="/offers" active-class="bg-main-color/30 font-bold" class="rounded-xl px-5 py-3.5 text-base font-medium hover:bg-main-color/20 transition" @click="menuOpen = false">Offers</NuxtLink>
            <NuxtLink to="/memberships" active-class="bg-main-color/30 font-bold" class="rounded-xl px-5 py-3.5 text-base font-medium hover:bg-main-color/20 transition" @click="menuOpen = false">Memberships</NuxtLink>
            <NuxtLink to="/spare-parts" active-class="bg-main-color/30 font-bold" class="rounded-xl px-5 py-3.5 text-base font-medium hover:bg-main-color/20 transition" @click="menuOpen = false">Spare Parts</NuxtLink>
          </div>
        </nav>
      </Transition>
    </div>
  </header>
</template>

<script setup>
const { token } = useGlobalApi()
const { cartCount, getMyCart } = useAddToCart()
const localePath = useLocalePath()
const menuOpen = ref(false)
const scrolled = ref(false)

onMounted(() => {
  if (token.value) {
    getMyCart()
  }
  const handleScroll = () => {
    scrolled.value = window.scrollY > 0
  }
  window.addEventListener('scroll', handleScroll)
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})
</script>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
