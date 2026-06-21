<template>
    <div class="update-details">
        <div class="container mx-auto">
            <div class="mx-auto max-w-5xl px-4 py-8">
                <div class="grid grid-cols-1 gap-8">

                    <div>
                        <h1 class="mb-6 text-2xl font-bold text-gray-800">
                            Order Details
                        </h1>

                        <div class="rounded-3xl bg-white p-6 shadow-sm">

                            <Form @submit="submitOrderDetails">

                                <!-- My Cars -->
                                <div v-if="cars.length > 0" class="mb-5">
                                    <label class="mb-2 block text-sm font-medium text-gray-700">
                                        My Cars
                                    </label>

                                    <Field name="car_id" :rules="required" as="select" v-model="selectedCarId"
                                        class="w-full rounded-xl cursor-pointer border border-gray-200 px-4 py-3 outline-none focus:border-yellow-400">
                                        <option value="" disabled class="text-gray-200">Welcome MR: {{ userName }}</option>
                                        <option v-for="car in cars" :key="car.id" :value="car.id">
                                            {{ car.name }} - {{ car.brand?.title }} {{ car.car_type?.title }}
                                        </option>
                                    </Field>
                                    <ErrorMessage name="car_id" class="text-red-500 text-sm mt-1 block" />
                                </div>

                                <!-- No Car -->
                                <div v-else class="mb-5">
                                    <button @click="router.push('/carbrands')"
                                        class="w-full rounded-xl bg-yellow-400 py-3 font-medium text-black transition hover:bg-yellow-500">
                                        Add Car
                                    </button>
                                </div>

                                <!-- Branch -->
                                <div class="mb-5">
                                    <label class="mb-2 block text-sm font-medium text-gray-700">
                                        Branch
                                    </label>

                                    <Field name="branch_id" :rules="branchRequired" :model-value="selectedBranchId" type="hidden" />

                                    <div @click="showBranchPopup = true"
                                        class="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 cursor-pointer">
                                        <span class="text-black placeholder-gray-500">
                                            {{ selectedBranchName || 'Select Branch' }}
                                        </span>
                                        <span class="text-gray-400">⌄</span>
                                    </div>
                                    <ErrorMessage name="branch_id" class="text-red-500 text-sm mt-1 block" />
                                </div>

                                <!-- Date -->
                                <div class="mb-5">
                                    <label class="mb-2 block text-sm font-medium text-gray-700">
                                        Date & Time
                                    </label>

                                    <Field name="datetime" :rules="dateTimeRequired" :model-value="selectedDateTime" type="hidden" />

                                    <div @click="openDateTimePicker"
                                        class="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 cursor-pointer">
                                        <span :class="selectedDateTime ? 'text-black' : 'text-gray-500'">
                                            {{ selectedDateTime || 'Select Date & Time' }}
                                        </span>
                                        <span class="text-gray-400">⌄</span>
                                    </div>
                                    <ErrorMessage name="datetime" class="text-red-500 text-sm mt-1 block" />
                                </div>

                                <!-- Details -->
                                <div class="mb-5">
                                    <label class="mb-2 block text-sm font-medium text-gray-700">
                                        Details
                                    </label>

                                    <Field name="customer_note" as="textarea" v-model="customerNote" rows="5" placeholder="Issues details"
                                        class="w-full rounded-xl border border-gray-200 p-4 outline-none focus:border-yellow-400" />
                                </div>

                                <!-- Upload -->
                                <div class="mb-6">
                                    <label class="mb-2 block text-sm font-medium text-gray-700">
                                        Problem Photo
                                    </label>

                                    <div class="rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center">
                                        <input ref="fileInput" type="file" class="hidden" id="upload" accept="image/jpeg,image/png" multiple @change="handleFileChange" />

                                        <label for="upload" class="cursor-pointer font-medium text-yellow-500">
                                            {{ selectedFiles.length ? `${selectedFiles.length} file(s) selected` : 'Upload from your gallery' }}
                                        </label>

                                        <p class="mt-2 text-sm text-gray-400">
                                            JPG, PNG up to 10MB
                                        </p>
                                    </div>
                                </div>

                                <!-- Buttons -->
                                <div class="flex flex-col gap-3 sm:flex-row">
                                    <button type="submit" :disabled="submitting"
                                        class="flex-1 rounded-xl bg-yellow-400 py-3 font-medium text-black transition hover:bg-yellow-500 disabled:opacity-50">
                                        {{ submitting ? 'Loading...' : 'Continue' }}
                                    </button>
                                </div>

                            </Form>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <!-- Date/Time Picker Popup -->
    <div v-if="showDateTimePopup"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4"
        @click="showDateTimePopup = false">
        <div class="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-xl max-h-[80vh] flex flex-col"
            @click.stop>
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
                <button v-if="dateTimeStep === 2" @click="dateTimeStep = 1" class="text-gray-500 hover:text-gray-700">
                    ← Back
                </button>
                <span class="flex-1"></span>
                <h3 class="text-lg font-semibold text-gray-800">
                    {{ dateTimeStep === 1 ? 'Select Date' : 'Select Time' }}
                </h3>
                <span class="flex-1"></span>
            </div>

            <!-- Step 1: Dates -->
            <div v-if="dateTimeStep === 1" class="overflow-y-auto flex-1 -mx-2">
                <div v-if="dates.length" class="space-y-2">
                    <div v-for="date in dates" :key="date.date" @click="selectDate(date)"
                        class="rounded-xl border border-gray-200 px-4 py-3 cursor-pointer hover:bg-yellow-50">
                        <p class="font-medium">
                            {{ date.date }}
                        </p>

                        <p class="text-sm text-gray-500">
                            {{ date.time_slots?.length || 0 }} available times
                        </p>
                    </div>
                </div>
                <div v-else class="text-center py-8 text-gray-500">
                    No available dates
                </div>
            </div>

            <!-- Step 2: Times -->
            <div v-else-if="dateTimeStep === 2" class="overflow-y-auto flex-1 -mx-2">
                <div v-if="availableTimes.length" class="grid grid-cols-3 gap-3">
                    <div v-for="time in availableTimes" :key="time.time" @click="selectTime(time)"
                        class="rounded-xl border px-3 py-3 text-center cursor-pointer hover:bg-yellow-50">
                        <p>
                            {{ time.time }}
                        </p>

                        <p class="text-xs text-gray-500">
                            Available: {{ time.available_orders }}
                        </p>
                    </div>
                    <!-- <div v-for="time in availableTimes" :key="time.id || time.time" @click="selectTime(time)"
                        class="rounded-xl border border-gray-200 px-3 py-3 text-center cursor-pointer transition hover:bg-yellow-50"
                        :class="{ 'bg-yellow-50 border-yellow-400': selectedTime === (time.time || time.value) }">
                        <p class="font-medium text-gray-800 text-sm">{{ time.time || time.value }}</p>
                    </div> -->
                </div>
                <div v-else class="text-center py-8 text-gray-500">
                    No available times
                </div>
            </div>
        </div>
    </div>

    <!-- Branch Picker Popup -->
    <div v-if="showBranchPopup"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4"
        @click="showBranchPopup = false">
        <div class="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-xl max-h-[70vh] flex flex-col"
            @click.stop>
            <h3 class="text-lg font-semibold text-gray-800 text-center mb-4">
                Select Branch
            </h3>

            <div v-if="loadingBranches" class="flex justify-center py-8">
                <svg class="w-8 h-8 animate-spin text-yellow-400" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </div>

            <div v-else-if="branches.length" class="overflow-y-auto flex-1 -mx-2">
                <div v-for="branch in branches" :key="branch.id" @click="selectBranch(branch)"
                    class="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition hover:bg-yellow-50"
                    :class="{ 'bg-yellow-50 border border-yellow-200': selectedBranchId === branch.id }">
                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 font-bold text-sm">
                        {{ branch.title?.charAt(0) || 'B' }}
                    </div>
                    <div>
                        <p class="font-medium text-gray-800">{{ branch.title }}</p>
                        <p v-if="branch.address" class="text-sm text-gray-500">{{ branch.address }}</p>
                    </div>
                </div>
            </div>

            <div v-else class="text-center py-8 text-gray-500">
                No branches available
            </div>
        </div>
    </div>
</template>

<!-- ////////////////// -->
<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";

function required(value) {
    if (!value) return "This field is required";
    return true;
}

function branchRequired(value) {
    if (!value) return "Please select a branch";
    return true;
}

function dateTimeRequired(value) {
    if (!value) return "Please select date & time";
    return true;
}

const { getMycars } = useCarServices();
const { getBranches } = useGlobalApi();
const { updateCartDetails } = useAddToCart();
const userCookie = useCookie("user", { maxAge: 365 * 24 * 60 * 60 });
const route = useRoute();
const router = useRouter();

const orderId = route.query.order_id;

const cars = ref([]);
const selectedCarId = useState("orderCarId", () => "");

const branches = ref([]);
const selectedBranchId = useState("orderBranchId", () => null);
const selectedBranchName = useState("orderBranchName", () => "");
const showBranchPopup = ref(false);
const loadingBranches = ref(false);

const showDateTimePopup = ref(false);
const dateTimeStep = ref(1);
const dates = useState("orderDates", () => []);

const selectedDate = useState("orderSelectedDate", () => "");
const availableTimes = useState("orderAvailableTimes", () => []);
const selectedTime = useState("orderSelectedTime", () => "");
const selectedDateTime = useState("orderSelectedDateTime", () => "");

const customerNote = useState("orderCustomerNote", () => "");
const selectedFiles = ref([]);
const fileInput = ref(null);
const submitting = ref(false);

function handleFileChange() {
  if (fileInput.value?.files) {
    selectedFiles.value = Array.from(fileInput.value.files);
  }
}

async function submitOrderDetails() {
  if (!orderId) return;
  submitting.value = true;
  try {
    const payload = new FormData();
    payload.append("branch_id", selectedBranchId.value);
    payload.append("user_car_id", selectedCarId.value);
    payload.append("reservation_time", selectedDateTime.value);
    payload.append("customer_note", customerNote.value);
    selectedFiles.value.forEach((file) => {
      payload.append("images[]", file);
    });

    await updateCartDetails(orderId, payload);

    router.push(`/cart-update-details?order_id=${orderId}`);
  } catch (err) {
    console.error(err);
  } finally {
    submitting.value = false;
  }
}

const userName = computed(() => {
    if (!userCookie.value) return "";
    const user = typeof userCookie.value === "string"
        ? JSON.parse(userCookie.value)
        : userCookie.value;
    return user?.first_name && user?.last_name
        ? `${user.first_name} ${user.last_name}`
        : user?.name || "";
});

function openDateTimePicker() {
  if (!selectedBranchId.value) return;

  dateTimeStep.value = 1;
  showDateTimePopup.value = true;
}
function selectDate(date) {
    selectedDate.value = date.date;

    availableTimes.value = date.time_slots || [];

    dateTimeStep.value = 2;
}

function selectTime(time) {
    selectedTime.value = time.time;

    selectedDateTime.value =
        `${selectedDate.value} ${selectedTime.value}`;

    showDateTimePopup.value = false;
}
function selectBranch(branch) {
  selectedBranchId.value = branch.id;
  selectedBranchName.value = branch.title;

  dates.value = branch.available_times || [];

  selectedDate.value = "";
  selectedTime.value = "";
  availableTimes.value = [];

  showBranchPopup.value = false;
}

async function fetchCars() {
    try {
        const response = await getMycars();
        cars.value = response?.data?.data ?? response?.data ?? [];
    } catch (err) {
        console.error(err);
    }
}

async function fetchBranches() {
    loadingBranches.value = true;
    try {
        const response = await getBranches();
        branches.value = response?.data?.items ?? response?.data ?? [];
    } catch (err) {
        console.error(err);
    } finally {
        loadingBranches.value = false;
    }
}

watch(showBranchPopup, (val) => {
    if (val && !branches.value.length) {
        fetchBranches();
    }
});

onMounted(fetchCars);
</script>