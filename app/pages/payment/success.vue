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
const { cartCount } = useAddToCart();

const loading = ref(true);
const error = ref("");

const gateway = route.query.gateway;
const orderId = route.query.order_id;
const id = route.query.id ?? route.query.resourcePath;
const paymentId = route.query.payment_id;

onMounted(async () => {
    console.log("Route Query:", route.query);

  try {
    if (gateway === "hyperpay" && id) {
      console.log("Gateway:", gateway);
      console.log("Order ID:", orderId);
      console.log("ID:", id);

      const res = await getHyperpayStatus(id);

      console.log("HyperPay Response:", res);

      const data = res?.data ?? res;

      if (data?.status === false || data?.status === "failed") {
        error.value = data?.message || "Payment was not successful.";
      } else {
        cartCount.value = 0;
      }
    }
  } catch (err) {
    console.error("Verification Error:", err);
  }
    // try {
    //     if (gateway === "hyperpay" && id) {
    //         const res = await getHyperpayStatus(id);
    //         console.log("HyperPay status response:", res);
    //         const data = res?.data ?? res;
    //         if (data?.status === false || data?.status === "failed") {
    //             error.value = data?.message || "Payment was not successful.";
    //         } else {
    //             cartCount.value = 0;
    //         }
    //     } else if (gateway === "tabby") {
    //         const pid = paymentId || id;
    //         if (pid) {
    //             const res = await tabbyStatusSuccess(pid);
    //             console.log("Tabby status response:", res);
    //             const data = res?.data ?? res;
    //             if (data?.status === false || data?.status === "failed") {
    //                 error.value = data?.message || "Payment was not successful.";
    //             } else {
    //                 cartCount.value = 0;
    //             }
    //         } else {
    //             cartCount.value = 0;
    //         }
    //     } else {
    //         cartCount.value = 0;
    //     }
    // } catch (err) {
    //     error.value = err?.data?.message || err?.message || "Could not verify payment status.";
    //     console.error("Payment verification error:", err);
    // } finally {
    //     loading.value = false;
    //     if (!error.value) {
    //         setTimeout(() => navigateTo("/my-orders"), 2000);
    //     } else {
    //         setTimeout(() => navigateTo(`/payment?order_id=${orderId}`), 3000);
    //     }
    // }
});
</script>
