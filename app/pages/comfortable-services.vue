<script setup>
const { getMycars, getPorblemsCar, getServices } = useCarServices();
const { getBranches } = useGlobalApi();

const MY_CARS_CACHE_KEY = "my_cars_cache";
const PROBLEMS_CACHE_KEY = "problems_cache";
const SERVICES_CACHE_KEY = "services_cache";

const currentStep = ref(1);
const myCars = ref([]);
const selectedCarId = ref(null);
const showCarPicker = ref(false);

const selectedCar = computed(() => myCars.value.find(c => c.id === selectedCarId.value));

const problems = ref([]);
const selectedProblems = ref([]);
const showProblemsModal = ref(false);
const loadingProblems = ref(false);

const toggleProblem = (problem) => {
    const idx = selectedProblems.value.findIndex(p => p.id === problem.id);
    if (idx === -1) {
        selectedProblems.value.push(problem);
    } else {
        selectedProblems.value.splice(idx, 1);
    }
};

const isProblemSelected = (problem) => selectedProblems.value.some(p => p.id === problem.id);

const openProblemsModal = async () => {
    showProblemsModal.value = true;

    if (problems.value.length) return;

    if (import.meta.client) {
        const cached = localStorage.getItem(PROBLEMS_CACHE_KEY);
        if (cached) {
            try {
                problems.value = JSON.parse(cached);
                return;
            } catch (e) { /* ignore */ }
        }
    }
    loadingProblems.value = true;
    try {
        const res = await getPorblemsCar();
        const items = Array.isArray(res) ? res : (res?.data?.items ?? res?.items ?? []);
        if (import.meta.client) {
            localStorage.setItem(PROBLEMS_CACHE_KEY, JSON.stringify(items));
        }
        problems.value = items;
    } catch (err) {
        console.error(err);
    } finally {
        loadingProblems.value = false;
    }
};

const services = ref([]);
const selectedServices = ref([]);
const showServicesModal = ref(false);
const loadingServices = ref(false);

const toggleService = (service) => {
    const idx = selectedServices.value.findIndex(s => s.id === service.id);
    if (idx === -1) {
        selectedServices.value.push(service);
    } else {
        selectedServices.value.splice(idx, 1);
    }
};

const isServiceSelected = (service) => selectedServices.value.some(s => s.id === service.id);

const openServicesModal = async () => {
    showServicesModal.value = true;

    if (services.value.length) return;

    if (import.meta.client) {
        const cached = localStorage.getItem(SERVICES_CACHE_KEY);
        if (cached) {
            try {
                services.value = JSON.parse(cached);
                return;
            } catch (e) { /* ignore */ }
        }
    }
    loadingServices.value = true;
    try {
        const res = await getServices();
        const items = Array.isArray(res) ? res : (res?.data?.items ?? res?.items ?? []);
        if (import.meta.client) {
            localStorage.setItem(SERVICES_CACHE_KEY, JSON.stringify(items));
        }
        services.value = items;
    } catch (err) {
        console.error(err);
    } finally {
        loadingServices.value = false;
    }
};

const deliveryType = ref("one_way");
const bookingType = ref(null);

const toggleBookingType = (type) => {
    if (bookingType.value === type) {
        bookingType.value = null;
    } else {
        bookingType.value = type;
        if (type === 'normal') {
            openDateTimePicker();
        }
    }
};

const branches = ref([]);
const selectedBranch = ref(null);
const showBranchPicker = ref(false);
const loadingBranches = ref(false);

const openBranchPicker = async () => {
    showBranchPicker.value = true;
    if (branches.value.length) return;
    loadingBranches.value = true;
    try {
        const res = await getBranches();
        branches.value = res?.data?.items ?? res?.data ?? [];
    } catch (err) {
        console.error(err);
    } finally {
        loadingBranches.value = false;
    }
};

const selectBranch = (branch) => {
    selectedBranch.value = branch;
    showBranchPicker.value = false;
    dates.value = branch.available_times || [];
    selectedDate.value = "";
    selectedTime.value = "";
};

const showDateTimePicker = ref(false);
const dateTimeStep = ref(1);
const dates = ref([]);
const selectedDate = ref("");
const availableTimes = ref([]);
const selectedTime = ref("");

const openDateTimePicker = () => {
    if (!selectedBranch.value) return;
    dateTimeStep.value = 1;
    showDateTimePicker.value = true;
};

const selectDate = (date) => {
    selectedDate.value = date.date;
    availableTimes.value = date.time_slots || [];
    dateTimeStep.value = 2;
};

const selectTime = (time) => {
    selectedTime.value = time;
    showDateTimePicker.value = false;
};

const nextStep = () => {
    currentStep.value = 2;
};

const previousStep = () => {
    currentStep.value = 1;
};

const selectCar = (car) => {
    selectedCarId.value = car.id;
    showCarPicker.value = false;
};
onMounted(async () => {
    bookingType.value = 'urgent';
    if (import.meta.client) {
        const cached = localStorage.getItem(MY_CARS_CACHE_KEY);
        if (cached) {
            try {
                const items = JSON.parse(cached);
                myCars.value = items;
                if (items.length && !selectedCarId.value) {
                    selectedCarId.value = items[0].id;
                }
            } catch (e) { /* ignore */ }
        }
    }

    try {
        const response = await getMycars();
        const items = Array.isArray(response) ? response : (response?.data?.items ?? response?.data ?? response?.items ?? []);
        if (import.meta.client) {
            localStorage.setItem(MY_CARS_CACHE_KEY, JSON.stringify(items));
        }
        myCars.value = items;
        if (items.length && !selectedCarId.value) {
            selectedCarId.value = items[0].id;
        }
    } catch (err) {
        console.error(err);
    }
});
</script>

<template>
    <div class="container mx-w-auto lg:p-6">
        <div class="min-h-screen bg-white">
            <!-- Header Steps -->
            <div class="bg-white flex justify-between text-xs border-b shadow-sm">
                <div class="flex-1 text-center py-4 font-semibold text-black">
                    خدمة مرتاح
                </div>

                <div class="flex-1 text-center py-4"
                    :class="currentStep >= 2 ? 'font-semibold text-black' : 'text-gray-400'">
                    تفاصيل الحجز
                </div>

                <div class="flex-1 text-center py-4 text-gray-400">
                    تأكيد
                </div>
            </div>

            <div class="w-full md:w-[70%] mx-auto">
                <!-- step 1-->
                <div v-if="currentStep === 1" class="p-4 space-y-4">

                    <!-- Car -->
                    <div class="relative shadow-md">
                        <div class="box-car bg-gray-100 rounded-xl p-4 shadow-sm">
                            <div class="flex justify-between items-center">
                                <div>
                                    <p class="text-sm text-gray-500">سيارتي</p>
                                    <p v-if="selectedCar" class="font-semibold">{{ selectedCar.brand?.title }} - {{
                                        selectedCar.car_type?.title }}</p>
                                    <p v-else class="text-gray-400" @click="showCarPicker = !showCarPicker">+ اختر سيارة
                                    </p>
                                </div>

                                <div class="flex items-center gap-2">
                                    <span v-if="selectedCar" class="text-sm">{{ selectedCar.brand?.title }}</span>
                                    <img v-if="selectedCar?.image" :src="selectedCar.image"
                                        @error="$event.target.style.display = 'none'; $event.target.nextElementSibling.style.display = 'flex'"
                                        class="w-10 h-10 rounded-full object-cover" />
                                    <img v-else-if="selectedCar?.brand?.image" :src="selectedCar.brand.image"
                                        class="w-10 h-10 rounded-full object-cover" />
                                    <img v-else src="https://via.placeholder.com/40"
                                        class="w-10 h-10 rounded-full object-cover" />
                                    <button v-if="selectedCar" @click="showCarPicker = !showCarPicker"
                                        class="bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-full">تغيير</button>
                                </div>
                            </div>
                        </div>

                        <div v-if="showCarPicker && myCars.length"
                            class="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-lg border max-h-48 overflow-y-auto">
                            <div v-for="car in myCars" :key="car.id" @click="selectCar(car)"
                                class="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                                :class="{ 'bg-red-50': car.id === selectedCarId }">
                                <img :src="car.image || car.brand?.image || 'https://via.placeholder.com/40'"
                                    @error="$event.target.src = 'https://via.placeholder.com/40'"
                                    class="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <p class="font-semibold text-sm">{{ car.brand?.title }} - {{ car.car_type?.title }}
                                    </p>
                                    <p v-if="car.plate_number" class="text-xs text-gray-500">{{ car.plate_number }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Problems -->
                    <div class="bg-gray-50 rounded-xl p-5 shadow-md">
                        <p class="text-gray-700 mb-3 text-center">
                            ما هي المشاكل التي تعاني منها سيارتك؟
                        </p>

                        <div v-if="selectedProblems.length" class="flex flex-col gap-2 mb-3">
                            <div v-for="p in selectedProblems" :key="p.id"
                                class="bg-white w-full rounded-md px-4 py-3 border border-gray-200 text-sm text-gray-800">
                                {{ p.title ?? p.name }}
                            </div>
                        </div>

                        <div class="text-center">
                            <button @click="openProblemsModal" class="text-red-500 font-medium">
                                + {{ selectedProblems.length ? 'تعديل المشاكل' : 'أضف مشاكل' }}
                            </button>
                        </div>
                    </div>

                    <!-- Services -->
                    <div class="bg-gray-50 rounded-xl p-5 shadow-md">
                        <p class="text-gray-500 mb-3 text-center">
                            الخدمات (اختياري)
                        </p>

                        <div v-if="selectedServices.length" class="flex flex-col gap-2 mb-3">
                            <div v-for="s in selectedServices" :key="s.id"
                                class="bg-white w-full rounded-md px-4 py-3 border border-gray-200 text-sm text-gray-800">
                                {{ s.title ?? s.name }}
                            </div>
                        </div>

                        <div class="text-center">
                            <button @click="openServicesModal" class="text-red-500 font-medium">
                                + {{ selectedServices.length ? 'تعديل الخدمات' : 'إضافة خدمة' }}
                            </button>
                        </div>
                    </div>

                    <!-- Notes -->
                    <div
                        class="bg-cyan-50 text-end  mx-auto rounded-xl p-4 text-sm text-gray-600 border border-cyan-100 shadow-sm">
                        أخبرنا إذا وجد لديك تفاصيل إضافية تخص سيارتك.
                    </div>

                    <!-- Details -->
                    <textarea placeholder="المزيد من التفاصيل (اختياري)"
                        class="w-full h-32 rounded-xl border p-4 outline-none resize-none bg-white shadow-sm"></textarea>

                    <!-- Continue -->
                    <button @click="nextStep"
                        class="w-full bg-yellow-400 rounded-full py-4 font-bold text-black shadow-md">
                        الاستمرار للتأكيد
                    </button>

                </div>

                <!-- step 2 -->
                <div v-else class="p-4 space-y-4">

                    <!-- Branch -->
                    <div class="bg-gray-50 rounded-xl p-5 shadow-md">
                        <p class="text-gray-700 mb-3 text-center">اختر الفرع</p>
                        <div v-if="selectedBranch" class="bg-white w-full rounded-md px-4 py-3 border border-gray-200 text-sm text-gray-800 mb-3">
                            {{ selectedBranch.title }}
                        </div>
                        <div class="text-center">
                            <button @click="openBranchPicker" class="text-red-500 font-medium">
                                + {{ selectedBranch ? 'تغيير الفرع' : 'اختر فرع' }}
                            </button>
                        </div>
                    </div>

                    <!-- Booking Time -->
                    <div class="bg-white rounded-xl p-4">
                        <div class="flex justify-between mb-4">
                            <h3 class="font-semibold">تفاصيل الوقت</h3>
                            <span class="text-red-500 text-sm">1</span>
                        </div>

                        <!-- Future -->
                        <div @click="toggleBookingType('urgent')"
                            class="border rounded-xl p-4 mb-4 cursor-pointer"
                            :class="bookingType === 'urgent' ? 'border-red-300 bg-red-50' : 'border-gray-200'">
                            <div class="flex justify-between">
                                <div>
                                    <h4 class="font-semibold">مستعجل</h4>
                                    <p class="text-xs text-gray-500 mt-2">
                                        ملاحظات: عند اختيار مستعجل سوف يرتفع سعر النقل
                                    </p>
                                </div>

                                <div class="bg-red-500 text-white rounded-full px-3 py-1 flex justify-center items-center text-xs">
                                    1 ساعة
                                </div>
                            </div>
                        </div>

                        <!-- Normal -->
                        <div @click="toggleBookingType('normal')"
                            class="border rounded-xl p-4 flex justify-between items-center cursor-pointer"
                            :class="bookingType === 'normal' ? 'border-red-300 bg-red-50' : 'border-gray-200'">
                            <div>
                                <h4 class="font-semibold">عادي</h4>
                                <p v-if="bookingType !== 'normal'" class="text-xs text-gray-500">
                                    يتم تحديد موعدك بعد المراجعة.
                                </p>
                                <p v-else class="text-xs text-green-600 font-medium">
                                    {{ selectedDate && selectedTime ? `${selectedDate} - ${selectedTime}` : 'اختر الوقت' }}
                                </p>
                            </div>
                            <div v-if="bookingType === 'normal' && selectedDate && selectedTime"
                                class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                <span class="text-white text-xs font-bold">✓</span>
                            </div>
                        </div>
                    </div>

                    <!-- Delivery Type -->
                    <div class="bg-white rounded-xl p-4 shadow-sm">
                        <p class="text-gray-500 mb-3">نوع التوصيل</p>
                        <div class="flex gap-3">
                            <button @click="deliveryType = 'one_way'"
                                class="flex-1 py-3 rounded-xl border font-semibold text-sm transition-colors"
                                :class="deliveryType === 'one_way' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-700 border-gray-300'">
                                oneway
                            </button>
                            <button @click="deliveryType = 'two_way'"
                                class="flex-1 capitalize py-3 rounded-xl border font-semibold text-sm transition-colors"
                                :class="deliveryType === 'two_way' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-700 border-gray-300'">
                                towway
                            </button>
                        </div>
                    </div>

                    <div class="flex gap-3">
                        <button @click="previousStep" class="flex-1 border rounded-full py-4 font-semibold">
                            رجوع
                        </button>

                        <button class="flex-1 bg-yellow-400 rounded-full py-4 font-bold">
                            الاستمرار للتأكيد
                        </button>
                    </div>

                </div>
                <!-- close step wrapper -->
            </div>

        </div>
    </div>

    <!-- problems modal -->
    <Teleport to="body">
        <div v-if="showProblemsModal" class="fixed inset-0 z-50 flex items-end justify-center">
            <div class="fixed inset-0 bg-black/50" @click="showProblemsModal = false"></div>
            <div class="relative bg-white rounded-t-2xl w-full max-w-lg max-h-[70vh] overflow-y-auto p-5 z-10">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-bold text-lg">اختر المشاكل</h3>
                    <button @click="showProblemsModal = false" class="text-gray-400 text-xl">&times;</button>
                </div>

                <div v-if="loadingProblems" class="flex justify-center py-8">
                    <div class="w-8 h-8 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
                </div>
                <div v-else-if="problems.length" class="space-y-2">
                    <div v-for="problem in problems" :key="problem.id" @click="toggleProblem(problem)"
                        class="flex items-center gap-3 p-3 rounded-xl cursor-pointer border"
                        :class="isProblemSelected(problem) ? 'border-red-500 bg-red-50' : 'border-gray-200'">
                        <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                            :class="isProblemSelected(problem) ? 'border-red-500 bg-red-500' : 'border-gray-300'">
                            <span v-if="isProblemSelected(problem)" class="text-white text-xs font-bold">✓</span>
                        </div>
                        <span class="text-sm">{{ problem.title ?? problem.name }}</span>
                    </div>
                </div>
                <div v-else class="text-center text-gray-400 py-8">
                    لا توجد مشاكل متاحة
                </div>

                <button @click="showProblemsModal = false"
                    class="w-full mt-4 bg-yellow-400 rounded-full py-3 font-bold text-black">
                    {{ selectedProblems.length ? 'تأكيد الاختيار' : 'إغلاق' }}
                </button>
            </div>
        </div>
    </Teleport>

    <!-- Date/Time modal -->
    <Teleport to="body">
        <div v-if="showDateTimePicker" class="fixed inset-0 z-50 flex items-end justify-center">
            <div class="fixed inset-0 bg-black/50" @click="showDateTimePicker = false"></div>
            <div class="relative bg-white rounded-t-2xl w-full max-w-lg max-h-[70vh] overflow-y-auto p-5 z-10">
                <div class="flex items-center mb-4">
                    <button v-if="dateTimeStep === 2" @click="dateTimeStep = 1" class="text-gray-500 text-xl ml-2">&larr;</button>
                    <h3 class="font-bold text-lg">{{ dateTimeStep === 1 ? 'اختر التاريخ' : 'اختر الوقت' }}</h3>
                    <button @click="showDateTimePicker = false" class="mr-auto text-gray-400 text-xl">&times;</button>
                </div>

                <div v-if="dateTimeStep === 1" class="space-y-2">
                    <div v-if="dates.length">
                        <div v-for="date in dates" :key="date.date" @click="selectDate(date)"
                            class="rounded-xl border border-gray-200 px-4 py-3 cursor-pointer hover:bg-yellow-50">
                            <p class="font-medium">{{ date.date }}</p>
                            <p class="text-sm text-gray-500">{{ date.time_slots?.length || 0 }} مواعيد متاحة</p>
                        </div>
                    </div>
                    <div v-else class="text-center text-gray-400 py-8">
                        لا توجد تواريخ متاحة
                    </div>
                </div>

                <div v-else-if="dateTimeStep === 2">
                    <div v-if="availableTimes.length" class="grid grid-cols-3 gap-3">
                        <div v-for="time in availableTimes" :key="time.time" @click="selectTime(time.time)"
                            class="rounded-xl border border-gray-200 px-3 py-3 text-center cursor-pointer hover:bg-yellow-50"
                            :class="{ 'bg-yellow-50 border-yellow-400': selectedTime === time.time }">
                            <p class="font-medium text-sm">{{ time.time }}</p>
                        </div>
                    </div>
                    <div v-else class="text-center text-gray-400 py-8">
                        لا توجد أوقات متاحة
                    </div>
                </div>
            </div>
        </div>
    </Teleport>

    <!-- Branch modal -->
    <Teleport to="body">
        <div v-if="showBranchPicker" class="fixed inset-0 z-50 flex items-end justify-center">
            <div class="fixed inset-0 bg-black/50" @click="showBranchPicker = false"></div>
            <div class="relative bg-white rounded-t-2xl w-full max-w-lg max-h-[70vh] overflow-y-auto p-5 z-10">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-bold text-lg">اختر الفرع</h3>
                    <button @click="showBranchPicker = false" class="text-gray-400 text-xl">&times;</button>
                </div>

                <div v-if="loadingBranches" class="flex justify-center py-8">
                    <div class="w-8 h-8 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
                </div>
                <div v-else-if="branches.length" class="space-y-2">
                    <div v-for="branch in branches" :key="branch.id" @click="selectBranch(branch)"
                        class="flex items-center gap-3 p-3 rounded-xl cursor-pointer border"
                        :class="selectedBranch?.id === branch.id ? 'border-red-500 bg-red-50' : 'border-gray-200'">
                        <span class="text-sm">{{ branch.title }}</span>
                    </div>
                </div>
                <div v-else class="text-center text-gray-400 py-8">
                    لا توجد فروع متاحة
                </div>
            </div>
        </div>
    </Teleport>

    <!-- Services modal -->
    <Teleport to="body">
        <div v-if="showServicesModal" class="fixed inset-0 z-50 flex items-end justify-center">
            <div class="fixed inset-0 bg-black/50" @click="showServicesModal = false"></div>
            <div class="relative bg-white rounded-t-2xl w-full max-w-lg max-h-[70vh] overflow-y-auto p-5 z-10">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-bold text-lg">اختر الخدمات</h3>
                    <button @click="showServicesModal = false" class="text-gray-400 text-xl">&times;</button>
                </div>

                <div v-if="loadingServices" class="flex justify-center py-8">
                    <div class="w-8 h-8 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
                </div>
                <div v-else-if="services.length" class="space-y-2">
                    <div v-for="service in services" :key="service.id" @click="toggleService(service)"
                        class="flex items-center gap-3 p-3 rounded-xl cursor-pointer border"
                        :class="isServiceSelected(service) ? 'border-red-500 bg-red-50' : 'border-gray-200'">
                        <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                            :class="isServiceSelected(service) ? 'border-red-500 bg-red-500' : 'border-gray-300'">
                            <span v-if="isServiceSelected(service)" class="text-white text-xs font-bold">✓</span>
                        </div>
                        <span class="text-sm">{{ service.title ?? service.name }}</span>
                    </div>
                </div>
                <div v-else class="text-center text-gray-400 py-8">
                    لا توجد خدمات متاحة
                </div>

                <button @click="showServicesModal = false"
                    class="w-full mt-4 bg-yellow-400 rounded-full py-3 font-bold text-black">
                    {{ selectedServices.length ? 'تأكيد الاختيار' : 'إغلاق' }}
                </button>
            </div>
        </div>
    </Teleport>
</template>
