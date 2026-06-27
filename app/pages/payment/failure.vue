<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-10">
        <div class="bg-white rounded-2xl shadow-md p-8 max-w-md w-full mx-4 text-center">
            <div class="py-8">
                <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <span class="text-3xl text-red-500">&#10005;</span>
                </div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
                <p class="text-gray-500 mb-2">Your payment could not be processed. Please try again.</p>
                <NuxtLink :to="`/payment?order_id=${orderId}`"
                    class="inline-block mt-4 px-6 py-3 bg-yellow-400 rounded-full font-semibold hover:bg-yellow-500 transition">
                    Try Again
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
const route = useRoute();
const orderId = route.query.order_id;
</script>
