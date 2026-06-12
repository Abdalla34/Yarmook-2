<template>
  <div class="cart-page mt-0 lg:mt-3 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold mb-6">My Cart</h1>

      <div v-if="loading" class="space-y-4">
        <div v-for="n in 3" :key="n"
          class="bg-white rounded-2xl shadow-md p-4 animate-pulse flex items-center gap-4">
          <div class="w-20 h-20 bg-gray-200 rounded-lg shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-5 w-3/4 bg-gray-200 rounded"></div>
            <div class="h-4 w-1/4 bg-gray-200 rounded"></div>
          </div>
          <div class="h-9 w-24 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500">{{ error }}</p>
        <button @click="fetchCart"
          class="mt-4 px-6 py-2 bg-main-color rounded-lg font-medium hover:opacity-90 transition">
          Retry
        </button>
      </div>

      <div v-else-if="!cartItems.length" class="text-center py-12">
        <p class="text-gray-500 text-lg">Your cart is empty</p>
        <NuxtLink to="/services"
          class="inline-block mt-4 px-6 py-2 bg-main-color rounded-lg font-medium hover:opacity-90 transition">
          Browse Services
        </NuxtLink>
      </div>

      <div v-else class="space-y-4">
        <div v-for="item in cartItems" :key="item.id"
          class="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
          <img :src="item.image" class="w-20 h-20 object-cover rounded-lg shrink-0" alt="">
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-gray-800 truncate">{{ item.title }}</h3>
            <p class="text-sm text-gray-500 mt-1 capitalize">{{ item.type }}</p>
            <p class="text-lg font-semibold text-black-600 mt-1">{{ item.price ?? item.price_after_discount }} <span class="text-gray-400 uppercase text-sm">sar</span></p>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <span class="text-sm text-gray-500">Qty: {{ item.qty ?? item.quantity ?? 1 }}</span>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-md p-4 flex items-center justify-between">
          <span class="text-lg font-bold">Total</span>
          <span class="text-xl font-bold text-black-600">{{ cartTotal }} <span class="text-gray-400 uppercase text-sm">sar</span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { getMyCart } = useAddToCart();

const cartItems = ref([]);
const cartTotal = ref("0");
const loading = ref(true);
const error = ref("");

async function fetchCart() {
  loading.value = true;
  error.value = "";
  try {
    const res = await getMyCart();
    const data = res?.data ?? {};

    const services = (data.services ?? []).map((item) => ({ ...item, type: "service" }));
    const offers = (data.offers ?? []).map((item) => ({ ...item, type: "offer" }));
    const spareParts = (data.spare_parts ?? []).map((item) => ({ ...item, type: "spare_part" }));

    cartItems.value = [...services, ...offers, ...spareParts];
    cartTotal.value = data.total_amount ?? "0";
  } catch (err) {
    error.value = "Failed to load cart";
    console.error(err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchCart);
</script>
