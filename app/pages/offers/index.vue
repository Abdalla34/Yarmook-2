<template>
  <div class="offers-page min-h-screen py-8">
    <div class="container mx-auto px-4">
      <div class="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h1 class="text-2xl font-bold mb-6">Offers</h1>

        <div v-if="loading" class="grid grid-cols-2 gap-4">
        <div v-for="n in 4" :key="n"
          class="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
          <div class="h-32 bg-gray-200"></div>
          <div class="p-3 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <div v-else-if="offers.length" class="grid grid-cols-2 gap-4">
        <NuxtLink v-for="offer in offers" :key="offer.id" :to="`/offers/${offer.id}`"
          class="block bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer p-3">
          <div class="relative">
            <img v-if="offer.image" :src="offer.image" :alt="offer.title"
              class="w-full h-32 md:h-[40%] object-cover rounded-md"  @error="$event.target.src = '/offerimage.jpeg'"/>
            <span v-if="offer.discount_percentage_text"
              class="absolute top-2 right-2 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full">
              {{ offer.discount_percentage_text }}
            </span>
          </div>
          <div class="p-2 md:p-4">
            <h2 class="text-xs md:text-sm font-bold text-gray-800 mb-1 md:mb-2 line-clamp-2">{{ offer.title }}</h2>
            <p v-if="offer.description"
              class="hidden md:block text-xs text-gray-500 mb-3 line-clamp-3 whitespace-pre-line">
              {{ offer.description }}
            </p>
            <div class="flex flex-col gap-0.5 md:flex-row md:items-center md:gap-2 md:mb-3">
              <span class="text-sm md:text-lg font-bold text-black">
                {{ offer.price_after_discount }}
                <span class="text-gray-400 uppercase text-[10px] md:text-xs">sar</span>
              </span>
              <span v-if="offer.price_before_discount"
                class="text-xs md:text-sm text-gray-400 line-through">
                {{ offer.price_before_discount }} sar
              </span>
            </div>
            <div v-if="offer.benefits"
              class="hidden md:block text-xs text-gray-600 mb-3 offer-benefits" v-html="offer.benefits" />
            <p v-if="offer.show_expiration && offer.expires_at"
              class="hidden md:block text-xs text-red-500 font-medium">
              Expires: {{ offer.expires_at }}
            </p>
          </div>
        </NuxtLink>
      </div>

      <p v-else class="text-center text-gray-500 py-10">No offers available.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const { getOffers } = useGlobalApi();

const offers = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await getOffers();
    offers.value = response?.data?.items ?? response?.data ?? [];
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
