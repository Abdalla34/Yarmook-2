<template>
    <ProfileLinksBar :isLoggedIn="isLoggedIn" />
    <div class="container mx-auto px-4 py-8">
        <div class="w-full lg:w-2/3 mx-auto">

            <!-- Title -->
            <h1 class="mb-6 text-3xl font-bold capitalize text-gray-900">
                Memberships
            </h1>

            <!-- Loading -->
            <div v-if="loading" class="space-y-4">
                <div v-for="n in 3" :key="n"
                    class="rounded-2xl border border-gray-200 bg-white p-6 animate-pulse">
                    <div class="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>

            <!-- Car Selector -->
            <div v-if="cars.length > 1 && !loading" class="mb-6">
                <label class="text-sm font-medium text-gray-700 mb-2 block">Select Car</label>
                <select v-model="selectedCarId" @change="fetchMemberships"
                    class="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 bg-white">
                    <option v-for="car in cars" :key="car.id" :value="car.id">
                        {{ car?.brand?.title }} - {{ car?.car_type?.title }}
                    </option>
                </select>
            </div>

            <!-- Available Memberships -->
            <div v-if="memberships.length && !loading">
                <h2 class="mb-4 text-xl font-semibold text-gray-800">Available Memberships</h2>
                <div class="space-y-4">
                    <div v-for="m in memberships" :key="m.id"
                        class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition cursor-pointer">
                        <div class="flex items-start justify-between gap-4">
                            <div class="flex items-center gap-4">
                                <img v-if="selectedCar?.brand?.image" :src="selectedCar.brand.image"
                                    class="h-14 w-14 rounded-xl object-contain bg-gray-50 p-2 shrink-0" alt="">
                                <div>
                                    <h3 class="text-lg font-bold text-gray-900">{{ m.title || m.name }}</h3>
                                    <p class="mt-1 text-sm text-gray-500">{{ selectedCar?.brand?.title }} - {{ selectedCar?.car_type?.title }}</p>
                                </div>
                            </div>
                            <div class="shrink-0">
                                <span class="inline-flex items-center rounded-full bg-yellow-400 px-4 py-1.5 text-sm font-semibold text-black">
                                    {{ m.price }} SAR
                                </span>
                            </div>
                        </div>
                        <p class="mt-3 text-sm text-gray-600 leading-relaxed">{{ m.description }}</p>
                        <div class="mt-4 flex items-center gap-4 text-sm">
                            <span class="flex items-center gap-1 text-gray-500">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {{ m.duration || m.period }}
                            </span>
                            <span class="flex items-center gap-1 text-gray-500">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {{ m.price }} SAR
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty state -->
            <div v-if="!loading && !memberships.length"
                class="flex flex-col items-center justify-center py-16">
                <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                    <svg class="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">No memberships available</h3>
                <p class="text-gray-500 text-sm text-center max-w-xs">There are no memberships available at the moment.</p>
            </div>

        </div>
    </div>
</template>

<script setup>
const token = useCookie("token")
const isLoggedIn = computed(() => !!token.value)

const { memberShips, getSubscriptions } = useMember()
const { getMycars } = useCarServices()

const loading = ref(true)
const memberships = ref([])
const subscriptions = ref([])
const cars = ref([])
const selectedCarId = ref(null)

async function fetchMemberships() {
    loading.value = true
    try {
        const carId = selectedCarId.value || cars.value[0]?.id
        if (carId) {
            const res = await memberShips(carId)
            memberships.value = res?.data?.data ?? res?.data ?? []
        }
    } catch {
        memberships.value = []
    } finally {
        loading.value = false
    }
}

async function fetchSubscriptions() {
    try {
        const res = await getSubscriptions()
        subscriptions.value = res?.data?.data ?? res?.data ?? []
    } catch {
        subscriptions.value = []
    }
}

onMounted(async () => {
    try {
        const carRes = await getMycars()
        const items = carRes?.data?.data ?? carRes?.data ?? []
        cars.value = Array.isArray(items) ? items : []
        if (cars.value.length) {
            selectedCarId.value = cars.value[0].id
        }
    } catch {}
    await Promise.all([fetchMemberships(), fetchSubscriptions()])
})
</script>
e>