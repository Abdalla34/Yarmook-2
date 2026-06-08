<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const { getHome } = useGlobalApi();

const { data: homeData } = await useAsyncData("home", () => getHome());

const sliders = computed(() => homeData.value?.data?.sliders ?? []);
</script>

<template>
    <div class="index-page mt-4">
        <div class="container mx-auto">
            <Swiper v-if="sliders.length" :modules="[Autoplay, Pagination]" :loop="true" :autoplay="{ delay: 2000 }"
                :pagination="{ clickable: true }" class="home-slider w-[90%] md:w-[100%] lg:w-[80%]">
                <SwiperSlide v-for="(slide, i) in sliders" :key="i">
                    <img v-if="slide.image" :src="slide.image" :alt="slide.title ?? 'slider'"
                        class="w-full h-[120px] md:h-[450px] object-cover rounded-lg" />
                    <!-- <div v-if="slide.title" class="slide-content">
            <h2>{{ slide.title }}</h2>
            <p v-if="slide.description">{{ slide.description }}</p>
          </div> -->
                </SwiperSlide>
            </Swiper>

        </div>
        <!-- yarmook center  -->
        <div class="section-yarmook">
            <div class="container mx-auto">
                <!-- center services yarmook -->
                <section class="mt-12 px-4">
                    <h2 class="text-2xl font-bold text-start mb-6">Center Yarmook</h2>

                    <div class="flex justify-center gap-4">
                        <div
                            class="bg-white rounded-lg shadow-md sm:w-1/5 relative md:w-2/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                            <img src="/car-fix.png" alt="handmade services" class="object-cover w-[40%] m-auto" />
                            <span
                                class="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">Rest
                                more</span>
                            <div class="p-2 text-center">
                                <h3 class="text-sm font-bold uppercase">handmade services</h3>
                            </div>
                        </div>

                        <div
                            class="bg-white rounded-lg shadow-md sm:w-1/5 relative md:w-2/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                            <img src="/Carcomfortable.png" alt="comfortable service"
                                class="object-cover w-[40%] m-auto" />
                            <span
                                class="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">Rest
                                more</span>
                            <div class="p-2 text-center">
                                <h3 class="text-sm font-bold uppercase">comfortable service</h3>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-4 mt-4">
                        <div
                            class="bg-white rounded-lg shadow-md overflow-hidden relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div class="h-32 bg-gray-200 flex items-center justify-center text-gray-400">
                                <!-- add image -->
                            </div>
                            <span
                                class="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase">soon</span>
                            <div class="p-3 text-center">
                                <h3 class="text-sm font-bold uppercase">maintenance periodic</h3>
                            </div>
                        </div>

                        <div
                            class="bg-white rounded-lg shadow-md overflow-hidden relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div class="h-32 flex items-center justify-center text-gray-400">
                                <img src="/Car Brake.png" alt="">
                            </div>
                            <span
                                class="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase">soon</span>
                            <div class="p-3 text-center">
                                <h3 class="text-sm font-bold uppercase">spare parts</h3>
                            </div>
                        </div>

                        <div
                            class="bg-white rounded-lg shadow-md overflow-hidden relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div
                                class="h-32 text-red-500 uppercase flex items-center justify-center font-bold text-4xl">
                                pro
                            </div>
                            <span
                                class="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase">pro</span>
                            <div class="p-3 text-center">
                                <h3 class="text-sm font-bold uppercase">memberships</h3>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <!-- offers yarmook -->
         <div class="offers"></div>
    </div>
</template>
