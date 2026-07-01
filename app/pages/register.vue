<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";

const route = useRoute();
// const router = useRouter();
const { token, getCountries, getAreasByCountry, getCitiesByArea, logOrRegister } = useGlobalApi();

const phone = route.query.phone || "";
const phoneOtp = route.query.otp_code || "";
const loading = ref(false);
const user =  useCookie("user", { maxAge: 365 * 24 * 60 * 60 });

const countriesId = ref(null)
const areas = ref([]);
const cities = ref([]);
const selectedArea = ref("");
const selectedCity = ref("");


function required(value) {
    if (!value || !value.trim()) return "This field is required";
    return true;
}

onMounted(async () => {
    try {
        const res = await getCountries();
        const id = res?.data?.[0]?.id;
        if (id) {
            countriesId.value = id;
            const areaRes = await getAreasByCountry(id);
            areas.value = areaRes?.data ?? [];
        }
    } catch {
        console.error("Failed to load countries");
    }
});

watch(selectedArea, async (id) => {
    cities.value = [];
    if (!id) return;
    try {
        const res = await getCitiesByArea(id);
        cities.value = res?.data ?? [];
    } catch {
        console.error("Failed to load cities");
    }
});

async function onSubmit(values) {
    loading.value = true;
    try {
        const res = await logOrRegister({
            first_name: values.first_name,
            last_name: values.last_name,
            area_id: selectedArea.value,
            city_id: selectedCity.value,
            otp_code: phoneOtp,
            phone,
        });
        if (res?.status === true) {
            token.value = res?.data?.token;
            user.value = JSON.stringify(res.data.user);
        }
        navigateTo('/add-car')
    } catch {
        console.error("Registration failed");
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="register-page">
        <div class="container mx-auto px-4">
            <div class="md:w-[70%] mx-auto mt-12">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-bold text-start mb-6 uppercase">personial information</h2>
                    <Form @submit="onSubmit">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                <Field name="first_name" :rules="required" placeholder="First Name"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" />
                                <ErrorMessage name="first_name" class="text-red-500 text-sm mt-1 block" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                <Field name="last_name" :rules="required" placeholder="Last Name"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" />
                                <ErrorMessage name="last_name" class="text-red-500 text-sm mt-1 block" />
                            </div>
                        </div>

                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <span
                                    class="bg-gray-100 px-4 py-3 text-gray-700 font-medium border-r border-gray-300">+966</span>
                                <span class="bg-gray-100 px-3 py-3 text-gray-400 border-r border-gray-300">┃</span>
                                <Field name="phone" type="tel" :rules="required" :model-value="phone"
                                    class="w-full px-4 py-3 outline-none bg-gray-50" readonly />
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Area</label>
                                <select v-model="selectedArea"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white">
                                    <option value="">Select Area</option>
                                    <option v-for="a in areas" :key="a.id" :value="a.id">{{ a.title }}</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                                <select v-model="selectedCity"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white">
                                    <option value="">Select City</option>
                                    <option v-for="ci in cities" :key="ci.id" :value="ci.id">{{ ci.title }}</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" :disabled="loading"
                            class="w-full  bg-main-color text-black py-3 rounded-lg mt-6 font-bold transition disabled:opacity-50">
                            {{ loading ? "Submitting..." : "Register" }}
                        </button>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>