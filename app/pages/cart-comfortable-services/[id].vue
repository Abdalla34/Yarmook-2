<template>
    <div class="cart-page mt-0 lg:mt-3 min-h-screen py-8">
        <div class="min-h-screen">
            <div class="mx-auto max-w-6xl px-4">
                <div v-if="loading" class="flex justify-center py-20">
                    <div class="w-10 h-10 border-4 border-gray-200 border-t-yellow-400 rounded-full animate-spin"></div>
                </div>

                <div v-else-if="error" class="text-center py-20">
                    <p class="text-red-500 text-lg">{{ error }}</p>
                </div>

                <div v-else-if="order" class="grid gap-6 lg:grid-cols-3 new-style">
                    <!-- Left Side -->
                    <div class="lg:col-span-2 min-w-0">
                        <h2 class="mb-6 text-xl font-semibold text-gray-800">
                            Order Details
                        </h2>

                        <div class="space-y-2">
                            <div
                                class="bg-white p-4 sm:p-5 shadow-md rounded-3xl">
                                <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                    <div class="flex items-center gap-4 flex-1 min-w-0">
                                        <img src="/Carcomfortable.png" class="h-14 w-14 object-contain shrink-0" alt="" /> 

                                        <div class="min-w-0 flex gap-2">
                                            <h4 class="item-name">{{ order?.brand?.title }} - </h4>
                                            <p class="car-type">{{ order?.car_type?.title }}</p>
                                        </div>
                                    </div>

                                    <!-- <div class="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                                        <div class="flex items-center gap-1 border rounded-lg px-2 py-1">
                                            <button @click="updateQty(item.id, item.qty - 1)"
                                                class="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black transition text-lg leading-none">
                                                -
                                            </button>

                                            <span class="text-sm text-gray-500 min-w-[20px] text-center">
                                                {{ item.qty }}
                                            </span>

                                            <button @click="updateQty(item.id, item.qty + 1)"
                                                class="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black transition text-lg leading-none">
                                                +
                                            </button>
                                        </div>

                                        <button @click="removeItem(item.id)"
                                            class="text-red-500 hover:text-red-700 transition text-xl leading-none flex items-center justify-center w-6 h-6">
                                            &times;
                                        </button>
                                    </div> -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Side -->
                    <div>
                        <div class="rounded-3xl bg-white p-6 shadow-md box-design">
                            <h2 class="mb-4 text-lg font-semibold">
                                wench Details
                            </h2>

                            <div class="space-y-3 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-500">branch</span>
                                    <span>{{ order?.branch?.title  }}</span>
                                </div>

                                <div class="flex justify-between">
                                    <span class="text-gray-500">tybe_delivery</span>
                                    <span>{{ order?.delivery_direction }}</span>
                                </div>

                                <div class="flex justify-between">
                                    <span class="text-gray-500">created_at</span>
                                    <span>{{ order.created_at }}</span>
                                </div>
                            </div>

                            <hr class="my-6" />

                            <div class="mt-4 flex items-center justify-between rounded-xl bg-green-50 px-4 py-3">
                                <span class="font-semibold text-gray-700">
                                    Total Amount
                                </span>

                                <div>
                                    <span class="text-2xl font-bold">{{ order.total_amount }}</span>
                                    <span class="text-xs text-gray-400">SAR</span>
                                </div>
                            </div>

                            <div class="mt-6">
                                <button @click="continueOrder"
                                    class="w-full rounded-full bg-yellow-400 py-4 font-medium text-black transition hover:bg-yellow-500">
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const route = useRoute();
const { getWenchInCart } = useWenchServices();

const order = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchOrder = async () => {
    loading.value = true;
    error.value = null;
    try {
        const res = await getWenchInCart(route.params.id);
        order.value = res?.data ?? res;
    } catch (err) {
        error.value = err?.data?.message || err?.message || 'Failed to load order';
    } finally {
        loading.value = false;
    }
};



const continueOrder = () => {
    navigateTo(`/payment?order_id=${route.params.id}`)
};

onMounted(fetchOrder);
</script>