<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-10">
        <div class="bg-white rounded-2xl shadow-md p-8 max-w-md w-full mx-4 text-center">
            <div class="py-8">
                <div
                    class="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto">
                </div>
                <p class="mt-4 text-gray-600">{{ $t('verifying_payment') }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
console.log("[PAYMENT STATUS] Page mounted");

const route = useRoute();

const gateway = route.query.gateway;
const orderId = route.query.order_id;
const membershipId = route.query.membership_id;
const walletAmount = route.query.amount;
const carId = route.query.car_id;
const id = route.query.id ?? route.query.resourcePath;

const params = new URLSearchParams();
params.set('gateway', gateway || 'unknown');
if (orderId) params.set('order_id', orderId);
if (membershipId) params.set('membership_id', membershipId);
if (carId) params.set('car_id', carId);
if (walletAmount) params.set('amount', walletAmount);

function redirect(url) {
    window.location.href = url;
}

if (import.meta.client) {
    if (gateway === "tabby") {
        redirect(`/payment/success?${params.toString()}`);
    } else if (gateway === "tamara") {
        redirect(`/payment/success?${params.toString()}`);
    } else if (gateway === "hyperpay" && id) {
        redirect(`/payment/success?${params.toString()}`);
    } else {
        redirect(`/payment/success?${params.toString()}`);
    }
}
</script>
