<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-10">
        <div class="bg-white rounded-2xl shadow-md p-8 max-w-md w-full mx-4 text-center">
            <div v-if="loading" class="py-8">
                <div class="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p class="mt-4 text-gray-600">Verifying payment...</p>
            </div>

            <div v-else-if="error" class="py-8">
                <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <span class="text-3xl text-red-500">&#10005;</span>
                </div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">Payment Error</h1>
                <p class="text-gray-500">{{ error }}</p>
            </div>

            <div v-else class="py-8">
                <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <span class="text-3xl text-green-500">&#10003;</span>
                </div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">Payment Successful</h1>
                <p class="text-gray-500 mb-6">Your payment has been processed successfully.</p>
                <NuxtLink to="/my-orders"
                    class="inline-block px-6 py-3 bg-yellow-400 rounded-full font-semibold hover:bg-yellow-500 transition">
                    View My Orders
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
const route = useRoute();
const { getHyperpayStatus, tabbyStatusSuccess } = PayMents();

const loading = ref(true);
const error = ref("");

const gateway = route.query.gateway;
const orderId = route.query.order_id;
const id = route.query.id ?? route.query.resourcePath;
const paymentId = route.query.payment_id;

onMounted(async () => {
    try {
        if (gateway === "hyperpay" && id) {
            await getHyperpayStatus(id);
        } else if (gateway === "tabby") {
            const pid = paymentId || id;
            if (pid) {
                await tabbyStatusSuccess(pid);
            }
        }
    } catch (err) {
        error.value = err?.data?.message || err?.message || "Could not verify payment status.";
        console.error("Payment verification error:", err);
    } finally {
        loading.value = false;
    }
});
</script>
