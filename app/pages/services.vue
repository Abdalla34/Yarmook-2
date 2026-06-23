<template>
  <div class="services-page mt-0 lg:mt-3 min-h-screen  py-8">
    <div class="container mx-auto px-4">
      <div v-if="loading" class="flex flex-col gap-4">
        <div v-for="n in 4" :key="n"
          class="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-gray-200 rounded-xl shrink-0"></div>
            <div class="flex-1 space-y-2">
              <div class="h-5 w-40 bg-gray-200 rounded"></div>
              <div class="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
            <div class="w-14 h-14 bg-gray-200 rounded-xl shrink-0"></div>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col gap-4">
        <div v-for="service in carServices" :key="service.id"
          class="bg-white rounded-2xl border border-gray-200 p-4 transition-shadow hover:shadow-sm">
          <div class="flex items-center gap-4">
            <button @click="addServiceToCart(service)" :disabled="loadingServiceId === service.id"
              class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50 transition"
              :class="service.in_cart ? 'bg-green-200' : 'bg-main-color'">
              <svg v-if="service.in_cart" class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <div class="flex-1 min-w-0">
              <h2 class="text-base font-semibold text-gray-800 truncate">{{ service.title }}</h2>
              <span class="text-sm font-semibold text-red-500">{{ service.price }} <span class="text-gray-400 uppercase text-xs">sar</span></span>
            </div>
            <img :src="service.image" class="w-14 h-14 object-contain rounded-xl shrink-0 bg-gray-50" alt="">
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
const { getServices } = useCarServices();
const { addCart } = useAddToCart();
const { token } = useGlobalApi();

const carServices = ref([]);
const loading = ref(true);
const showAuthModal = ref(false);
const pendingItem = ref(null);
const loadingServiceId = ref(null);

async function addServiceToCart(service) {
  if (service.in_cart || loadingServiceId.value === service.id) return;

  if (!token.value) {
    pendingItem.value = { type: "service", itemId: service.id, qty: 1 };
    showAuthModal.value = true;
    return;
  }

  loadingServiceId.value = service.id;
  try {
    await addCart("service", service.id, 1);
    service.in_cart = true;
  } catch (err) {
    console.error("Failed to add to cart", err);
  } finally {
    loadingServiceId.value = null;
  }
}

function handleAuthSuccess() {
  showAuthModal.value = false;
  const service = carServices.value.find((s) => s.id === pendingItem.value?.itemId);
  if (service) service.in_cart = true;
  pendingItem.value = null;
}

onMounted(async () => {
  try {
    const response = await getServices();
    carServices.value = Array.isArray(response) ? response?.data?.items : (response.data?.items ?? []);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
