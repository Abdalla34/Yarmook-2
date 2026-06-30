<template>
    <div class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] md:hidden transition-transform duration-300"
        :class="visible ? 'translate-y-0' : 'translate-y-full'">
        <div class="flex items-center justify-around px-2 py-2">
            <NuxtLink to="/"
                class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition"
                :class="isActive('/') ? 'text-black' : 'text-gray-400'">
                <IconsHomeIcon :active="isActive('/')" />
                <span class="text-[10px] font-medium">Home</span>
            </NuxtLink>
            <NuxtLink to="/profile"
                class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition"
                :class="isActive('/profile') ? 'text-black' : 'text-gray-400'">
                <IconsProfileIcon :active="isActive('/profile')" />
                <span class="text-[10px] font-medium">Profile</span>
            </NuxtLink>
            <NuxtLink to="/my-orders"
                class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition"
                :class="isActive('/my-orders') ? 'text-black' : 'text-gray-400'">
                <IconsMyOrders :active="isActive('/my-orders')" />
                <span class="text-[10px] font-medium">My Orders</span>
            </NuxtLink>
            <NuxtLink to="/offers"
                class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition"
                :class="isActive('/offers') ? 'text-black' : 'text-gray-400'">
                <IconsOffersIcon :active="isActive('/offers')" />
                <span class="text-[10px] font-medium">Offers</span>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
const route = useRoute();
const localePath = useLocalePath();
const visible = ref(true);
const lastScrollY = ref(0);

function isActive(to) {
    return route.path === localePath(to) || route.path === to;
}

function onScroll() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY.value && currentScrollY > 50) {
        visible.value = false;
    } else {
        visible.value = true;
    }
    lastScrollY.value = currentScrollY;
}

onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener('scroll', onScroll);
});
</script>
