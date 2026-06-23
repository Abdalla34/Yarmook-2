<script setup>
const token = useCookie("token");
const userCookie = useCookie("user", { maxAge: 365 * 24 * 60 * 60 });
const { getCountries, getAreasByCountry, getCitiesByArea } = useGlobalApi();
const { editeProfile } = useUserinformation();

const user = computed(() => {
    if (!userCookie.value) return null;
    const data = typeof userCookie.value === "string" ? JSON.parse(userCookie.value) : userCookie.value;
    return data;
});

const isLoggedIn = computed(() => !!token.value);
const editing = ref(false);

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
    firstName.value = "";
    lastName.value = "";
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
    try {
        await editeProfile({
            first_name: firstName.value,
            last_name: lastName.value,
            area_id: selectedArea.value,
            city_id: selectedCity.value,
        });
        // user.value = res.data.user;
        selectedArea.value = res.data.user.area_id;
        selectedCity.value = res.data.user.city_id;
        editing.value = false;
    } catch { }
}
</script>

<template>
    <div class="personal-information">
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
                        <button v-if="editing" type="button" @click="saveProfile"
                            class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full transition">
                            Save
                        </button>

                        <!-- Action Buttons -->
                        <div class="flex flex-col gap-3 pt-4 border-t border-gray-200">
                            <button v-if="!editing" type="button" @click="startEdit"
                                class="w-full bg-gray-100 hover:bg-yellow-200 text-gray-700 font-medium px-8 py-3 rounded-full transition">
                                Edit Profile
                            </button>

                            <button type="button"
                                class="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium px-8 py-3 rounded-full transition">
                                LogOut
                            </button>

                            <button type="button"
                                class="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium px-8 py-3 rounded-full transition">
                                Delete Account
                            </button>
                        </div>

                    </div>
                </form>

            </div>
        </div>
    </div>
</template>