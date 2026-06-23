<script setup>
const token = useCookie("token");
const userCookie = useCookie("user", { maxAge: 365 * 24 * 60 * 60 });
const { getCountries, getAreasByCountry, getCitiesByArea } = useGlobalApi();
const { editeProfile, getDeactivatedReasons, logOut, deleteaccount } = useUserinformation();

const user = computed(() => {
    if (!userCookie.value) return null;
    const data = typeof userCookie.value === "string" ? JSON.parse(userCookie.value) : userCookie.value;
    return data;
});

const isLoggedIn = computed(() => !!token.value);
const editing = ref(false);
const saving = ref(false);

const showLogoutPopup = ref(false);
const deactivatedReasons = ref([]);
const selectedReason = ref("");
const loadingReasons = ref(false);
const loggingOut = ref(false);

async function openLogoutPopup() {
    showLogoutPopup.value = true;
    loadingReasons.value = true;
    try {
        const res = await getDeactivatedReasons();
        deactivatedReasons.value = res?.data ?? [];
    } catch { } finally {
        loadingReasons.value = false;
    }
}

async function confirmLogout() {
    loggingOut.value = true;
    try {
        const res = await logOut(selectedReason.value || undefined);
        if (res?.status) {
            userCookie.value = null;
            navigateTo("/");
        }
    } catch { } finally {
        loggingOut.value = false;
    }
}

function cancelLogout() {
    showLogoutPopup.value = false;
    selectedReason.value = "";
}

const showDeletePopup = ref(false);
const deleteReasons = ref([]);
const selectedDeleteReason = ref("");
const loadingDeleteReasons = ref(false);
const deleting = ref(false);

async function openDeletePopup() {
    showDeletePopup.value = true;
    loadingDeleteReasons.value = true;
    try {
        const res = await getDeactivatedReasons();
        deleteReasons.value = res?.data ?? [];
    } catch { } finally {
        loadingDeleteReasons.value = false;
    }
}

async function confirmDelete() {
    deleting.value = true;
    try {
        const res = await deleteaccount(selectedDeleteReason.value, "web");
        if (res?.status) {
            userCookie.value = null;
            navigateTo("/");
        }
    } catch { } finally {
        deleting.value = false;
    }
}

function cancelDelete() {
    showDeletePopup.value = false;
    selectedDeleteReason.value = "";
}

const firstName = ref("");
const lastName = ref("");
const phone = ref("");
const countries = ref([]);
const areas = ref([]);
const cities = ref([]);
const selectedCountry = ref("");
const selectedArea = ref("");
const selectedCity = ref("");

onMounted(() => {
    if (user.value) {
        firstName.value = user.value.first_name || "";
        lastName.value = user.value.last_name || "";
        phone.value = user.value.phone || "";
        selectedArea.value = user.area_id;
        selectedCity.value = user.city_id;
    }
});

function startEdit() {
    editing.value = true;
    if (user.value) {
        firstName.value = user.value.first_name || "";
        lastName.value = user.value.last_name || "";
    }
    selectedCountry.value = "";
    selectedArea.value = "";
    selectedCity.value = "";
    loadCountries();
}

async function loadCountries() {
    try {
        const res = await getCountries();
        countries.value = res?.data ?? [];
    } catch { }
}

async function loadAreas() {
    if (!selectedCountry.value) return;
    areas.value = [];
    selectedArea.value = "";
    try {
        const res = await getAreasByCountry(selectedCountry.value);
        areas.value = res?.data ?? [];
    } catch { }
}

async function loadCities() {
    if (!selectedArea.value) return;
    cities.value = [];
    selectedCity.value = "";
    try {
        const res = await getCitiesByArea(selectedArea.value);
        cities.value = res?.data ?? [];
    } catch { }
}

async function saveProfile() {
    saving.value = true;
    try {
        const res = await editeProfile({
            first_name: firstName.value,
            last_name: lastName.value,
            area_id: selectedArea.value,
            city_id: selectedCity.value,
        });
        if (res?.status) {
            if (res?.data?.user) {
                userCookie.value = res.data.user;
            }
            editing.value = false;
        }
    } catch { } finally {
        saving.value = false;
    }
}
</script>

<template>
    <div class="personal-information">
        <ProfileLinksBar />
        <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6">

                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-2xl font-semibold capitalize">
                        personal Information
                    </h1>

                </div>

                <form>
                    <div class="space-y-6">

                        <!-- First & Last Name -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="flex flex-col">
                                <label class="mb-2 text-sm font-medium">
                                    First Name
                                </label>
                                <input v-model="firstName" type="text" placeholder="Your First Name"
                                    :disabled="!editing"
                                    
                                    class="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                            </div>

                            <div class="flex flex-col">
                                <label class="mb-2 text-sm font-medium">
                                    Last Name
                                </label>
                                <input v-model="lastName" type="text" placeholder="Your Last Name" :disabled="!editing"
                                    class="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                            </div>
                        </div>

                        <!-- Phone Number -->
                        <div>
                            <div class="flex flex-col">
                                <label class="mb-2 text-sm font-medium">
                                    Phone Number
                                </label>
                                <input type="text" placeholder="+966 500000000" :value="user?.phone || ''" disabled
                                    class="border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 cursor-not-allowed" />
                            </div>
                        </div>

                        <!-- Country / Area / City -->
                        <template v-if="editing">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div class="flex flex-col">
                                    <label class="mb-2 text-sm font-medium">Country</label>
                                    <select v-model="selectedCountry" @change="loadAreas"
                                        class="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500">
                                        <option value="">Select Country</option>
                                        <option v-for="c in countries" :key="c.id" :value="c.id">{{ c.title }}</option>
                                    </select>
                                </div>

                                <div class="flex flex-col">
                                    <label class="mb-2 text-sm font-medium">Area</label>
                                    <select v-model="selectedArea" @change="loadCities"
                                        class="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500">
                                        <option value="">Select Area</option>
                                        <option v-for="a in areas" :key="a.id" :value="a.id">{{ a.title }}</option>
                                    </select>
                                </div>

                                <div class="flex flex-col">
                                    <label class="mb-2 text-sm font-medium">City</label>
                                    <select v-model="selectedCity"
                                        class="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500">
                                        <option value="">Select City</option>
                                        <option v-for="ci in cities" :key="ci.id" :value="ci.id">{{ ci.title }}</option>
                                    </select>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="flex flex-col">
                                    <label class="mb-2 text-sm font-medium">Area</label>
                                    <input type="text" :value="user?.area?.title || ''" disabled
                                        class="border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 cursor-not-allowed" />
                                </div>
                                <div class="flex flex-col">
                                    <label class="mb-2 text-sm font-medium">City</label>
                                    <input type="text" :value="user?.city?.title || ''" disabled
                                        class="border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 cursor-not-allowed" />
                                </div>
                            </div>
                        </template>

                        <!-- Save Button -->
                        <button v-if="editing" type="button" @click="saveProfile" :disabled="saving"
                            class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            <span v-if="saving"
                                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            {{ saving ? "Saving..." : "Save" }}
                        </button>

                        <!-- Action Buttons -->
                        <div class="flex flex-col gap-3 pt-4 border-t border-gray-200">
                            <button v-if="!editing" type="button" @click="startEdit"
                                class="w-full bg-gray-100 hover:bg-yellow-200 text-gray-700 font-medium px-8 py-3 rounded-full transition">
                                Edit Profile
                            </button>

                            <button type="button" @click="openLogoutPopup"
                                class="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium px-8 py-3 rounded-full transition">
                                LogOut
                            </button>

                            <button type="button" @click="openDeletePopup"
                                class="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium px-8 py-3 rounded-full transition">
                                Delete Account
                            </button>
                        </div>

                    </div>
                </form>

            </div>
        </div>
    </div>

    <!-- Logout Confirmation Popup -->
    <Teleport to="body">
        <div v-if="showLogoutPopup" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div class="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
                <h2 class="text-xl font-bold text-gray-800 mb-4">Reason for Logout</h2>

                <div v-if="loadingReasons" class="flex justify-center py-6">
                    <span class="w-6 h-6 border-2 border-main-color border-t-transparent rounded-full animate-spin"></span>
                </div>

                <div v-else class="space-y-3 mb-6">
                    <label v-for="reason in deactivatedReasons" :key="reason.id"
                        class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition"
                        :class="selectedReason === reason.id ? 'border-main-color bg-main-color/10' : 'border-gray-200 hover:border-gray-300'">
                        <input type="radio" :value="reason.id" v-model="selectedReason"
                            class="accent-main-color" />
                        <span class="text-sm text-gray-700">{{ reason.title }}</span>
                    </label>
                </div>

                <div class="flex gap-3">
                    <button @click="confirmLogout" :disabled="loggingOut || !selectedReason"
                        class="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        <span v-if="loggingOut"
                            class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        {{ loggingOut ? "Logging out..." : "Yes, I'm sure" }}
                    </button>
                    <button @click="cancelLogout" :disabled="loggingOut"
                        class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition disabled:opacity-50">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </Teleport>

    <!-- Delete Account Confirmation Popup -->
    <Teleport to="body">
        <div v-if="showDeletePopup" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div class="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
                <h2 class="text-xl font-bold text-gray-800 mb-4">Reason for Deleting Account</h2>

                <div v-if="loadingDeleteReasons" class="flex justify-center py-6">
                    <span class="w-6 h-6 border-2 border-main-color border-t-transparent rounded-full animate-spin"></span>
                </div>

                <div v-else class="space-y-3 mb-6">
                    <label v-for="reason in deleteReasons" :key="reason.id"
                        class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition"
                        :class="selectedDeleteReason === reason.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'">
                        <input type="radio" :value="reason.id" v-model="selectedDeleteReason"
                            class="accent-red-500" />
                        <span class="text-sm text-gray-700">{{ reason.title }}</span>
                    </label>
                </div>

                <div class="flex gap-3">
                    <button @click="confirmDelete" :disabled="deleting || !selectedDeleteReason"
                        class="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        <span v-if="deleting"
                            class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        {{ deleting ? "Deleting..." : "Yes, I'm sure" }}
                    </button>
                    <button @click="cancelDelete" :disabled="deleting"
                        class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition disabled:opacity-50">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>