<template>
  <div class="spare-parts-page mt-0 lg:mt-3 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n"
          class="bg-white flex flex-col items-center rounded-2xl shadow-md p-6 animate-pulse">
          <div class="w-[100px] h-[100px] bg-gray-200 rounded-lg mb-4"></div>
          <div class="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div class="flex items-center justify-between w-full">
            <div class="h-6 w-24 bg-gray-200 rounded"></div>
            <div class="h-9 w-28 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="item in spareParts" :key="item.id"
          class="bg-white flex flex-col items-center rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <img :src="item.image" class="max-w-[100px]" alt="">
          <h2 class="text-xl font-bold text-gray-800 mb-2">{{ item.title }}</h2>
          <div class="flex items-center justify-between w-full">
            <span class="text-lg font-semibold text-black-600">{{ item.price }} <span class="text-gray-400 uppercase text-sm">sar</span></span>
            <button @click="addToCart(item)" :disabled="loadingId === item.id"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              :class="item.in_cart ? 'bg-white text-black border rounded-lg' : 'bg-main-color text-black hover:bg-yellow-200'">
              <span v-if="loadingId === item.id"
                class="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              {{ item.in_cart ? 'Added to Cart' : (loadingId === item.id ? 'Adding...' : 'Add to Cart') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <AuthCartModal
      :show="showAuthModal"
      :type="pendingItem?.type"
      :item-id="pendingItem?.itemId"
      :qty="pendingItem?.qty"
      @close="showAuthModal = false"
      @success="handleAuthSuccess"
    />
  </div>
</template>

<script setup>
const { getSpareParts, token } = useGlobalApi();
const { addCart } = useAddToCart();

const spareParts = ref([]);
const loading = ref(true);
const showAuthModal = ref(false);
const pendingItem = ref(null);
const loadingId = ref(null);

async function addToCart(item) {
  if (item.in_cart || loadingId.value === item.id) return;

  if (!token.value) {
    pendingItem.value = { type: "spare_part", itemId: item.id, qty: 1 };
    showAuthModal.value = true;
    return;
  }

  loadingId.value = item.id;
  try {
    await addCart("spare_part", item.id, 1);
    item.in_cart = true;
  } catch (err) {
    console.error("Failed to add to cart", err);
  } finally {
    loadingId.value = null;
  }
}

function handleAuthSuccess() {
  showAuthModal.value = false;
  const item = spareParts.value.find((s) => s.id === pendingItem.value?.itemId);
  if (item) item.in_cart = true;
  pendingItem.value = null;
}

onMounted(async () => {
  try {
    const response = await getSpareParts();
    spareParts.value = Array.isArray(response) ? response?.data?.items : (response.data?.items ?? []);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
