<template>
    <div class="payment-page min-h-screen bg-gray-50 py-10">
        <div class="container mx-auto px-4">
            <h1 class="mb-8 text-2xl font-bold text-gray-800 text-center">
                Payment Method
            </h1>

            <div v-if="!checkoutId">
                <div v-if="loadingOrder" class="text-center py-12">
                    <div
                        class="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto">
                    </div>
                    <p class="mt-4 text-gray-600">Loading order details...</p>
                </div>
                <div v-else-if="!paymentMethods.length" class="text-center py-12">
                    <p class="text-gray-500 text-lg">No payment methods available.</p>
                </div>
                <div v-else class="space-y-4">
                    <div v-for="method in paymentMethods" :key="method" @click="selectedMethod = method"
                        class="rounded-2xl border w-full bg-white px-3 py-2 cursor-pointer transition hover:border-yellow-400 hover:shadow-sm"
                        :class="selectedMethod === method ? 'bg-yellow-100 border-yellow-400' : 'border-gray-200'">
                        <p class="text-lg font-semibold text-center p-3 text-gray-800">Pay with {{ method }}</p>
                    </div>
                </div>

                <div v-if="error" class="mt-4 text-center">
                    <p class="text-red-500">{{ error }}</p>
                </div>

                <div class="mt-8 flex justify-center">
                    <button @click="handlePay" :disabled="submitting || !selectedMethod"
                        class="w-1/2 rounded-full uppercase bg-yellow-400 py-4 font-semibold text-black transition hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span v-if="submitting" class="inline-flex items-center gap-2">
                            <span
                                class="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                            Processing...
                        </span>
                        <span v-else>Pay</span>
                    </button>
                </div>
            </div>

            <div v-if="loadingCheckout" class="text-center py-12">
                <div
                    class="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto">
                </div>
                <p class="mt-4 text-gray-600">Preparing payment...</p>
            </div>

            <div v-if="checkoutId" class="max-w-lg mx-auto">
                <div class="bg-white rounded-2xl p-6 shadow-md">
                    <h2 class="text-lg font-semibold text-center mb-6">Enter your card details</h2>
                    <form :action="hyperpayRedirectUrl" class="paymentWidgets" :data-brands="hyperpayBrands"></form>
                </div>
            </div>

            <div v-if="showCodPopup" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                        <span class="text-3xl text-green-500">&#10003;</span>
                    </div>
                    <h2 class="text-xl font-bold text-gray-800 mb-3">Cash on Delivery</h2>
                    <p class="text-gray-600 mb-6">{{ codMessage }}</p>
                    <NuxtLink to="/my-orders"
                        class="inline-block px-6 py-3 bg-yellow-400 rounded-full font-semibold hover:bg-yellow-500 transition">
                        View My Orders
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
console.log("[PAYMENT INDEX] Page mounted");

definePageMeta({
    key: route => route.fullPath,
});

useHead({
    meta: [
        {
            "http-equiv": "Content-Security-Policy",
            content: "script-src 'self' https://ajax.googleapis.com/ https://test.oppwa.com 'unsafe-inline' 'unsafe-eval'; worker-src blob: https://test.oppwa.com; frame-src https://test.oppwa.com",
        },
    ],
});

const route = useRoute();
const { getsingleOrder } = useGlobalApi();
const { usePayment, usePaymentMembership, usePaymentToChargeWallet, tamaraPayment, tabyPayment, checkOnDelivery } = PayMents();
const localePath = useLocalePath();

const orderId = computed(() => route.query.order_id);
const membershipId = computed(() => route.query.membership_id);
const walletAmount = computed(() => route.query.amount);
const carId = computed(() => route.query.car_id);

const paymentContext = computed(() => {
    if (orderId.value) return "order";
    if (membershipId.value) return "membership";
    if (walletAmount.value) return "wallet";
    return null;
});

const showCashOnDelivery = ref(false);
const showCodPopup = ref(false);
const codMessage = ref("");
const codTimer = ref(null);
const totalAmount = ref(0);
const selectedMethod = ref("");
const submitting = ref(false);
const error = ref("");
const checkoutId = ref(null);
const loadingCheckout = ref(false);
const loadingOrder = ref(true);
const hyperpayBrands = ref("");

onUnmounted(() => {
    if (codTimer.value) clearTimeout(codTimer.value);
});

onMounted(async () => {
    if (paymentContext.value === "order") {
        try {
            const res = await getsingleOrder(orderId.value);
            const data = res?.data ?? res;
            totalAmount.value = data?.total_amount ?? 0;
            if (data?.open_cache === true || data?.open_cache === 1 || data?.open_cache === "1") {
                showCashOnDelivery.value = true;
            }
        } catch (err) {
            console.error("Failed to fetch order:", err);
        } finally {
            loadingOrder.value = false;
        }
    } else {
        loadingOrder.value = false;
    }
});

const paymentMethods = computed(() => {
    const methods = ["Visa", "Mada", "MasterCard", "Tabby", "Tamara"];
    if (showCashOnDelivery.value) {
        methods.push("Cash on Delivery");
    }
    return methods;
});

const origin = import.meta.client ? window.location.origin : "";

const callbackParams = computed(() => {
    if (paymentContext.value === "order") return `order_id=${orderId.value}`;
    if (paymentContext.value === "membership") {
        let params = `membership_id=${membershipId.value}`;
        if (carId.value) params += `&car_id=${carId.value}`;
        return params;
    }
    if (paymentContext.value === "wallet") return `amount=${walletAmount.value}`;
    return "";
});

const hyperpayRedirectUrl = computed(() => {
    return `${origin}/payment/status?gateway=hyperpay&${callbackParams.value}`;
});

const brandMap = {
    Visa: "visa",
    Mada: "mada",
    MasterCard: "mastercard",
};

const hyperpayWidgetBrands = {
    Visa: "VISA",
    Mada: "MADA",
    MasterCard: "MASTER",
};

async function handlePay() {
    if (!selectedMethod.value || submitting.value) return;

    error.value = "";
    submitting.value = true;

    try {
        if (selectedMethod.value === "Tamara") {
            await handleTamaraPayment();
        } else if (selectedMethod.value === "Tabby") {
            await handleTabbyPayment();
        } else if (selectedMethod.value === "Cash on Delivery") {
            await handleCashOnDelivery();
        } else {
            await handleHyperpayPayment();
        }
    } catch (err) {
        error.value = err?.data?.message || err?.message || "Payment failed. Please try again.";
        console.error("Payment error:", err);
    } finally {
        submitting.value = false;
    }
}

async function handleHyperpayPayment() {
    loadingCheckout.value = true;

    try {
        const apiBrand = brandMap[selectedMethod.value];
        const widgetBrands = hyperpayWidgetBrands[selectedMethod.value] || "VISA MASTER MADA";

        let res;
        if (paymentContext.value === "order") {
            res = await usePayment(Number(orderId.value), apiBrand, 0, Number(totalAmount.value));
        } else if (paymentContext.value === "membership") {
            res = await usePaymentMembership(Number(membershipId.value), apiBrand, carId.value ? Number(carId.value) : undefined);
        } else if (paymentContext.value === "wallet") {
            res = await usePaymentToChargeWallet(Number(walletAmount.value), apiBrand);
        }

        const data = res?.data ?? res;

        if (data?.status === false) {
            throw new Error(data?.message || "Payment preparation failed");
        }

        const id = data?.id ?? data?.checkout_id ?? data?.checkoutId;

        if (!id) {
            throw new Error("Failed to get checkout ID from HyperPay");
        }

        checkoutId.value = id;
        hyperpayBrands.value = widgetBrands;

        await nextTick();
        loadHyperpayWidget(id);
    } finally {
        loadingCheckout.value = false;
    }
}

function loadHyperpayWidget(id) {
    const existing = document.querySelector('script[src*="paymentWidgets.js"]');
    if (existing) {
        existing.remove();
    }

    const successUrl = `${origin}${localePath('/payment/status')}?gateway=hyperpay&${callbackParams.value}`;
    const failureUrl = `${origin}${localePath('/payment/failure')}?gateway=hyperpay&${callbackParams.value}`;
    const cancelUrl = `${origin}${localePath('/payment/cancel')}?gateway=hyperpay&${callbackParams.value}`;

    window.wpwlOptions = {
        onCheckoutSuccess: function () {
            window.location.href = successUrl;
        },
        onCheckoutFailure: function () {
            window.location.href = failureUrl;
        },
        onCheckoutCancel: function () {
            window.location.href = cancelUrl;
        },
    };

    const script = document.createElement("script");
    script.src = `https://test.oppwa.com/v2/paymentWidgets.js?checkoutId=${id}`;
    script.async = true;
    document.head.appendChild(script);
}

async function handleTamaraPayment() {
    const successUrl = `${origin}${localePath('/payment/status')}?gateway=tamara&${callbackParams.value}`;
    const failureUrl = `${origin}${localePath('/payment/failure')}?gateway=tamara&${callbackParams.value}`;
    const cancelUrl = `${origin}${localePath('/payment/cancel')}?gateway=tamara&${callbackParams.value}`;

    const payload = { success_url: successUrl, failure_url: failureUrl, cancel_url: cancelUrl };
    if (paymentContext.value === "order") {
        payload.order_id = Number(orderId.value);
    } else if (paymentContext.value === "membership") {
        payload.membership_id = Number(membershipId.value);
    } else if (paymentContext.value === "wallet") {
        payload.wallet_amount = Number(walletAmount.value);
    }

    const res = await tamaraPayment(payload);

    const data = res?.data ?? res;
    const checkoutUrl = data?.checkout_url;

    if (checkoutUrl) {
        window.location.href = checkoutUrl;
    } else {
        throw new Error("No checkout URL returned from Tamara");
    }
}

async function handleCashOnDelivery() {
    const res = await checkOnDelivery(orderId.value);
    const data = res?.data ?? res;
    codMessage.value = data?.refrence || "Your order will be delivered. Thank you!";
    showCodPopup.value = true;
    codTimer.value = setTimeout(() => {
        navigateTo("/");
    }, 3000);
}

async function handleTabbyPayment() {
    const successUrl = `${origin}${localePath('/payment/status')}?gateway=tabby&${callbackParams.value}`;
    const failureUrl = `${origin}${localePath('/payment/failure')}?gateway=tabby&${callbackParams.value}`;
    const cancelUrl = `${origin}${localePath('/payment/cancel')}?gateway=tabby&${callbackParams.value}`;

    const payload = { success_url: successUrl, failure_url: failureUrl, cancel_url: cancelUrl };
    if (paymentContext.value === "order") {
        payload.order_id = Number(orderId.value);
    } else if (paymentContext.value === "membership") {
        payload.membership_id = Number(membershipId.value);
    } else if (paymentContext.value === "wallet") {
        payload.wallet_amount = Number(walletAmount.value);
    }

    const res = await tabyPayment(payload);

    const data = res?.data ?? res;
    const checkoutUrl = data?.checkout_url || data?.url || data?.redirect_url || data?.payment_url;

    if (checkoutUrl) {
        window.location.href = checkoutUrl;
    } else {
        console.error("Tabby response (no checkout_url found):", JSON.stringify(data, null, 2));
        throw new Error(data?.message || data?.error || "No checkout URL returned from Tabby");
    }
}
</script>
