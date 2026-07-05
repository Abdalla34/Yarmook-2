<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-10">
        <div class="bg-white rounded-2xl shadow-md p-8 max-w-md w-full mx-4 text-center">
            <div class="py-8">
                <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <span class="text-3xl text-green-500">&#10003;</span>
                </div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ $t('payment_successful') }}</h1>
                <p class="text-gray-500 mb-6">{{ $t('payment_successful_desc') }}</p>
                <NuxtLink to="/my-orders"
                    class="inline-block px-6 py-3 bg-yellow-400 rounded-full font-semibold hover:bg-yellow-500 transition">
                    {{ $t('my_orders') }}
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
const { cartCount } = useAddToCart();

onMounted(() => {
    cartCount.value = 0;

    setTimeout(() => {
        navigateTo("/my-orders");
    }, 4000);
});
</script>
