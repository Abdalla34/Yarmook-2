<template>
  <div class="min-h-screen bg-gray-100 py-4 md:py-10">
    <div class="max-w-5xl mx-auto px-2 md:px-4">

      <button @click="navigateTo('/my-orders')"
        class="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Back to Orders
      </button>

      <div v-if="loading" class="text-center py-20">
        <div class="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading order details...</p>
      </div>

      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-500">{{ error }}</p>
        <button @click="fetchOrder"
          class="mt-4 px-6 py-2 bg-yellow-400 rounded-full font-semibold hover:bg-yellow-500 transition">Retry</button>
      </div>

      <div v-else-if="order" class="bg-white rounded-3xl p-4 md:p-8 shadow">

        <!-- Header -->
        <div class="flex flex-wrap justify-between items-center gap-6">
          <div class="flex items-center gap-4">
            <img :src="allItems[0]?.image || 'https://via.placeholder.com/120'" class="w-24 h-24 object-contain image-serv"
              alt="" />

            <div>
              <h1 class="text-xl md:text-3xl font-bold capitalize">{{ order.type || 'Order' }}</h1>
              <p class="text-lg md:text-2xl font-semibold text-yellow-500">
                {{ order.total_amount || order.amount_to_pay || '0' }}
                <span class="uppercase text-base">SAR</span>
              </p>
            </div>
          </div>

          <span class="px-5 py-2 rounded-full font-medium capitalize"
            :class="order.status === 'completed' || order.status === 'paid' ? 'bg-green-100 text-green-600' : order.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'">
            {{ order.status === 'completed' || order.status === 'paid' ? 'Booking Done' : order.status === 'cancelled' ?
              'Cancelled' : 'Pending' }}
          </span>
        </div>

        <!-- Car Info -->
        <div class="grid md:grid-cols-2 gap-4 mt-8">

          <div class="border rounded-3xl p-3 md:p-5 flex justify-center align-center items-center gap-3 md:gap-4">
            <div>
              <p class="text-gray-500 text-sm md:text-base">Car Model</p>
              <p class="font-semibold text-sm md:text-base">{{ order?.brand?.title }} - {{ order?.car_type?.title }}</p>
            </div>
            <div class="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
              <icons-carIcon class="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>

          <div class="border rounded-3xl p-3 md:p-5 flex justify-center items-center gap-3 md:gap-4">
            <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2">
                <rect x="3" y="4" width="18" height="16" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round" />
                <line x1="16" y1="2" x2="16" y2="6" stroke-linecap="round" stroke-linejoin="round" />
                <line x1="8" y1="2" x2="8" y2="6" stroke-linecap="round" stroke-linejoin="round" />
                <line x1="3" y1="10" x2="21" y2="10" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>

            <div>
              <p class="text-gray-500 text-sm md:text-base">Order Number</p>
              <p class="font-semibold text-sm md:text-base">#{{ order.id }}</p>
            </div>
          </div>

        </div>

        <!-- Branch & Timer Row -->
        <div v-if="order.branch || order.created_at || order.reservation_date" class="grid md:grid-cols-2 gap-4 mt-6">

          <div v-if="order.branch" class="border rounded-3xl p-4 md:p-6 text-center cursor-pointer">
            <h4 class="font-semibold text-base md:text-lg">
              {{ order.branch?.title || order.branch }}
            </h4>

            <p class="text-red-500 mt-2">
              Show In Maps
            </p>
          </div>

          <div v-if="order.created_at" class="border rounded-3xl p-4 md:p-6 text-center">
            <icons-timerIcon class="w-6 h-6 md:w-8 md:h-8 mx-auto" />
            <h4 class="font-semibold text-sm md:text-lg mt-1">
              {{ rescheduled ? (newReservationDate + ' ' + newReservationTime) : (order.reservation_date || order.created_at) }}
            </h4>

            <p v-if="rescheduled" class="text-green-600 mt-2 font-medium cursor-pointer" @click="openReschedulePopup">
              Reservation time changed
            </p>
            <p v-else-if="order.can_reschedule" class="text-red-500 mt-2 cursor-pointer" @click="openReschedulePopup">
              Reschedule Order
            </p>
          </div>

        </div>

        <!-- Steps -->
        <!-- <div v-if="order.status" class="mt-10 overflow-x-auto">
          <div class="flex gap-6 min-w-max">

            <div v-for="(step, i) in statusSteps" :key="step.label" class="text-center">
              <div class="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                :class="step.completed ? 'bg-yellow-400' : 'bg-gray-200'">
                <svg v-if="step.completed" class="w-6 h-6 text-black" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="3">
                  <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span v-else class="text-sm font-bold text-gray-400">{{ i + 1 }}</span>
              </div>
              <p class="mt-2" :class="step.completed ? 'font-semibold' : 'text-gray-400'">{{ step.label }}</p>
            </div>

          </div>
        </div> -->

        <!-- Items -->
        <div v-if="allItems.length" class="mt-10  flex justify-between bg-gray-100 rounded-md px-2 items-center">

          <h3 class="text-xl font-semibold">
            Items ({{ allItems.length }})
          </h3>

          <button @click="showItemsPopup = true"
            class="bg-red-500 hover:bg-red-400 rounded-md px-4 py-2  text-sm text-white font-medium transition">
            More
          </button>

        </div>
        <hr>

        <!-- Subtotal & VAT -->
        <div class="mt-8 space-y-3">
          <div class="flex justify-between text-sm bg-gray-100 rounded-md p-1">
            <span class="text-gray-500">Subtotal</span>
            <span class="font-medium">{{ order.subtotal || (Number(order.total_amount || 0) - Number(order.vat_amount ||
              0)).toFixed(2) || '0' }} SAR</span>
          </div>
          <div v-if="order.vat_amount" class="flex justify-between text-sm bg-gray-100 rounded-md p-1">
            <span class="text-gray-500">VAT</span>
            <span class="font-medium">{{ order.vat_amount }} SAR</span>
          </div>
        </div>

        <!-- Total -->
        <div class="mt-4 flex justify-between items-center text-xl font-bold">
          <span>Total Amount</span>
          <span>{{ order.total_amount || order.amount_to_pay || '0' }} SAR</span>
        </div>

        <!-- Notes -->
        <div v-if="order.description || order.customer_note" class="mt-6 bg-gray-50 rounded-2xl p-4">
          <p class="text-sm text-gray-500">Notes</p>
          <p class="text-sm text-gray-800 mt-1">{{ order.description || order.customer_note }}</p>
        </div>

        <!-- Cancel -->
        <div v-if="order.can_cancel" class="mt-8">
          <button class="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-medium transition">
            Cancel Order
          </button>
        </div>

      </div>

      <!-- Reschedule Popup -->
      <div v-if="showReschedulePopup"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4"
        @click.self="showReschedulePopup = false">
        <div class="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-xl">
          <div
            class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
            <h3 class="text-lg font-bold">Available Times</h3>
            <button @click="showReschedulePopup = false"
              class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
          <div class="p-6 space-y-6 relative">
            <div v-if="rescheduling" class="absolute inset-0 bg-white/80 rounded-b-3xl flex items-center justify-center z-10">
              <div class="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div v-if="loadingTimes" class="text-center py-8">
              <div class="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p class="mt-3 text-gray-500 text-sm">Loading available times...</p>
            </div>
            <div v-else-if="timesError" class="text-center py-8">
              <p class="text-red-500 text-sm">{{ timesError }}</p>
            </div>
            <div v-else-if="availableDates.length">
              <div v-for="(dateItem, di) in availableDates" :key="di" class="mb-6">
                <h4 class="font-semibold text-gray-700 mb-3">{{ dateItem.date }}</h4>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div v-for="(slot, si) in dateItem.time_slots" :key="si"
                    class="border rounded-xl p-3 text-center cursor-pointer hover:border-yellow-400 transition"
                    @click="selectTime(dateItem.date, slot)">
                    <p class="font-medium text-sm">{{ slot.time }}</p>
                    <p class="text-xs text-gray-400">{{ slot.available_orders }} available</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <p class="text-gray-500">No available times found.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Items Popup -->
      <div v-if="showItemsPopup"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4"
        @click.self="showItemsPopup = false">
        <div class="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-xl">
          <div
            class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
            <h3 class="text-lg font-bold">All Items ({{ allItems.length }})</h3>
            <button @click="showItemsPopup = false"
              class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
          <div class="p-6 space-y-3">
            <div v-for="item in allItems" :key="item.id || item.item_id"
              class="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
              <img :src="item.image || 'https://via.placeholder.com/60'"
                class="w-16 h-16 rounded-xl object-contain bg-white" alt="" />
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-800 truncate">{{ item.title || item.name }}</p>
                <p class="text-xs text-gray-400">Qty: {{ item.qty ?? item.quantity ?? 1 }}</p>
                <p v-if="item.type" class="text-[10px] font-medium text-blue-600 capitalize mt-0.5">{{ item.type }}</p>
              </div>
              <span class="text-sm font-bold text-gray-800 shrink-0">{{ item.price ?? item.price_after_discount }}
                SAR</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const { getsingleOrder } = useGlobalApi();
const { getAvailableBranchesTime, resevationTime } = useordersDetails();

const order = ref(null);
const loading = ref(true);
const error = ref("");
const showItemsPopup = ref(false);
const showReschedulePopup = ref(false);
const availableDates = ref([]);
const loadingTimes = ref(false);
const timesError = ref("");
const rescheduled = ref(false);
const rescheduling = ref(false);
const newReservationDate = ref("");
const newReservationTime = ref("");

const orderId = route.params.id;

const statusSteps = computed(() => {
  const status = order.value?.status;
  const steps = [
    { label: 'Requested', key: 'requested' },
    { label: 'Booked', key: 'booked' },
    { label: 'Inspection', key: 'inspection' },
    { label: 'Report', key: 'report' },
    { label: 'Car Fine', key: 'car_fine' },
    { label: 'Maintenance', key: 'maintenance' },
    { label: 'Ready', key: 'ready' },
    { label: 'Completed', key: 'completed' },
  ];
  const completedIndex = steps.findIndex(s => s.key === status || (status === 'paid' && s.key === 'completed'));
  steps.forEach((s, i) => {
    s.completed = i <= completedIndex;
  });
  return steps;
});

const allItems = computed(() => {
  if (!order.value) return [];
  const o = order.value;
  const items = o.items || [];
  const services = (o.services || []).map(i => ({ ...i, type: 'service' }));
  const offers = (o.offers || []).map(i => ({ ...i, type: 'offer' }));
  const spareParts = (o.spare_parts || []).map(i => ({ ...i, type: 'spare_part' }));
  return [...items, ...services, ...offers, ...spareParts];
});

onMounted(() => {
  const saved = localStorage.getItem(`reschedule_${orderId}`);
  if (saved) {
    try {
      const { date, time } = JSON.parse(saved);
      newReservationDate.value = date;
      newReservationTime.value = time;
      rescheduled.value = true;
    } catch {}
  }
  fetchOrder();
});

async function fetchOrder() {
  loading.value = true;
  error.value = "";
  try {
    const res = await getsingleOrder(orderId);
    order.value = res?.data ?? res;
  } catch (err) {
    error.value = err?.data?.message || err?.message || "Failed to load order details.";
    console.error("Failed to load order:", err);
  } finally {
    loading.value = false;
  }
}

async function openReschedulePopup() {
  const branchId = order.value?.branch?.id;
  const type = order.value?.type;
  if (!branchId || !type) return;

  showReschedulePopup.value = true;
  loadingTimes.value = true;
  timesError.value = "";
  availableDates.value = [];

  try {
    const res = await getAvailableBranchesTime(branchId, type);
    console.log("API response:", res);
    if (Array.isArray(res)) {
      availableDates.value = res;
    } else if (res?.dates?.available_times) {
      availableDates.value = res.dates.available_times;
    } else if (res?.data?.dates?.available_times) {
      availableDates.value = res.data.dates.available_times;
    } else if (res?.data && Array.isArray(res.data)) {
      availableDates.value = res.data;
    } else if (res?.time_slots) {
      availableDates.value = [res];
    } else if (res?.data?.time_slots) {
      availableDates.value = [res.data];
    } else if (typeof res === 'object' && res !== null) {
      const found = Object.values(res).find(v => Array.isArray(v) && v.length && v[0]?.time_slots);
      availableDates.value = found ?? Object.values(res).find(v => Array.isArray(v) && v.length && v[0]?.date) ?? [];
    } else {
      availableDates.value = [];
    }
  } catch (err) {
    timesError.value = err?.data?.message || err?.message || "Failed to load times.";
    console.error("Failed to load times:", err);
  } finally {
    loadingTimes.value = false;
  }
}

async function selectTime(date, slot) {
  const time = slot.time || slot;
  rescheduling.value = true;
  try {
    await resevationTime(orderId, date, time);
    newReservationDate.value = date;
    newReservationTime.value = time;
    rescheduled.value = true;
    localStorage.setItem(`reschedule_${orderId}`, JSON.stringify({ date, time }));
    showReschedulePopup.value = false;
  } catch (err) {
    console.error("Failed to reschedule:", err);
  } finally {
    rescheduling.value = false;
  }
}
</script>

<style scoped>
.image-serv {
    border-radius: 16px;
    background: #f7f9f9;
    padding: 8px;
}
</style>