<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-4xl mx-auto px-4 py-6">
            <div v-if="isSkeleton" class="space-y-6">
                <div class="bg-white rounded-3xl shadow-sm border p-4 mb-6 animate-pulse">
                    <div class="flex items-center gap-4">
                        <div class="w-16 h-16 rounded-xl bg-gray-200"></div>
                        <div class="space-y-2 flex-1">
                            <div class="h-5 bg-gray-200 rounded w-1/2"></div>
                            <div class="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    </div>
                </div>
                <div class="animate-pulse">
                    <div class="w-full h-64 rounded-3xl bg-gray-200"></div>
                    <div class="flex gap-3 mt-4">
                        <div class="h-8 w-28 rounded-full bg-gray-200"></div>
                        <div class="h-8 w-28 rounded-full bg-gray-200"></div>
                    </div>
                    <div class="h-8 bg-gray-200 rounded w-3/4 mt-5"></div>
                </div>
                <div class="animate-pulse space-y-4">
                    <div class="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="border rounded-2xl p-4 h-24 bg-gray-100"></div>
                        <div class="border rounded-2xl p-4 h-24 bg-gray-100"></div>
                    </div>
                </div>
            </div>

            <template v-else>
                <div v-if="defaultCar" class="bg-white rounded-3xl shadow-sm border p-4 mb-6">
                    <div class="flex items-center gap-4">
                        <img :src="defaultCar.image || defaultCar.car_image || '/newLogo.png'" class="w-16 h-16 object-contain" alt="" @error="handleImgError" />
                        <div>
                            <h2 class="font-bold text-lg">{{ carName }}</h2>
                            <p class="text-sm text-gray-500 mt-1">🔒 Membership applies to this vehicle only</p>
                        </div>
                    </div>
                </div>

                <div>
                    <img v-if="memberDetails?.image" :src="memberDetails.image" class="w-full rounded-3xl h-48 sm:h-64 md:h-80 object-cover" alt="" @error="handleImgError" />
                    <div v-else class="w-full h-48 sm:h-64 md:h-80 rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <svg class="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>

                    <div v-if="inspectionCount || benefitsCount" class="flex gap-3 mt-4">
                        <div v-if="inspectionCount" class="bg-red-50 text-red-600 font-semibold rounded-full px-5 py-2">{{ inspectionCount }} Services</div>
                        <div v-if="benefitsCount" class="bg-green-50 text-green-600 font-semibold rounded-full px-5 py-2">{{ benefitsCount }} Benefits</div>
                    </div>

                    <h1 class="text-2xl font-bold mt-5">{{ memberDetails?.name || 'Membership' }}</h1>
                </div>

                <p v-if="memberDetails?.description" class="text-gray-600 mt-4 leading-relaxed">{{ memberDetails.description }}</p>

                <div class="flex justify-between items-center mt-6">
                    <div class="text-3xl font-bold text-red-600">{{ price }} SAR</div>
                    <span v-if="memberDetails?.discount_percentage" class="bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded-full">{{ memberDetails.discount_percentage }}% OFF</span>
                </div>

                <div v-if="memberDetails?.points || memberDetails?.warranty" class="flex gap-3 mt-4">
                    <div v-if="memberDetails?.points" class="bg-blue-50 text-blue-600 font-semibold rounded-full px-5 py-2 text-sm">{{ memberDetails.points.display }}</div>
                    <div v-if="memberDetails?.warranty" class="bg-purple-50 text-purple-600 font-semibold rounded-full px-5 py-2 text-sm">{{ memberDetails.warranty.display }}</div>
                </div>

                <h2 v-if="inspectionCount" class="font-bold text-lg mt-8 mb-4">Main Benefits</h2>
                <div v-if="inspectionCount" class="grid md:grid-cols-2 gap-4">
                    <div v-for="(service, index) in memberDetails.includes.inspection" :key="index" class="border rounded-2xl p-4 flex gap-4 items-center">
                        <img v-if="service.service_icon" :src="service.service_icon" class="w-14 h-14 rounded-xl object-cover" alt="" @error="handleImgError" />
                        <div v-else class="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <p class="font-semibold">{{ service.service_name }}</p>
                            <span class="text-sm text-gray-500">{{ service.quantity_per_period }} Times</span>
                        </div>
                    </div>
                </div>

                <h2 v-if="benefitsCount" class="font-bold text-lg mt-8 mb-4">Exclusive Benefits</h2>
                <div v-if="benefitsCount" class="grid md:grid-cols-2 gap-4">
                    <div v-for="(benefit, index) in memberDetails.exclusive_benefits" :key="index" class="border rounded-2xl p-4 flex gap-4 items-center">
                        <div class="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p class="font-semibold">{{ benefit.title || benefit.name }}</p>
                            <span class="text-sm text-gray-500">{{ benefit.description || '' }}</span>
                        </div>
                    </div>
                </div>

                <h2 class="font-bold text-lg mt-8 mb-4">Membership Details</h2>
                <div class="border rounded-3xl p-5 flex justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Subscription Type</p>
                        <p class="font-bold mt-1">{{ memberDetails?.plan_duration || 'Annually' }}</p>
                    </div>
                    <div class="text-center">
                        <p class="text-gray-500 text-sm">Fees</p>
                        <p class="font-bold mt-1">{{ price }} SAR</p>
                    </div>
                </div>

                <div v-if="memberDetails?.start_date || memberDetails?.end_date" class="border rounded-3xl p-5 flex justify-between mt-4">
                    <div v-if="memberDetails?.start_date">
                        <p class="text-gray-500 text-sm">Start Date</p>
                        <p class="font-bold mt-1">{{ memberDetails.start_date }}</p>
                    </div>
                    <div v-if="memberDetails?.end_date" class="text-center">
                        <p class="text-gray-500 text-sm">End Date</p>
                        <p class="font-bold mt-1">{{ memberDetails.end_date }}</p>
                    </div>
                </div>

                <h2 class="font-bold text-lg mt-8 mb-4">FAQ</h2>
                <div class="space-y-4">
                    <div v-for="(faq, index) in faqList" :key="faq.id || index" class="border rounded-2xl p-5 cursor-pointer" @click="toggleIcon(faq.id || index)">
                        <div class="flex justify-between items-center">
                            <h3 class="font-semibold">{{ faq.question }}</h3>
                            <svg class="w-5 h-5 transition-transform duration-300" :class="activeId === (faq.id || index) ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        <p v-if="activeId === (faq.id || index)" class="mt-3 text-sm text-gray-600">{{ faq.answer }}</p>
                    </div>
                </div>

                <div class="text-center mt-10">
                    <p class="font-bold text-lg">You can pay with</p>
                    <div class="flex flex-wrap justify-center gap-3 sm:gap-4 mt-5">
                        <img src="/visa.png" class="h-8 sm:h-10 object-contain" alt="Visa" @error="handleImgError" />
                        <img src="/masterCard.png" class="h-8 sm:h-10 object-contain" alt="MasterCard" @error="handleImgError" />
                        <img src="/tabby.png" class="h-8 sm:h-10 object-contain" alt="Tabby" @error="handleImgError" />
                        <img src="/tamara.png" class="h-8 sm:h-10 object-contain" alt="Tamara" @error="handleImgError" />
                    </div>
                </div>

                <hr class="my-8">

                <div class="text-center text-gray-500">
                    By submitting the membership you agree to
                    <span class="font-bold text-black">Terms and Conditions</span>
                </div>

                <hr class="my-8">

                <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div class="text-center sm:text-left">
                        <span class="text-2xl font-bold text-red-600">{{ price }} SAR</span>
                        <span v-if="memberDetails?.price_before_discount" class="text-gray-400 line-through ml-2">{{ memberDetails.price_before_discount }} SAR</span>
                    </div>
                    <button @click="navigateTo('/payment?membership_id=' + idMember)" class="bg-red-600 hover:bg-red-700 transition text-white px-8 py-3 rounded-full font-semibold w-full sm:w-auto">Buy It Now</button>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
const route = useRoute()
const { memberShipDetails, getCarSubscriptions } = useMember()

const isSkeleton = ref(true)
const mycars = ref([])
const defaultCar = ref(null)
const memberDetails = ref(null)
const activeId = ref(null)
const idMember = computed(() => route.params.id)

const faqList = ref([])

const carName = computed(() => {
    if (!defaultCar.value) return ''
    const brand = defaultCar.value.brand?.title || defaultCar.value.brand_name || ''
    const model = defaultCar.value.car_type?.title || defaultCar.value.model_name || ''
    return brand && model ? `${brand} - ${model}` : brand || model || ''
})

const inspectionCount = computed(() => memberDetails.value?.includes?.inspection?.length || 0)
const benefitsCount = computed(() => memberDetails.value?.exclusive_benefits?.length || 0)
const price = computed(() => memberDetails.value?.price_after_discount || '299')

async function fetchDetail() {
    isSkeleton.value = true
    memberDetails.value = null
    try {
        const res = await memberShipDetails(idMember.value)
        const data = res?.data?.data ?? res?.data ?? null
        memberDetails.value = data
        faqList.value = data?.faqs?.length ? data.faqs : [
            { question: 'How long does membership last?', answer: 'Membership lasts for one year from the date of purchase.' },
            { question: 'Can I transfer membership to another car?', answer: 'No, the membership is tied to the selected vehicle only.' }
        ]
    } catch (err) {
        console.error(err)
    } finally {
        isSkeleton.value = false
    }
}

async function fetchCars() {
    try {
        const res = await getCarSubscriptions(idMember.value)
        const cars = res?.data?.data ?? res?.data ?? []
        mycars.value = Array.isArray(cars) ? cars : []
        if (mycars.value.length) defaultCar.value = mycars.value[0]
    } catch {
        mycars.value = []
    }
}

function handleImgError(e) { e.target.style.display = 'none' }

function toggleIcon(index) { activeId.value = activeId.value === index ? null : index }

watch(() => route.params.id, (id) => { if (id) { fetchDetail(); fetchCars() } }, { immediate: true })
</script>
