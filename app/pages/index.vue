<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const { getHome, getOffers } = useGlobalApi();

const HOME_CACHE_KEY = "home_cache";
const OFFERS_CACHE_KEY = "offers_cache";

const homeData = ref(null);
const offersData = ref(null);

const sliders = computed(() => homeData.value?.data?.sliders ?? []);
const offers = computed(() => offersData.value?.data?.items ?? offersData.value?.data ?? []);

onMounted(async () => {
  if (import.meta.client) {
    const cachedHome = localStorage.getItem(HOME_CACHE_KEY);
    if (cachedHome) {
      try {
        homeData.value = JSON.parse(cachedHome);
      } catch (e) { /* ignore */ }
    }
    const cachedOffers = localStorage.getItem(OFFERS_CACHE_KEY);
    if (cachedOffers) {
      try {
        offersData.value = JSON.parse(cachedOffers);
      } catch (e) { /* ignore */ }
    }
  }

  try {
    const [homeRes, offersRes] = await Promise.all([getHome(), getOffers()]);
    if (import.meta.client) {
      localStorage.setItem(HOME_CACHE_KEY, JSON.stringify(homeRes));
      localStorage.setItem(OFFERS_CACHE_KEY, JSON.stringify(offersRes));
    }
    homeData.value = homeRes;
    offersData.value = offersRes;
  } catch (err) {
    console.error(err);
  }
});
</script>

<template>
    <div class="index-page mt-4">
        <div class="container mx-auto ">
            <!-- sliders home page -->
            <Swiper v-if="sliders.length" :modules="[Autoplay, Pagination]" :loop="true" :autoplay="{ delay: 2000 }"
                :pagination="{ clickable: true }"
                class="home-slider w-[90%] md:w-[100%] lg:w-[90%] border-4 border-white rounded-lg overflow-hidden">
                <SwiperSlide v-for="(slide, i) in sliders" :key="i">
                    <img v-if="slide.image" :src="slide.image" :alt="slide.title ?? 'slider'"
                        class="w-full h-[120px] md:h-[450px] object-cover" />

                </SwiperSlide>
            </Swiper>
            <!-- end silders -->
        </div>
        <!-- yarmook center  -->
        <div class="section-yarmook mb-5">
            <div class="container mx-auto">
                <!-- center services yarmook -->
                <section class="mt-4 md:mt-10 px-4">
                    <div class="bg-white rounded-lg shadow-md p-4 md:p-6">
                        <h2 class="text-2xl font-bold text-start mb-6">Center Yarmook</h2>

                        <div class="grid grid-cols-2 md:grid-cols-2 gap-3 available-services">
                            <div @click="navigateTo('/services')"
                                class="bg-white rounded-lg border border-gray-300 shadow-md relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                                <div class="h-28 md:h-auto flex items-center justify-center">
                                    <img src="/car-fix.png" alt="handmade services"
                                        class="object-cover w-[50%] md:w-[40%]" />
                                </div>
                                <span
                                    class="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-scale">Rest
                                    more</span>
                                <div class="p-2 text-center">
                                    <h3 class="text-sm font-bold uppercase">handmade services</h3>
                                </div>
                            </div>

                            <div
                                class="bg-white rounded-lg border border-gray-300 shadow-md relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                                <div class="h-28 md:h-auto flex items-center justify-center">
                                    <img src="/Carcomfortable.png" alt="comfortable service"
                                        class="object-cover w-[50%] md:w-[40%]" />
                                </div>
                                <span
                                    class="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-scale">Rest
                                    more</span>
                                <div class="p-2 text-center">
                                    <h3 class="text-sm font-bold uppercase">comfortable service</h3>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 other-features">

                            <div
                                class="bg-white rounded-lg border border-gray-300 shadow-md overflow-hidden relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                <div class="h-28 flex items-center justify-center text-gray-400">
                                    <img src="/maintenance.png" alt="">
                                </div>
                                <span
                                    class="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase">soon</span>
                                <div class="p-2 text-center">
                                    <h3 class="text-xs font-bold uppercase">spare parts</h3>
                                </div>
                            </div>

                            <div
                                class="bg-white rounded-lg border border-gray-300 shadow-md overflow-hidden relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                <div class="h-28 flex items-center justify-center text-gray-400">
                                    <img src="/Car Brake.png" alt="">
                                </div>
                                <span
                                    class="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase">soon</span>
                                <div class="p-2 text-center">
                                    <h3 class="text-xs font-bold uppercase">spare parts</h3>
                                </div>
                            </div>

                            <div
                                class="bg-white rounded-lg border border-gray-300 shadow-md overflow-hidden relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                <div
                                    class="h-28 text-red-500 uppercase flex items-center justify-center font-bold text-4xl">
                                    pro
                                </div>
                                <span
                                    class="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase">pro</span>
                                <div class="p-2 text-center">
                                    <h3 class="text-xs font-bold uppercase">memberships</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <!-- end center -->
        <!-- offers yarmook -->
        <section v-if="offers.length" class="offers mb-8 mt-4 md:mt-10">
            <div class="container mx-auto px-4">
                <div class="bg-white rounded-lg shadow-md p-4 md:p-6">
                    <div class="flex align-middle justify-between">
                        <h2 class="text-2xl font-bold text-start mb-6">Offers</h2>
                        <h2 class="text-red-500 font-bold capitalize cursor-pointer" @click="navigateTo('/offers')">View
                            all
                        </h2>
                    </div>
                    <div
                        class="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:snap-none">
                        <NuxtLink v-for="offer in offers" :key="offer.id" :to="`/offers/${offer.id}`"
                            class="min-w-[calc(50%-0.5rem)] w-[calc(50%-0.5rem)] max-w-[calc(50%-0.5rem)] flex-shrink-0 snap-start md:min-w-0 md:w-auto md:max-w-none bg-white rounded-2xl border border-gray-300 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                            <div class="relative">
                                <img :src="offer.image || '/offerimage.jpeg'" :alt="offer.title"
                                    class="w-full h-28 md:h-[50%] object-cover" @error="$event.target.src = '/offerimage.jpeg'" />
                                <span v-if="offer.discount_percentage_text"
                                    class="hidden md:inline absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {{ offer.discount_percentage_text }}
                                </span>
                                <img v-if="offer.logo" :src="offer.logo" alt=""
                                    class="hidden md:block absolute bottom-2 left-2 w-10 h-10 rounded-full border-2 border-white object-cover" />
                            </div>
                            <div class="p-2 md:p-4">
                                <h3 class="text-xs md:text-sm font-bold text-gray-800 mb-1 md:mb-2 line-clamp-2">{{
                                    offer.title }}</h3>
                                <p v-if="offer.description"
                                    class="hidden md:block text-xs text-gray-500 mb-3 line-clamp-3 whitespace-pre-line">
                                    {{ offer.description }}
                                </p>
                                <div class="flex flex-col gap-0.5 md:flex-row md:items-center md:gap-2 md:mb-3">
                                    <span class="text-sm md:text-lg font-bold text-black">{{ offer.price_after_discount
                                        }}
                                        <span class="text-gray-400 uppercase text-[10px] md:text-xs">sar</span>
                                    </span>
                                    <span v-if="offer.price_before_discount"
                                        class="text-xs md:text-sm text-gray-400 line-through">{{
                                            offer.price_before_discount
                                        }} sar</span>
                                </div>
                                <div v-if="offer.benefits"
                                    class="hidden md:block text-xs text-gray-600 mb-3 offer-benefits"
                                    v-html="offer.benefits" />
                                <p v-if="offer.show_expiration && offer.expires_at"
                                    class="hidden md:block text-xs text-red-500 font-medium">
                                    Expires: {{ offer.expires_at }}
                                </p>
                            </div>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </section>
        <!-- end offers -->
    </div>
</template>
