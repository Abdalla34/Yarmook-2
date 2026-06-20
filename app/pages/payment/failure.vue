<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-10">
        <div class="bg-white rounded-2xl shadow-md p-8 max-w-md w-full mx-4 text-center">
            <div v-if="loading" class="py-8">
                <div class="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p class="mt-4 text-gray-600">Processing...</p>
            </div>

            <div v-else class="py-8">
                <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <span class="text-3xl text-red-500">&#10005;</span>
                </div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
                <p class="text-gray-500 mb-2">{{ error || "Your payment could not be processed. Please try again." }}</p>
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
const { tabbyStatusFailure } = PayMents();

const loading = ref(true);
const error = ref("");

const gateway = route.query.gateway;
const orderId = route.query.order_id;
const paymentId = route.query.payment_id ?? route.query.id;

onMounted(async () => {
    try {
        if (gateway === "tabby" && paymentId) {
            const res = await tabbyStatusFailure(paymentId);
            error.value = res?.message || "Payment was declined.";
        }
    } catch (err) {
        error.value = err?.data?.message || err?.message || "Payment was declined.";
        console.error("Payment failure error:", err);
    } finally {
        loading.value = false;
    }
});
</script>
