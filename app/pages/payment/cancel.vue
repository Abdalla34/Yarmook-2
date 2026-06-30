<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-10">
        <div class="bg-white rounded-2xl shadow-md p-8 max-w-md w-full mx-4 text-center">
            <div v-if="loading" class="py-8">
                <div class="w-10 h-10 border-4 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p class="mt-4 text-gray-600">Processing...</p>
            </div>

            <div v-else class="py-8">
                <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <span class="text-3xl text-gray-500">&#10007;</span>
                </div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
                <p class="text-gray-500 mb-6">You have cancelled the payment.</p>
                <NuxtLink :to="payLink"
                    class="inline-block px-6 py-3 bg-yellow-400 rounded-full font-semibold hover:bg-yellow-500 transition">
                    Choose Another Method
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
const route = useRoute();
const { tabbyStatusCancel } = PayMents();

const loading = ref(true);

const gateway = route.query.gateway;
const orderId = route.query.order_id;
const membershipId = route.query.membership_id;
const walletAmount = route.query.amount;
const carId = route.query.car_id;
const paymentId = route.query.payment_id ?? route.query.id;

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

onMounted(async () => {
    try {
        if (gateway === "tabby" && paymentId) {
            await tabbyStatusCancel(paymentId);
        }
    } catch (err) {
        console.error("Payment cancel error:", err);
    } finally {
        loading.value = false;
    }
});
</script>
