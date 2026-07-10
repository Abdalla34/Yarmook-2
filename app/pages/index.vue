<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const { getHome, getOffers, token } = useGlobalApi();

const showAuthModal = ref(false);

function handleComfortableServiceClick() {
  if (!token.value) {
    showAuthModal.value = true;
    return;
  }
  navigateTo('/comfortable-services');
}

function handleAuthSuccess() {
  showAuthModal.value = false;
  navigateTo('/comfortable-services');
}

const HOME_CACHE_KEY = "home_cache";
const OFFERS_CACHE_KEY = "offers_cache";

const homeData = ref(null);
const offersData = ref(null);
const loading = ref(true);

const sliders = computed(() => homeData.value?.data?.sliders ?? []);
const offers = computed(() => offersData.value?.data?.items ?? offersData.value?.data ?? []);

const sectionYarmook = ref(null);
const sectionTitle = ref(null);
const mainGrid = ref(null);
const secondaryGrid = ref(null);
const offersSection = ref(null);
const offersHeading = ref(null);
const offersGrid = ref(null);

onMounted(async () => {
    if (import.meta.client) {
        const cachedHome = localStorage.getItem(HOME_CACHE_KEY);
        if (cachedHome) {
            try {
                homeData.value = JSON.parse(cachedHome);
                loading.value = false;
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
    } finally {
        loading.value = false;
    }

    animateYarmookSection();
});

watch(offers, (val) => {
    if (val.length) {
        nextTick(() => animateOffersSection());
    }
}, { once: true });

onUnmounted(() => {
    ScrollTrigger.getAll().forEach((st) => st.kill());
});

function animateOffersSection() {
    if (!import.meta.client || !offersSection.value) return;

    const heading = offersHeading.value;
    const cards = offersGrid.value?.children;

    if (heading) gsap.set(heading, { opacity: 0, x: 30 });
    if (cards?.length) gsap.set(cards, { opacity: 0, y: 30, scale: 0.95 });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: offersSection.value,
            start: "top 85%",
            once: true,
        },
    });

    if (heading) {
        tl.to(heading, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" });
    }

    if (cards?.length) {
        tl.to(cards, { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" }, "-=0.2");
    }

    ScrollTrigger.refresh();
}

function animateYarmookSection() {
    if (!import.meta.client || !sectionYarmook.value) return;

    const title = sectionTitle.value;
    const mainCards = mainGrid.value?.children;
    const secondaryCards = secondaryGrid.value?.children;

    if (title) gsap.set(title, { opacity: 0, x: -30 });
    if (mainCards?.length) gsap.set(mainCards, { opacity: 0, y: 30 });
    if (secondaryCards?.length) gsap.set(secondaryCards, { opacity: 0, y: 30 });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: sectionYarmook.value,
            start: "top 85%",
            once: true,
        },
    });

    if (title) {
        tl.to(title, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" });
    }

    if (mainCards?.length) {
        tl.to(mainCards, { opacity: 1, y: 0, duration: 0.4, stagger: 0.15, ease: "power2.out" }, "-=0.2");
    }

    if (secondaryCards?.length) {
        tl.to(secondaryCards, { opacity: 1, y: 0, duration: 0.4, stagger: 0.12, ease: "power2.out" }, "-=0.1");
    }

    ScrollTrigger.refresh();
}
</script>

<template>
    <div class="index-page mt-4">
        <div class="container mx-auto ">
            <!-- sliders home page -->
            <div v-if="loading && !sliders.length"
                class="animate-pulse w-[90%] md:w-[100%] lg:w-[90%] mx-auto border-4 border-white rounded-lg overflow-hidden bg-gray-200 h-[120px] md:h-[450px]">
            </div>
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
        <div ref="sectionYarmook" class="section-yarmook mb-5">
            <div class="container mx-auto">
                <section class="mt-4 md:mt-10 px-4">
                        <h2 ref="sectionTitle" class="text-2xl font-bold mb-6">{{ $t('center_yarmook') }}</h2>

                        <div ref="mainGrid" class="grid grid-cols-2 gap-3">
                            <div @click="navigateTo('/services')"
                                class="bg-gray-50 rounded-lg border border-gray-300 shadow-md relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                                <div class="h-28 md:h-36 flex items-center justify-center p-4">
                                    <img src="/car-fix.png" alt="Handmade Services"
                                        class="object-contain w-full h-full" />
                                </div>
                                <span
                                    class="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{{
                                        $t('more') }}</span>
                                <div class="p-2 text-center">
                                    <h3 class="text-sm font-bold">{{ $t('handmade_services') }}</h3>
                                </div>
                            </div>

                            <div @click="handleComfortableServiceClick"
                                class="bg-gray-50 rounded-lg border border-gray-300 shadow-md relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                                <div class="h-28 md:h-36 flex items-center justify-center p-4">
                                    <img src="/Carcomfortable.png" alt="Comfortable Service"
                                        class="object-contain w-full h-full" />
                                </div>
                                <span
                                    class="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{{
                                        $t('more') }}</span>
                                <div class="p-2 text-center">
                                    <h3 class="text-sm font-bold">{{ $t('comfortable_service') }}</h3>
                                </div>
                            </div>
                        </div>

                        <div ref="secondaryGrid" class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                            <div @click="navigateTo('/services')"
                                class="bg-gray-50 rounded-lg border border-gray-300 shadow-md relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                                <div class="h-28 flex items-center justify-center p-4">
                                    <img src="/maintenance.png" alt="Maintenance"
                                        class="object-contain w-full h-full" />
                                </div>
                                <span
                                    class="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{{
                                        $t('soon') }}</span>
                                <div class="p-2 text-center">
                                    <h3 class="text-xs font-bold">{{ $t('maintenance') }}</h3>
                                </div>
                            </div>

                            <div @click="navigateTo('/services')"
                                class="bg-gray-50 rounded-lg border border-gray-300 shadow-md relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                                <div class="h-28 flex items-center justify-center p-4">
                                    <img src="/Car Brake.png" alt="Spare Parts" class="object-contain w-full h-full" />
                                </div>
                                <span
                                    class="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{{
                                        $t('soon') }}</span>
                                <div class="p-2 text-center">
                                    <h3 class="text-xs font-bold">{{ $t('spare_parts') }}</h3>
                                </div>
                            </div>

                            <div @click="navigateTo('/memberships')"
                                class="bg-gray-50 rounded-lg border border-gray-300 shadow-md relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                                <div class="h-28 flex items-center justify-center">
                                    <span class="text-red-500 font-bold text-4xl uppercase">{{ $t('pro') }}</span>
                                </div>
                                <span
                                    class="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{{
                                        $t('pro') }}</span>
                                <div class="p-2 text-center">
                                    <h3 class="text-xs font-bold">{{ $t('memberships') }}</h3>
                                </div>
                            </div>
                        </div>
                </section>
            </div>
        </div>
        <!-- offers yarmook -->
        <section ref="offersSection" v-if="offers.length" class="offers mb-8 mt-4 md:mt-10">
            <div class="container mx-auto px-4">
                    <div ref="offersHeading" class="flex align-middle justify-between">
                        <h2 class="text-2xl font-bold text-start mb-6">{{ $t('offers') }}</h2>
                        <h2 class="text-red-500 font-bold capitalize cursor-pointer" @click="navigateTo('/offers')">{{
                            $t('view_all') }}</h2>
                    </div>
                    <div ref="offersGrid"
                        class="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:snap-none">
                        <NuxtLink v-for="offer in offers" :key="offer.id" :to="`/offers/${offer.id}`"
                            class="min-w-[calc(50%-0.5rem)] w-[calc(50%-0.5rem)] max-w-[calc(50%-0.5rem)] flex-shrink-0 snap-start md:min-w-0 md:w-auto md:max-w-none bg-gray-50 rounded-2xl border border-gray-300 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                            <div class="relative">
                                <img :src="offer.image || '/offerimage.jpeg'" :alt="offer.title"
                                    class="w-full h-28 md:h-[50%] object-cover"
                                    @error="$event.target.src = '/offerimage.jpeg'" />
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
        </section>
        <!-- end offers -->
        <!-- try app section -->
        <div class="p-4">
            <div class="container mx-auto">
                <div class="relative mx-auto w-full md:w-[80%] rounded-3xl bg-gradient-to-r from-[#fae1e7] to-[#fcee97] px-6 py-2">
                    <Swiper class="flex items-center justify-center gap-5">
                        <SwiperSlide>
                            <div class="flex flex-wrap items-center justify-around gap-5">
                                <!-- Discount -->
                                <div>
                                    <h1 class="text-4xl font-bold">
                                        {{ $t('discount_20') }}
                                    </h1>
                                </div>

                                <!-- Offer Image -->
                                <div>
                                    <img src="/GroupPhone.png" alt="Offer" class="h-auto max-w-full" />
                                </div>

                                <!-- QR Code -->
                                <div class="flex items-center gap-2 rounded-lg bg-[#fff6] border-2 border-white px-4 py-2">
                                    <img src="/QR_code.png" alt="QR Code" class="w-20 h-20 border-2 border-white rounded-lg cursor-pointer hover:scale-110 transition-transform duration-300" />

                                    <div>
                                        <h6 class="text-base font-medium capitalize">
                                            {{ $t('try_the_app') }}
                                        </h6>

                                        <p class="text-sm text-gray-500 capitalize">
                                            {{ $t('scan_to_download') }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </div>

    </div>

    <AuthCartModal
      :show="showAuthModal"
      mode="login-only"
      @close="showAuthModal = false"
      @success="handleAuthSuccess"
    />
</template>
