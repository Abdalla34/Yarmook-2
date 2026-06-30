<template>
  <div ref="pageRef" class="services-page mt-0 lg:mt-3 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <template v-if="loading">
        <div class="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div class="flex lg:hidden flex-col gap-4">
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
      </template>

      <template v-else>
        <div ref="desktopGrid" class="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            v-for="service in carServices"
            :key="service.id"
            :item="service"
            :loading-id="loadingServiceId"
            @add-to-cart="addServiceToCart"
          />
        </div>
        <div ref="mobileList" class="flex lg:hidden flex-col gap-4">
          <ProductListItem
            v-for="service in carServices"
            :key="service.id"
            :item="service"
            :loading-id="loadingServiceId"
            @add-to-cart="addServiceToCart"
          />
        </div>
      </template>
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
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const { getServices } = useCarServices();
const { addCart } = useAddToCart();
const { token } = useGlobalApi();

const SERVICES_CACHE_KEY = "services_cache";

const carServices = ref([]);
const loading = ref(true);
const showAuthModal = ref(false);
const pendingItem = ref(null);
const loadingServiceId = ref(null);

const pageRef = ref(null);
const desktopGrid = ref(null);
const mobileList = ref(null);

onMounted(async () => {
  if (import.meta.client && pageRef.value) {
    gsap.fromTo(pageRef.value, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power1.out" });
  }

  if (import.meta.client) {
    const cached = localStorage.getItem(SERVICES_CACHE_KEY);
    if (cached) {
      try {
        carServices.value = JSON.parse(cached);
        loading.value = false;
      } catch (e) {
        // ignore invalid cache
      }
    }
  }

  try {
    const response = await getServices();
    const items = Array.isArray(response) ? response?.data?.items : (response.data?.items ?? []);
    if (import.meta.client) {
      localStorage.setItem(SERVICES_CACHE_KEY, JSON.stringify(items));
    }
    carServices.value = items;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});

watch(loading, (isLoading) => {
  if (!isLoading && carServices.value.length) {
    nextTick(() => {
      animateCards();
    });
  }
});

function animateCards() {
  if (!import.meta.client) return;

  const targets = [];
  if (desktopGrid.value) targets.push(...desktopGrid.value.children);
  if (mobileList.value) targets.push(...mobileList.value.children);

  if (!targets.length) return;

  gsap.set(targets, { opacity: 0, y: 30 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: pageRef.value,
      start: "top 80%",
      once: true,
    },
  });

  tl.to(targets, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" });
}

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
</script>
