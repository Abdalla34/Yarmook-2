<template>
  <ProfileLinksBar />
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="container mx-auto max-w-5xl px-4">
      <button @click="navigateTo('/my-cars')" class="mb-4 text-sm text-gray-500 hover:text-gray-700">&larr; Back to My Cars</button>

      <div v-if="loading" class="animate-pulse space-y-4">
        <div class="h-8 w-48 rounded bg-gray-200" />
        <div class="h-64 rounded-3xl bg-gray-200" />
      </div>

      <div v-else-if="car" class="space-y-6">
        <!-- Car Info Card -->
        <h1 class="text-2xl font-bold text-gray-800">{{ car.name }}</h1>
        <div class="rounded-3xl bg-white p-6 shadow-sm">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <img :src="car.image || 'https://via.placeholder.com/120'" class="h-28 w-28 rounded-2xl object-cover shrink-0" />
            <div>
              <h2 class="text-xl font-semibold">{{ car.brand?.title }} - {{ car.car_type?.title }}</h2>
              <p v-if="car.plate_number" class="text-gray-500">{{ car.plate_number }}</p>
              <span v-if="car.is_default" class="mt-1 inline-block rounded-full bg-yellow-400 px-3 py-1 text-xs font-medium">Default</span>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div v-for="(val, key) in details" :key="key" class="rounded-xl bg-gray-50 p-3">
              <p class="text-gray-500 capitalize">{{ key.replace(/_/g, ' ') }}</p>
              <p class="font-semibold truncate">{{ val ?? '—' }}</p>
            </div>
          </div>
        </div>

        <!-- Latest Orders -->
        <div v-if="orders.length" class="rounded-3xl bg-white p-6 shadow-sm">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Latest Orders</h2>
          <div class="space-y-3">
            <div v-for="order in orders" :key="order.id"
              class="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div>
                  <p class="text-gray-500 text-xs">Order #</p>
                  <p class="font-semibold">{{ order.order_num || order.id }}</p>
                </div>
                <div>
                  <p class="text-gray-500 text-xs">Type</p>
                  <p class="font-semibold capitalize">{{ order.type_for_customer || order.type || '—' }}</p>
                </div>
                <div>
                  <p class="text-gray-500 text-xs">Status</p>
                  <span class="inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-0.5"
                    :class="statusClass(order.status)">
                    {{ order.status_value || order.status }}
                  </span>
                </div>
                <div>
                  <p class="text-gray-500 text-xs">Amount</p>
                  <p class="font-semibold">{{ order.total_amount ?? '—' }} SAR</p>
                </div>
                <div>
                  <p class="text-gray-500 text-xs">Vendor</p>
                  <p class="font-semibold">{{ order.vendor_name || '—' }}</p>
                </div>
                <div>
                  <p class="text-gray-500 text-xs">Date</p>
                  <p class="font-semibold">{{ order.created_at || '—' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Orders Amount (full width, at bottom) -->
        <div v-if="totalAmount" class="rounded-3xl bg-white p-6 shadow-sm border-t-4 border-yellow-400">
          <div class="flex items-center justify-between">
            <p class="text-gray-600 font-medium">Total Orders Amount</p>
            <p class="text-2xl font-bold text-gray-800">{{ totalAmount }} <span class="text-sm font-normal text-gray-500">SAR</span></p>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-gray-400 py-20">Car not found</div>
    </div>
  </div>
</template>

<script setup>
const { getUserCarId } = useCarServices();
const route = useRoute();

const car = ref(null);
const loading = ref(true);
const orders = ref([]);
const totalAmount = ref(null);

const EXCLUDED_KEYS = ["id", "brand", "car_type", "image", "name", "is_default", "plate_number", "latest_orders", "latest_order", "orders", "total_orders_amount", "alerts"];

const details = computed(() => {
  const d = car.value;
  if (!d) return {};
  return Object.fromEntries(
    Object.entries(d).filter(([k]) => !EXCLUDED_KEYS.includes(k))
  );
});

function statusClass(status) {
  if (!status) return 'bg-gray-100 text-gray-600';
  const s = status.toLowerCase();
  if (s === 'completed' || s === 'paid') return 'bg-green-100 text-green-700';
  if (s === 'cancelled' || s === 'failed') return 'bg-red-100 text-red-700';
  return 'bg-yellow-100 text-yellow-700';
}

onMounted(async () => {
  try {
    const res = await getUserCarId(route.params.id);
    const raw = res?.data ?? res;
    const data = Array.isArray(raw) ? raw[0] : raw;
    car.value = data;

    if (Array.isArray(data?.latest_orders)) {
      orders.value = data.latest_orders;
    } else if (data?.latest_order) {
      orders.value = [data.latest_order, ...(Array.isArray(data?.orders) ? data.orders : [])];
    } else if (Array.isArray(data?.orders)) {
      orders.value = data.orders;
    }

    totalAmount.value = data?.total_orders_amount ?? null;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
