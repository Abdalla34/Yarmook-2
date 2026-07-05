<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-10">
        <div class="bg-white rounded-2xl shadow-md p-8 max-w-md w-full mx-4 text-center">
            <div class="py-8">
                <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <span class="text-3xl text-red-500">&#10005;</span>
                </div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ $t('payment_failed') }}</h1>
                <p class="text-gray-500 mb-2">{{ $t('payment_failed_desc') }}</p>
                <NuxtLink :to="payLink"
                    class="inline-block mt-4 px-6 py-3 bg-yellow-400 rounded-full font-semibold hover:bg-yellow-500 transition">
                    {{ $t('try_again') }}
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
const route = useRoute();
const orderId = route.query.order_id;
const membershipId = route.query.membership_id;
const walletAmount = route.query.amount;
const carId = route.query.car_id;

const payLink = computed(() => {
    if (orderId) return `/payment?order_id=${orderId}`;
    if (membershipId) {
        let link = `/payment?membership_id=${membershipId}`;
        if (carId) link += `&car_id=${carId}`;
        return link;
    }
    if (walletAmount) return `/payment?amount=${walletAmount}`;
    return "/payment";
});
</script>
