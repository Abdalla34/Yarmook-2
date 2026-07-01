<template>
    <div class="min-h-screen bg-gray-50 py-10 mt-2">
        <div v-if="isLoggedIn" class="container mx-auto px-4">
            <h1 class="mb-8 text-2xl font-bold text-gray-800 text-center">
                My Orders
            </h1>

            <div v-if="loading" class="text-center py-12">
                <div
                    class="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto">
                </div>
                <p class="mt-4 text-gray-600">Loading orders...</p>
            </div>

            <div v-else-if="error" class="text-center py-12">
                <p class="text-red-500">{{ error }}</p>
                <button @click="fetchOrders"
                    class="mt-4 px-6 py-2 bg-main-color rounded-lg font-medium hover:opacity-90 transition">
                    Retry
                </button>
            </div>

            <div v-else-if="!orders.length" class="text-center py-12">
                <p class="text-gray-500 text-lg">No orders found.</p>
                <NuxtLink to="/services"
                    class="inline-block mt-4 px-6 py-2 bg-yellow-400 rounded-full font-semibold hover:bg-yellow-500 transition">
                    Browse Services
                </NuxtLink>
            </div>

            <div v-else class="max-w-3xl mx-auto">
                <div v-if="alerts.length" class="mb-4 space-y-2">
                    <div v-for="(alert, i) in alerts" :key="i"
                        class="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 flex items-start gap-2">
                        <span class="mt-0.5 shrink-0">&#9888;</span>
                        <span>{{ alert.title ?? alert.message ?? alert }}</span>
                    </div>
                </div>

                <div v-if="latestOrder" class="mb-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                    <p class="text-xs font-semibold text-yellow-700 uppercase mb-1">Latest Order</p>
                    <p class="font-semibold text-gray-800">Order #{{ latestOrder.id }} — {{ latestOrder.status }}</p>
                    <p v-if="latestOrder.created_at" class="text-xs text-gray-500 mt-1">{{ latestOrder.created_at }}</p>
                </div>

                <div class="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide snap-x">
                    <button @click="activeFilter = 'all'"
                        class="shrink-0 snap-start px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
                        :class="activeFilter === 'all' ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'">
                        All
                    </button>
                    <button v-for="type in orderTypes" :key="type" @click="activeFilter = type"
                        class="shrink-0 snap-start px-5 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300"
                        :class="activeFilter === type ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'">
                        {{ type }}
                    </button>
                </div>

                <div v-if="!filteredOrders.length" class="text-center py-12">
                    <p class="text-gray-500 text-lg">No {{ activeFilter === 'all' ? '' : activeFilter }} orders found.
                    </p>
                </div>

                <div class="space-y-4">
                    <div v-for="order in filteredOrders" :key="order.id" @click="navigateTo(`/singleorderdetailsid/${order.id}`)"
                        class="bg-white rounded-2xl shadow-md p-5 border border-gray-100 cursor-pointer hover:shadow-lg hover:border-yellow-300 transition-all duration-300">
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-sm text-gray-500 flex items-center gap-2">
                                <StatusIconOrder :status="order.status" />
                                Order #{{ order.id }}
                                <span v-if="order.type"
                                    class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 capitalize">
                                    {{ order.type }}
                                </span>
                            </span>
                            <span class="text-xs font-medium px-3 py-1 rounded-full capitalize"
                                :class="statusClass(order.status)">
                                {{ order.status }}
                            </span>
                        </div>
                        <div class="text-sm text-gray-600 space-y-1">
                            <p v-if="order.created_at" class="text-gray-400">Date: {{ order.created_at }}</p>
                            <p v-if="order.total_amount">Total: {{ order.total_amount }} SAR</p>
                        </div>
                        <div v-if="order.items?.length" class="mt-3 space-y-2">
                            <div v-for="item in order.items" :key="item.id"
                                class="flex items-center gap-3 text-sm text-gray-600 border-t pt-2">
                                <img v-if="item.image" :src="item.image" class="w-10 h-10 object-contain rounded"
                                    alt="">
                                <span class="flex-1 truncate">{{ item.title || item.name }}</span>
                                <span class="shrink-0">{{ item.price }} SAR</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="container mx-auto px-4 text-center py-12">
            <p class="text-gray-600 mb-4">Please create an account to view your orders.</p>
            <button @click="navigateTo('/create-account')"
                class="bg-main-color text-black px-8 py-3 rounded-full font-medium hover:opacity-90 transition">
                Create Account
            </button>
        </div>
    </div>

</template>

<script setup>
const token = useCookie("token");
const isLoggedIn = computed(() => !!token.value);
const { getOrdersAll } = useGlobalApi();

const orders = ref([]);
const loading = ref(true);
const error = ref("");
const activeFilter = ref("all");

const orderTypes = computed(() => {
    const values = new Set();
    orders.value.forEach((o) => {
        if (o?.status) values.add(o.status);
        if (o?.type) values.add(o.type);
    });
    return [...values];
});

const filteredOrders = computed(() => {
    if (activeFilter.value === "all") return orders.value;
    return orders.value.filter((o) => o?.status === activeFilter.value || o?.type === activeFilter.value);
});

function statusClass(status) {
  if (!status) return 'bg-gray-100 text-gray-600';
  const s = status.toLowerCase();
  if (s === 'completed' || s === 'paid' || s === 'booking_done') return 'bg-green-100 text-green-700';
  if (s === 'cancelled' || s === 'canceled' || s === 'failed' || s === 'refunded') return 'bg-red-100 text-red-700';
  if (s === 'our_date') return 'bg-blue-100 text-blue-700';
  if (s === 'booking_now' || s === 'urgent') return 'bg-orange-100 text-orange-700';
  if (s === 'pending') return 'bg-yellow-100 text-yellow-700';
  if (s === 'confirmed') return 'bg-indigo-100 text-indigo-700';
  if (s === 'processing' || s === 'in_progress') return 'bg-cyan-100 text-cyan-700';
  return 'bg-gray-100 text-gray-600';
}

const latestOrder = ref(null);
const alerts = ref([]);

onMounted(fetchOrders);

async function fetchOrders() {
    loading.value = true;
    error.value = "";
    try {
        const res = await getOrdersAll();
        const data = res?.data ?? res;

        if (data?.latest_order) {
            latestOrder.value = data.latest_order;
            orders.value = [data.latest_order, ...(Array.isArray(data?.orders ?? data?.items) ? (data.orders ?? data.items) : [])];
        } else {
            orders.value = data?.items ?? data?.data ?? (Array.isArray(data) ? data : []);
        }

        if (data?.alerts) {
            alerts.value = Array.isArray(data.alerts) ? data.alerts : [data.alerts];
        }
    } catch (err) {
        error.value = err?.data?.message || err?.message || "Failed to load orders.";
        console.error("Failed to load orders:", err);
    } finally {
        loading.value = false;
    }
}
</script>