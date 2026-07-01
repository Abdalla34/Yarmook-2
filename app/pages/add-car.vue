<template>
    <div class="min-h-screen bg-[#FDFDFF]">
        <div class="container mx-auto max-w-5xl px-4 py-8">

            <!-- Steps Indicator -->
            <div class="flex items-center justify-center gap-2 mb-10">
                <div class="flex items-center gap-2">
                    <div :class="step >= 1 ? 'bg-main-color text-black' : 'bg-gray-200 text-gray-500'"
                        class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition">1</div>
                    <span :class="step >= 1 ? 'text-gray-800' : 'text-gray-400'" class="text-sm font-medium">{{ $t('brand') }}</span>
                </div>
                <div :class="step >= 2 ? 'bg-main-color' : 'bg-gray-300'" class="w-12 h-0.5 transition"></div>
                <div class="flex items-center gap-2">
                    <div :class="step >= 2 ? 'bg-main-color text-black' : 'bg-gray-200 text-gray-500'"
                        class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition">2</div>
                    <span :class="step >= 2 ? 'text-gray-800' : 'text-gray-400'" class="text-sm font-medium">{{ $t('type_label') }}</span>
                </div>
                <div :class="step >= 3 ? 'bg-main-color' : 'bg-gray-300'" class="w-12 h-0.5 transition"></div>
                <div class="flex items-center gap-2">
                    <div :class="step >= 3 ? 'bg-main-color text-black' : 'bg-gray-200 text-gray-500'"
                        class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition">3</div>
                    <span :class="step >= 3 ? 'text-gray-800' : 'text-gray-400'" class="text-sm font-medium">{{ $t('details') }}</span>
                </div>
            </div>

            <!-- Step 1: Car Brands -->
            <div v-if="step === 1">
                <div class="text-center mb-6">
                    <h1 class="text-3xl font-bold text-gray-800">{{ $t('select_car_brand') }}</h1>
                    <p class="text-gray-400 mt-2">{{ $t('select_car_brand_hint') }}</p>
                </div>

                <div class="relative mb-6 max-w-md mx-auto">
                    <input v-model="searchQuery" type="text" :placeholder="$t('search_brands')"
                        class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-10 outline-none focus:border-main-color focus:ring-2 focus:ring-main-color/20 transition text-sm" />
                    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">&#x1F50D;</span>
                </div>

                <div v-if="loadingBrands" class="grid grid-cols-2 sm:grid-cols-4 gap-5">
                    <div v-for="n in 8" :key="n"
                        class="rounded-2xl bg-white p-5 shadow-sm animate-pulse flex flex-col items-center gap-3">
                        <div class="w-full aspect-square bg-gray-200 rounded-xl"></div>
                        <div class="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                </div>

                <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-5">
                    <div v-for="brand in filteredBrands" :key="brand.id"
                        class="group rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:border-main-color hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center gap-3"
                        @click="selectBrand(brand)">
                        <div class="w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center p-3 group-hover:scale-105 transition-transform duration-200">
                            <img :src="brand.image" :alt="brand.title"
                                class="w-full h-full object-contain" />
                        </div>
                        <span class="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{{ brand.title }}</span>
                    </div>
                </div>
            </div>

            <!-- Step 2: Car Types -->
            <div v-if="step === 2">
                <button @click="step = 1"
                    class="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition font-medium">
                    <span>&larr;</span> {{ $t('back_to_brands') }}
                </button>

                <div class="text-center mb-6">
                    <h1 class="text-3xl font-bold text-gray-800">{{ $t('brand_types', { brand: selectedBrand.title }) }}</h1>
                    <p class="text-gray-400 mt-2">{{ $t('select_model_hint', { brand: selectedBrand.title }) }}</p>
                </div>

                <div class="flex items-center justify-between gap-4 mb-6">
                    <div class="relative flex-1 max-w-md">
                        <input v-model="typeSearchQuery" type="text" :placeholder="$t('search_types')"
                            class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-10 outline-none focus:border-main-color focus:ring-2 focus:ring-main-color/20 transition text-sm" />
                        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">&#x1F50D;</span>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                        <span class="text-sm font-medium text-gray-600">{{ $t('default') }}</span>
                        <div @click="isDefault = !isDefault"
                            class="relative w-10 h-6 rounded-full border transition cursor-pointer"
                            :class="isDefault ? 'bg-main-color border-main-color' : 'bg-gray-100 border-gray-300'">
                            <div class="absolute top-1 w-4 h-4 rounded-full transition-all duration-200"
                                :class="isDefault ? 'bg-black left-5' : 'bg-gray-400 left-1'"></div>
                        </div>
                    </div>
                </div>

                <div v-if="loadingTypes" class="grid grid-cols-2 sm:grid-cols-4 gap-5">
                    <div v-for="n in 8" :key="n"
                        class="rounded-2xl bg-white p-5 shadow-sm animate-pulse flex flex-col items-center gap-3">
                        <div class="w-full aspect-square bg-gray-200 rounded-xl"></div>
                        <div class="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                </div>

                <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-5">
                    <div v-for="type in filteredCarTypes" :key="type.id"
                        class="group rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:border-main-color hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center gap-3"
                        :class="{ 'border-main-color ring-2 ring-main-color/30': selectedType?.id === type.id }"
                        @click="selectedType = type; step = 3">
                        <div class="w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center p-3 group-hover:scale-105 transition-transform duration-200">
                            <img :src="type.image" :alt="type.title"
                                class="w-full h-full object-contain" />
                        </div>
                        <span class="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{{ type.title }}</span>
                    </div>
                </div>

            </div>

            <!-- Step 3: Car Details -->
            <div v-if="step === 3">
                <button @click="step = 2"
                    class="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition font-medium">
                    <span>&larr;</span> {{ $t('back_to_types') }}
                </button>

                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold text-gray-800">{{ $t('car_details') }}</h1>
                    <p class="text-gray-400 mt-2">{{ selectedBrand.title }} - {{ selectedType.title }}</p>
                </div>

                <div class="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
                    <div class="space-y-6">

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="mb-2 block text-sm font-medium text-gray-700">{{ $t('car_plate') }} <span class="text-red-400">*</span></label>
                                <div class="flex gap-2">
                                    <input v-model="formData.car_plate_letters" type="text" :placeholder="$t('car_plate_letters_placeholder')"
                                        maxlength="4"
                                        class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-main-color focus:ring-2 focus:ring-main-color/20 transition uppercase text-center" />
                                    <input v-model="formData.car_plate_numbers" type="text" :placeholder="$t('car_plate_numbers_placeholder')"
                                        maxlength="4"
                                        class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-main-color focus:ring-2 focus:ring-main-color/20 transition text-center" />
                                </div>
                            </div>

                            <div>
                                <label class="mb-2 block text-sm font-medium text-gray-700">{{ $t('car_mileage') }} <span class="text-red-400">*</span></label>
                                <input v-model="formData.car_mileage" type="text" :placeholder="$t('enter_car_mileage')"
                                    class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-main-color focus:ring-2 focus:ring-main-color/20 transition" />
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="mb-2 block text-sm font-medium text-gray-700">{{ $t('last_maintenance') }}</label>
                                <input v-model="formData.last_maintenance" type="date"
                                    class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-main-color focus:ring-2 focus:ring-main-color/20 transition" />
                            </div>

                            <div>
                                <label class="mb-2 block text-sm font-medium text-gray-700">{{ $t('last_oil_change') }}</label>
                                <input v-model="formData.last_oil_change" type="date"
                                    class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-main-color focus:ring-2 focus:ring-main-color/20 transition" />
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="mb-2 block text-sm font-medium text-gray-700">{{ $t('manufacture_year') }} <span class="text-red-400">*</span></label>
                                <div @click="showYearPopup = true"
                                    class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-main-color focus:ring-2 focus:ring-main-color/20 transition cursor-pointer flex items-center justify-between">
                                    <span :class="formData.manufacture_year ? 'text-gray-900' : 'text-gray-400'">
                                        {{ formData.manufacture_year || $t('select_year') }}
                                    </span>
                                    <span class="text-gray-400 text-lg">⌄</span>
                                </div>

                                <div v-if="showYearPopup"
                                    class="fixed inset-0 z-50 flex items-center justify-center">
                                    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" @click="showYearPopup = false"></div>
                                    <div class="relative z-10 w-full max-w-sm mx-4 rounded-3xl bg-white shadow-2xl p-6">
                                        <h3 class="mb-4 text-lg font-semibold text-gray-800 text-center">{{ $t('select_manufacture_year') }}</h3>
                                        <div class="max-h-72 overflow-y-auto grid grid-cols-4 gap-3">
                                            <div v-for="year in years" :key="year"
                                                class="rounded-xl py-3 px-2 text-center text-sm cursor-pointer transition font-medium"
                                                :class="formData.manufacture_year === year ? 'bg-main-color text-black' : 'text-gray-600 hover:bg-gray-100'"
                                                @click="formData.manufacture_year = year; showYearPopup = false">
                                                {{ year }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label class="mb-2 block text-sm font-medium text-gray-700">{{ $t('chassis_number') }} <span class="text-red-400">*</span></label>
                                <input v-model="formData.chassis_number" type="text" :placeholder="$t('enter_chassis_number')"
                                    class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-main-color focus:ring-2 focus:ring-main-color/20 transition" />
                            </div>
                        </div>

                        <div class="flex items-center gap-2 pt-2">
                            <span class="text-sm font-medium text-gray-700">{{ $t('set_as_default_car') }}</span>
                            <div @click="isDefault = !isDefault"
                                class="relative w-10 h-6 rounded-full border transition cursor-pointer"
                                :class="isDefault ? 'bg-main-color border-main-color' : 'bg-gray-100 border-gray-300'">
                                <div class="absolute top-1 w-4 h-4 rounded-full transition-all duration-200"
                                    :class="isDefault ? 'bg-black left-5' : 'bg-gray-400 left-1'"></div>
                            </div>
                        </div>

                        <button @click="submitCar"
                            class="mt-6 w-full rounded-full bg-main-color py-4 font-bold text-black transition hover:brightness-95 active:scale-[0.99] shadow-sm">
                            {{ $t('submit') }}
                        </button>

                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
const { getcarBrands, getcartypesbrand, createMycar } = useCarServices();

const step = ref(1);
const searchQuery = ref("");
const typeSearchQuery = ref("");
const isDefault = ref(false);
const filteredBrands = computed(() =>
    brands.value.filter((b) =>
        b.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
);
const filteredCarTypes = computed(() =>
    carTypes.value.filter((t) =>
        t.title.toLowerCase().includes(typeSearchQuery.value.toLowerCase())
    )
);
const loadingBrands = ref(true);
const brands = ref([]);
const selectedBrand = ref(null);
const loadingTypes = ref(false);
const carTypes = ref([]);
const selectedType = ref(null);
const showYearPopup = ref(false);
const formData = ref({
    car_plate_letters: "",
    car_plate_numbers: "",
    car_mileage: "",
    last_maintenance: "",
    last_oil_change: "",
    manufacture_year: "",
    chassis_number: "",
});

const currentYear = new Date().getFullYear();
const years = ref([]);
for (let y = 2000; y <= currentYear; y++) {
    years.value.push(y);
}

onMounted(async () => {
    try {
        const res = await getcarBrands(15);
        if (res?.status) {
            brands.value = res.data?.items ?? [];
        }
    } catch (err) {
        console.error("Failed to load car brands", err);
    } finally {
        loadingBrands.value = false;
    }
});

async function selectBrand(brand) {
    selectedBrand.value = brand;
    selectedType.value = null;
    step.value = 2;
    loadingTypes.value = true;
    try {
        const res = await getcartypesbrand(brand.id);
        if (res?.status) {
            carTypes.value = res.data?.items ?? res.data ?? [];
        }
    } catch (err) {
        console.error("Failed to load car types", err);
    } finally {
        loadingTypes.value = false;
    }
}

async function submitCar() {
    const payload = {
        brand_id: selectedBrand.value.id,
        car_type_id: selectedType.value.id,
        is_default: isDefault.value,
        car_plate: `${formData.value.car_plate_letters} ${formData.value.car_plate_numbers}`,
        car_mileage: formData.value.car_mileage,
        last_maintenance: formData.value.last_maintenance,
        last_oil_change: formData.value.last_oil_change,
        manufacture_year: formData.value.manufacture_year,
        chassis_number: formData.value.chassis_number,
    };
    try {
   
        const res = await createMycar(payload);
        if (res?.status) {
            navigateTo('/my-cars')
        }
    } catch (err) {
        console.error("Failed to create car", err);
        alert("Failed to add car");
    }
}

</script>
