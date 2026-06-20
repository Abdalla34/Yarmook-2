<template>
    <div class="payment-page min-h-screen bg-gray-50 py-10">
        <div class="container mx-auto  px-4">
            <h1 class="mb-8 text-2xl font-bold text-gray-800 text-center">
                Payment Method
            </h1>

            <div class="space-y-4">
                <div
                    v-for="method in paymentMethods"
                    :key="method"
                    @click="selectedMethod = method"
                    class="rounded-2xl border w-full bg-white px-3 py-2 cursor-pointer transition hover:border-yellow-400 hover:shadow-sm"
                    :class="selectedMethod === method ? 'bg-yellow-100' : 'border-gray-200'"
                >
                    <p class="text-lg font-semibold text-center p-3 text-gray-800">Pay with {{ method }}</p>
                </div>
            </div>

            <div class="mt-8 flex justify-center ">
                <button @click="handleContinue"
                    class="w-1/2 rounded-full uppercase bg-gray-200 py-4 font-semibold text-black transition hover:bg-yellow-500">
                    pay
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const paymentMethods = ["Visa", "Mada", "MasterCard", "Tabby", "Tamara"];
const selectedMethod = ref("");

function handleContinue() {
    console.log(selectedMethod.value);
}
</script>