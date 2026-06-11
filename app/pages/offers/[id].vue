<template>
  <div class="offer-detail-page min-h-screen py-8">
    <div class="container mx-auto px-4 max-w-2xl">
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

      <div v-if="loading" class="space-y-4">
        <div class="rounded-2xl overflow-hidden animate-pulse">
          <div class="h-56 md:h-72 bg-gray-200"></div>
        </div>
        <div class="bg-white rounded-2xl shadow-md p-4 md:p-6 space-y-4 animate-pulse">
          <div class="h-6 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          <div class="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>

      <template v-else-if="offer">
        <!-- Image only -->
        <div class="relative rounded-2xl overflow-hidden shadow-md mb-4">
          <img
            v-if="displayImage"
            :src="displayImage"
            :alt="offer.title"
            class="w-full h-56 md:h-72"
            :class="offer.image ? 'object-cover' : 'object-contain bg-gray-50 p-8'"
          />
          <div v-else class="w-full h-56 md:h-72 bg-gray-100 flex items-center justify-center text-gray-400">
            No image
          </div>
          <span
            v-if="offer.discount_percentage_text"
            class="absolute top-3 right-3 bg-red-500 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full"
          >
            {{ offer.discount_percentage_text }}
          </span>
        </div>

        <!-- Details below -->
        <div class="bg-white rounded-2xl shadow-md p-4 md:p-6">
          <div v-if="offer.logo && offer.image" class="flex items-center gap-3 mb-4">
            <img
              :src="offer.logo"
              alt=""
              class="w-12 h-12 rounded-full border-2 border-gray-100 object-cover"
            />
          </div>

          <h1 class="text-lg md:text-2xl font-bold text-gray-800 mb-3">{{ offer.title }}</h1>

          <p v-if="offer.description" class="text-sm md:text-base text-gray-600 mb-4 whitespace-pre-line">
            {{ offer.description }}
          </p>

          <div class="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <span class="text-2xl md:text-3xl font-bold text-black">
              {{ offer.price_after_discount }}
              <span class="text-gray-400 uppercase text-sm">sar</span>
            </span>
            <span
              v-if="offer.price_before_discount"
              class="text-base md:text-lg text-gray-400 line-through"
            >
              {{ offer.price_before_discount }} sar
            </span>
          </div>

          <div v-if="offer.benefits" class="mb-4">
            <h2 class="text-sm font-bold text-gray-800 mb-2">Benefits</h2>
            <div class="text-sm text-gray-600 offer-benefits" v-html="offer.benefits" />
          </div>

          <p
            v-if="offer.show_expiration && offer.expires_at"
            class="text-sm text-red-500 font-medium"
          >
            Expires: {{ offer.expires_at }}
          </p>
        </div>
      </template>

      <p v-else class="text-center text-gray-500 py-10">Offer not found.</p>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const { getOfferById } = useGlobalApi();

const offer = ref(null);
const loading = ref(true);

const displayImage = computed(() => offer.value?.image || offer.value?.logo || null);

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
