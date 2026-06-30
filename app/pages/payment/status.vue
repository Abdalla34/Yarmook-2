<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-10">
        <div class="bg-white rounded-2xl shadow-md p-8 max-w-md w-full mx-4 text-center">
            <div class="py-8">
                <div
                    class="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto">
                </div>
                <p class="mt-4 text-gray-600">Verifying payment...</p>
            </div>
        </div>
    </div>
</template>

<script setup>
const route = useRoute();
const { getHyperpayStatus, tabbyStatusSuccess } = PayMents();
const { cartCount } = useAddToCart();

const gateway = route.query.gateway;
const orderId = route.query.order_id;
const membershipId = route.query.membership_id;
const walletAmount = route.query.amount;
const carId = route.query.car_id;
const id = route.query.id ?? route.query.resourcePath;
const paymentId = route.query.payment_id;

const callbackParams = computed(() => {
    if (orderId) return `order_id=${orderId}`;
    if (membershipId) {
        let params = `membership_id=${membershipId}`;
        if (carId) params += `&car_id=${carId}`;
        return params;
    }
    if (walletAmount) return `amount=${walletAmount}`;
    return "";
});

function redirect(url) {
    if (import.meta.client) {
        window.location.href = url;
    }
}

onMounted(async () => {
    try {
        if (gateway === "hyperpay" && id) {
            const res = await getHyperpayStatus(id);

            const isSuccess =
                res?.status === true ||
                res?.status === "true" ||
                res?.data?.status === true ||
                res?.data?.status === "true";

            if (isSuccess) {
                cartCount.value = 0;
                redirect(`/payment/success?gateway=hyperpay&${callbackParams.value}`);
            } else {
                redirect(`/payment/failure?gateway=hyperpay&${callbackParams.value}`);
            }
            return;
        }

        if (gateway === "tabby") {
            const pid = paymentId || id;

            if (pid) {
                const res = await tabbyStatusSuccess(pid);

                const isSuccess =
                    res?.status === true ||
                    res?.status === "true" ||
                    res?.data?.status === true ||
                    res?.data?.status === "true";

                if (isSuccess) {
                    cartCount.value = 0;
                    redirect(`/payment/success?gateway=tabby&${callbackParams.value}`);
                } else {
                    redirect(`/payment/failure?gateway=tabby&${callbackParams.value}`);
                }
                return;
            }
        }

        cartCount.value = 0;
        redirect(`/payment/success?gateway=${gateway || 'unknown'}&${callbackParams.value}`);
    } catch (err) {
        console.error("Payment verification error:", err);
        redirect(`/payment/failure?gateway=${gateway || 'unknown'}&${callbackParams.value}`);
    }
});
</script>
