<template>
    <div class="payment-page min-h-screen bg-gray-50 py-10">
        <div class="container mx-auto px-4">
            <h1 class="mb-8 text-2xl font-bold text-gray-800 text-center">
                Payment Method
            </h1>

            <!-- No order ID -->
            <div v-if="!orderId" class="text-center py-12">
                <p class="text-gray-500 text-lg">No order found. Please go back to cart.</p>
                <NuxtLink to="/cart"
                    class="inline-block mt-4 px-6 py-2 bg-main-color rounded-lg font-medium hover:opacity-90 transition">
                    Back to Cart
                </NuxtLink>
            </div>

            <!-- Payment method selection -->
            <template v-else>
                <div v-if="!checkoutId">
                    <div class="space-y-4">
                        <div
                            v-for="method in paymentMethods"
                            :key="method"
                            @click="selectedMethod = method"
                            class="rounded-2xl border w-full bg-white px-3 py-2 cursor-pointer transition hover:border-yellow-400 hover:shadow-sm"
                            :class="selectedMethod === method ? 'bg-yellow-100 border-yellow-400' : 'border-gray-200'"
                        >
                            <p class="text-lg font-semibold text-center p-3 text-gray-800">Pay with {{ method }}</p>
                        </div>
                    </div>

                    <div v-if="error" class="mt-4 text-center">
                        <p class="text-red-500">{{ error }}</p>
                    </div>

                    <div class="mt-8 flex justify-center">
                        <button @click="handlePay"
                            :disabled="submitting || !selectedMethod"
                            class="w-1/2 rounded-full uppercase bg-yellow-400 py-4 font-semibold text-black transition hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed">
                            <span v-if="submitting" class="inline-flex items-center gap-2">
                                <span class="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                                Processing...
                            </span>
                            <span v-else>Pay</span>
                        </button>
                    </div>
                </div>

                <!-- Loading checkout -->
                <div v-if="loadingCheckout" class="text-center py-12">
                    <div class="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p class="mt-4 text-gray-600">Preparing payment...</p>
                </div>

                <!-- HyperPay Widget -->
                <div v-if="checkoutId" class="max-w-lg mx-auto">
                    <div class="bg-white rounded-2xl p-6 shadow-md">
                        <h2 class="text-lg font-semibold text-center mb-6">Enter your card details</h2>
                        <form
                            :action="hyperpayRedirectUrl"
                            class="paymentWidgets"
                            :data-brands="hyperpayBrands"
                        ></form>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
const route = useRoute();
const { usePayment, tamaraPayment, tabyPayment } = PayMents();

const orderId = route.query.order_id;

const paymentMethods = ["Visa", "Mada", "MasterCard", "Tabby", "Tamara"];
const selectedMethod = ref("");
const submitting = ref(false);
const error = ref("");
const checkoutId = ref(null);
const loadingCheckout = ref(false);
const hyperpayBrands = ref("");

const origin = import.meta.client ? window.location.origin : "";

const hyperpayRedirectUrl = computed(() => {
    return `${origin}/payment/success?gateway=hyperpay&order_id=${orderId}`;
});

const brandMap = {
    Visa: "VISA",
    Mada: "MADA",
    MasterCard: "MASTER",
};

async function handlePay() {
    if (!selectedMethod.value || submitting.value || !orderId) return;

    error.value = "";
    submitting.value = true;

    try {
        if (selectedMethod.value === "Tamara") {
            await handleTamaraPayment();
        } else if (selectedMethod.value === "Tabby") {
            await handleTabbyPayment();
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
        const brand = brandMap[selectedMethod.value] || "VISA MASTER MADA";

        const res = await usePayment(orderId, brand, null);
        const data = res?.data ?? res;
        const id = data?.id;

        if (!id) {
            throw new Error("Failed to get checkout ID from HyperPay");
        }

        checkoutId.value = id;
        hyperpayBrands.value = brand;

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

    const script = document.createElement("script");
    script.src = `https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=${id}`;
    script.async = true;
    document.head.appendChild(script);
}

async function handleTamaraPayment() {
    const successUrl = `${origin}/payment/success?gateway=tamara&order_id=${orderId}`;
    const failureUrl = `${origin}/payment/failure?gateway=tamara&order_id=${orderId}`;
    const cancelUrl = `${origin}/payment/cancel?gateway=tamara&order_id=${orderId}`;

    const res = await tamaraPayment({
        order_id: orderId,
        success_url: successUrl,
        failure_url: failureUrl,
        cancel_url: cancelUrl,
    });

    const data = res?.data ?? res;
    const checkoutUrl = data?.checkout_url;

    if (checkoutUrl) {
        window.location.href = checkoutUrl;
    } else {
        throw new Error("No checkout URL returned from Tamara");
    }
}

async function handleTabbyPayment() {
    const successUrl = `${origin}/payment/success?gateway=tabby&order_id=${orderId}`;
    const failureUrl = `${origin}/payment/failure?gateway=tabby&order_id=${orderId}`;
    const cancelUrl = `${origin}/payment/cancel?gateway=tabby&order_id=${orderId}`;

    const res = await tabyPayment({
        order_id: orderId,
        success_url: successUrl,
        failure_url: failureUrl,
        cancel_url: cancelUrl,
    });

    const data = res?.data ?? res;
    const checkoutUrl = data?.checkout_url;

    if (checkoutUrl) {
        window.location.href = checkoutUrl;
    } else {
        throw new Error("No checkout URL returned from Tabby");
    }
}
</script>