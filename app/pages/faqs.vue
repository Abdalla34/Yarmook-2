<template>
    <ProfileLinksBar :isLoggedIn="isLoggedIn" />
    <div class="container mx-auto px-4 py-8">
        <div class="w-full lg:w-2/3 mx-auto">

            <!-- Breadcrumb -->
            <div class="mb-6 flex items-center gap-2 text-sm text-gray-500">
                <span @click="$router.push('/help')" class="cursor-pointer hover:text-yellow-500">←</span>
                <span>Help > FAQ</span>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="space-y-4">
                <div v-for="n in 5" :key="n"
                    class="rounded-2xl border border-gray-200 bg-white p-6 animate-pulse">
                    <div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div class="h-4 bg-gray-200 rounded w-full"></div>
                </div>
            </div>

            <!-- FAQ Items -->
            <div v-for="(faq, i) in faqs" :key="faq.id"
                @click="toggleFaq(i)"
                class="relative mb-4 cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:bg-gray-50 hover:shadow-md">
                <div class="relative z-10 flex items-center justify-between gap-4">

                    <div class="flex-1">
                        <h6 class="text-lg font-bold text-gray-900">
                            {{ faq.question }}
                        </h6>

                        <p v-show="openIndex === i" class="mt-3 text-gray-600 leading-7">
                            {{ faq.answer }}
                        </p>
                    </div>

                    <div class="flex h-8 w-8 items-center justify-center shrink-0">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none"
                            :class="['text-gray-500 transition-transform duration-300', openIndex === i ? 'rotate-180' : '']"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>

                </div>
            </div>

            <!-- Pagination -->
            <div v-if="lastPage > 1" class="mt-8 flex items-center justify-center gap-4">

                <button @click="prevPage" :disabled="currentPage <= 1"
                    class="rounded-full bg-yellow-400 px-6 py-2 font-medium text-black transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50">
                    Prev
                </button>

                <span class="text-gray-700 font-medium">
                    Page {{ currentPage }}
                </span>

                <button @click="nextPage" :disabled="currentPage >= lastPage"
                    class="rounded-full bg-yellow-400 px-6 py-2 font-medium text-black transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50">
                    Next
                </button>

            </div>

        </div>
    </div>
</template>

<script setup>
const token = useCookie("token")
const isLoggedIn = computed(() => !!token.value)

const { getFaqs } = useHelp()

const faqs = ref([])
const loading = ref(true)
const currentPage = ref(1)
const lastPage = ref(1)
const openIndex = ref(null)

async function fetchFaqs(page) {
    loading.value = true
    try {
        const res = await getFaqs(page)
        console.log('FAQ API response:', res)
        const items = res.data?.items ?? res.data ?? []
        faqs.value = Array.isArray(items) ? items : []
        currentPage.value = res.current_page ?? res.meta?.current_page ?? 1
        lastPage.value = res.last_page ?? res.meta?.last_page ?? 1
        openIndex.value = null
    } catch (e) {
        console.error('FAQ fetch error:', e)
        faqs.value = []
    } finally {
        loading.value = false
    }
}

function toggleFaq(i) {
    openIndex.value = openIndex.value === i ? null : i
}

function prevPage() {
    if (currentPage.value > 1) fetchFaqs(currentPage.value - 1)
}

function nextPage() {
    if (currentPage.value < lastPage.value) fetchFaqs(currentPage.value + 1)
}

onMounted(() => fetchFaqs(1))
</script>
