<template>
    <div class="update-details">
        <div class="container mx-auto">
            <div class="container mx-auto max-w-5xl px-4 py-8">
                <div class="grid grid-cols-1 gap-8">

                    <div>
                        <h1 class="mb-6 text-2xl font-bold text-gray-800">
                            Order Details
                        </h1>
                        <div class="rounded-3xl bg-white p-6 shadow-sm">

                            <!-- My Cars -->
                            <div class="mb-5">
                                <label class="mb-2 block text-sm font-medium text-gray-700">
                                    My Cars
                                </label>

                                <select
                                    class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-yellow-400">
                                    <option>Select Car</option>
                                    <option>Toyota Camry</option>
                                    <option>Hyundai Elantra</option>
                                    <option>Kia Sportage</option>
                                </select>
                            </div>

                            <!-- Branch -->
                            <div class="mb-5">
                                <label class="mb-2 block text-sm font-medium text-gray-700">
                                    Branch
                                </label>

                                <div @click="openBranchPopup"
                                    class="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 cursor-pointer">
                                    <input readonly v-model="branchName" placeholder="Select Branch"
                                        class="w-full bg-transparent outline-none text-black placeholder-gray-500 cursor-pointer" />
                                    <span class="text-gray-400">⌄</span>
                                </div>
                            </div>

                            <!-- Date -->
                            <div class="mb-5">
                                <label class="mb-2 block text-sm font-medium text-gray-700">
                                    Date & Time
                                </label>

                                <div @click="openDateTimePopup"
                                    class="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 cursor-pointer">
                                    <span class="text-gray-500">
                                        {{ selectedDateTime || 'Select Date & Time' }}
                                    </span>

                                    <span class="text-gray-400">⌄</span>
                                </div>
                            </div>

                            <!-- Details -->
                            <div class="mb-5">
                                <label class="mb-2 block text-sm font-medium text-gray-700">
                                    Details
                                </label>

                                <textarea rows="5" placeholder="Issues details"
                                    class="w-full rounded-xl border border-gray-200 p-4 outline-none focus:border-yellow-400"></textarea>
                            </div>

                            <!-- Upload -->
                            <div class="mb-6">
                                <label class="mb-2 block text-sm font-medium text-gray-700">
                                    Problem Photo
                                </label>

                                <div class="rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center">


                                    <input type="file" class="hidden" id="upload" />

                                    <label for="upload" class="cursor-pointer font-medium text-yellow-500">
                                        Upload from your gallery
                                    </label>

                                    <p class="mt-2 text-sm text-gray-400">
                                        JPG, PNG up to 10MB
                                    </p>
                                </div>
                            </div>

                            <!-- Buttons -->
                            <div class="flex flex-col gap-3 sm:flex-row">


                                <button
                                    class="flex-1 rounded-xl bg-yellow-400 py-3 font-medium text-black transition hover:bg-yellow-500">
                                    Continue
                                </button>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Branch Popup -->
    <Teleport to="body">
        <div v-if="showBranchPopup" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
            @click.self="showBranchPopup = false">
            <div class="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[70vh] overflow-y-auto p-6">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-bold">Select Branch</h2>
                    <button @click="showBranchPopup = false" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                </div>
                <div v-if="branchesLoading" class="flex justify-center py-8">
                    <span class="w-6 h-6 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span>
                </div>
                <div v-else-if="branches.length" class="space-y-2">
                    <div v-for="branch in branches" :key="branch.id" @click="selectBranch(branch)"
                        class="p-4 rounded-xl border border-gray-200 cursor-pointer transition hover:border-yellow-400 hover:bg-yellow-50"
                        :class="selectedBranch?.id === branch.id ? 'border-yellow-400 bg-yellow-50' : ''">
                        <p class="font-medium text-gray-800">{{ branch.title }}</p>
                        <p v-if="branch.address" class="text-sm text-gray-500 mt-1">{{ branch.address }}</p>
                    </div>
                </div>
                <p v-else class="text-center text-gray-500 py-8">No branches available.</p>
            </div>
        </div>
    </Teleport>

    <!-- Date/Time Popup -->
    <Teleport to="body">
        <div v-if="showDateTimePopup" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
            @click.self="showDateTimePopup = false">
            <div class="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[70vh] overflow-y-auto p-6">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-bold">{{ dateTimeStep === 'date' ? 'Select Date' : 'Select Time' }}</h2>
                    <button @click="showDateTimePopup = false" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                </div>

                <!-- Loading State -->
                <div v-if="dateTimeLoading" class="flex justify-center py-8">
                    <span class="w-6 h-6 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span>
                </div>

                <!-- Date Selection Step -->
                <template v-else-if="dateTimeStep === 'date'">
                    <div v-if="availableDates.length" class="space-y-2">
                        <div v-for="dt in availableDates" :key="dt.date" @click="selectDate(dt)"
                            class="p-4 rounded-xl border border-gray-200 cursor-pointer transition hover:border-yellow-400 hover:bg-yellow-50"
                            :class="selectedDate?.date === dt.date ? 'border-yellow-400 bg-yellow-50' : ''">
                            <p class="font-medium text-gray-800">{{ formatDate(dt.date) }}</p>
                            <p class="text-sm text-gray-500 mt-1">{{ dt.time_slots?.length || 0 }} available times</p>
                        </div>
                    </div>
                    <p v-else class="text-center text-gray-500 py-8">No available dates for this branch.</p>
                </template>

                <!-- Time Selection Step -->
                <template v-else-if="dateTimeStep === 'time'">
                    <button @click="dateTimeStep = 'date'" class="text-sm text-yellow-500 mb-3 flex items-center gap-1">
                        &larr; Back to Dates
                    </button>
                    <div v-if="availableTimes.length" class="space-y-2">
                        <div v-for="time in availableTimes" :key="time" @click="selectTime(time)"
                            class="p-4 rounded-xl border border-gray-200 cursor-pointer transition hover:border-yellow-400 hover:bg-yellow-50 text-center"
                            :class="selectedTime === time ? 'border-yellow-400 bg-yellow-50' : ''">
                            <p class="font-medium text-gray-800">{{ time }}</p>
                        </div>
                    </div>
                    <p v-else class="text-center text-gray-500 py-8">No available times for this date.</p>
                </template>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
const { getBranches, getBranchDates } = useGlobalApi();

const branches = ref([]);
const branchesLoading = ref(false);
const showBranchPopup = ref(false);
const selectedBranch = ref(null);
const branchName = ref("");

const showDateTimePopup = ref(false);
const dateTimeLoading = ref(false);
const dateTimeStep = ref('date');
const selectedDate = ref(null);
const selectedTime = ref("");
const branchDates = ref([]);

const availableDates = computed(() => {
    return branchDates.value.length ? branchDates.value : (selectedBranch.value?.available_times ?? []);
});

const availableTimes = computed(() => {
    if (!selectedDate.value) return [];
    const slots = selectedDate.value.time_slots ?? [];
    return slots.map(s => s.time ?? String(s));
});

const selectedDateTime = computed(() => {
    if (!selectedDate.value || !selectedTime.value) return "";
    return `${formatDate(selectedDate.value.date)} at ${selectedTime.value}`;
});

async function openBranchPopup() {
    if (branches.value.length === 0) {
        branchesLoading.value = true;
        try {
            const res = await getBranches();
            console.log("Branches API response:", res);
            branches.value = res?.data?.items ?? res?.data ?? [];
        } catch (err) {
            console.error("Failed to load branches", err);
        } finally {
            branchesLoading.value = false;
        }
    }
    showBranchPopup.value = true;
}

function selectBranch(branch) {
    selectedBranch.value = branch;
    branchName.value = branch.name ?? branch.title ?? "";
    showBranchPopup.value = false;
    selectedDate.value = null;
    selectedTime.value = "";
    branchDates.value = [];
}

async function openDateTimePopup() {
    if (!selectedBranch.value) return;
    showDateTimePopup.value = true;
    dateTimeStep.value = 'date';
    selectedDate.value = null;
    selectedTime.value = "";

    if (selectedBranch.value.available_times) return;

    if (branchDates.value.length === 0) {
        dateTimeLoading.value = true;
        try {
            const res = await getBranchDates(selectedBranch.value.id);
            branchDates.value = res?.data?.dates ?? res?.data ?? res ?? [];
        } catch (err) {
            console.error("Failed to load branch dates", err);
        } finally {
            dateTimeLoading.value = false;
        }
    }
}

function selectDate(dt) {
    selectedDate.value = dt;
    dateTimeStep.value = 'time';
}

function selectTime(time) {
    selectedTime.value = time;
    showDateTimePopup.value = false;
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
</script>