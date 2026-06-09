<template>
  <div class="services-page mt-0 lg:mt-3 min-h-screen  py-8">
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
        <div v-for="service in carServices" :key="service.id"
          class="bg-white flex flex-col items-center rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <img :src="service.image" class="max-w-[100px]" alt="">
          <h2 class="text-xl font-bold text-gray-800 mb-2">{{ service.title }}</h2>
          <!-- <p class="text-gray-500 text-sm mb-3">{{ service.description }}</p> -->
          <div class="flex items-center justify-between w-full">
            <span class="text-lg font-semibold text-black-600">{{ service.price }} <span class="text-gray-400 uppercase text-sm">sar</span></span>
            <button @click="addServiceToCart(service)"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="service.in_cart ? 'bg-white text-black border rounded-lg' : 'bg-main-color text-black hover:bg-yellow-200'">
              {{ service.in_cart ? 'Added to Cart' : 'Add to Cart' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { getServices } = useCarServices();
const { addCart } = useAddToCart();

const carServices = ref([]);
const loading = ref(true);

async function addServiceToCart(service) {
  if (service.in_cart) return;
  try {
    await addCart("service", service.id, 1);
    service.in_cart = true;
  } catch (err) {
    console.error("Failed to add to cart", err);
  }
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
