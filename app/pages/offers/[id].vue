<template>
  <div class="offer-detail-page min-h-screen py-8">
    <div class="container mx-auto px-4 max-w-lg">
      <button
        type="button"
        class="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6 transition-colors"
        @click="navigateTo('/offers')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Offers
      </button>

      <div v-if="loading" class="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
        <div class="h-40 bg-gray-200"></div>
        <div class="p-4 space-y-3">
          <div class="h-5 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>

      <div v-else-if="offer" class="bg-white rounded-2xl shadow-md overflow-hidden">
        <div class="relative">
          <img
            v-if="offer.image"
            :src="offer.image"
            :alt="offer.title"
            class="w-full h-40 object-cover"
          />
          <span
            v-if="offer.discount_percentage_text"
            class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
          >
            {{ offer.discount_percentage_text }}
          </span>
          <img
            v-if="offer.logo"
            :src="offer.logo"
            alt=""
            class="absolute bottom-2 left-2 w-10 h-10 rounded-full border-2 border-white object-cover"
          />
        </div>
        <div class="p-4">
          <h1 class="text-sm font-bold text-gray-800 mb-2">{{ offer.title }}</h1>
          <p v-if="offer.description" class="text-xs text-gray-500 mb-3 whitespace-pre-line">
            {{ offer.description }}
          </p>
          <div class="flex items-center gap-2 mb-3">
            <span class="text-lg font-bold text-black">
              {{ offer.price_after_discount }}
              <span class="text-gray-400 uppercase text-xs">sar</span>
            </span>
            <span v-if="offer.price_before_discount" class="text-sm text-gray-400 line-through">
              {{ offer.price_before_discount }} sar
            </span>
          </div>
          <div
            v-if="offer.benefits"
            class="text-xs text-gray-600 mb-3 offer-benefits"
            v-html="offer.benefits"
          />
          <p v-if="offer.show_expiration && offer.expires_at" class="text-xs text-red-500 font-medium">
            Expires: {{ offer.expires_at }}
          </p>
        </div>
      </div>

      <p v-else class="text-center text-gray-500 py-10">Offer not found.</p>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const { getOfferById } = useGlobalApi();

const offer = ref(null);
const loading = ref(true);

async function fetchOffer(id) {
  loading.value = true;
  offer.value = null;
  try {
    const response = await getOfferById(id);
    offer.value = response?.data?.offer ?? response?.data ?? null;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

watch(
  () => route.params.id,
  (id) => {
    if (id) fetchOffer(id);
  },
  { immediate: true }
);
</script>
