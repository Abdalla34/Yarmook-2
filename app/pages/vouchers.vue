<script setup>
const { availableVouchers, usedVouchers, expiredVouchers } = useUserinformation()

const loading = ref(false)
const activeTab = ref('available')
const vouchers = ref([])
const toastMessage = ref('')
const showToast = ref(false)
let toastTimer = null

const tabApis = {
    available: availableVouchers,
    used: usedVouchers,
    expired: expiredVouchers,
}

async function fetchVouchers() {
    loading.value = true
    try {
        const res = await tabApis[activeTab.value]()
        vouchers.value = res?.data ?? []
    } catch {
        vouchers.value = []
    } finally {
        loading.value = false
    }
}

function switchTab(tab) {
    if (tab === activeTab.value) return
    activeTab.value = tab
    fetchVouchers()
}

async function copyCode(code) {
    try {
        await navigator.clipboard.writeText(code)
        showToastMessage('Voucher copied successfully')
    } catch {
        showToastMessage('Failed to copy')
    }
}

function showToastMessage(msg) {
    toastMessage.value = msg
    showToast.value = true
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
        showToast.value = false
    }, 3000)
}

onMounted(() => {
    fetchVouchers()
})
</script>

<template>
    <ProfileLinksBar />
    <div class="vaouchers-page">
        <div class="min-h-screen bg-gray-50 py-8">
            <div class="mx-auto max-w-4xl px-4">

                <!-- Header -->
                <div class="mb-6 rounded-3xl bg-white p-6 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div class="text-center">
                            <h2 class="text-2xl font-bold text-gray-900">Vouchers</h2>
                            <p class="mt-1 text-sm text-gray-500">Available Coupons & Discounts</p>
                        </div>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="mb-6">
                    <ul class="flex items-center justify-center gap-8 border-b border-gray-200 pb-3">
                        <li @click="switchTab('available')" :class="['cursor-pointer pb-2 font-semibold transition', activeTab === 'available' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black']">
                            Available
                        </li>
                        <li @click="switchTab('used')" :class="['cursor-pointer pb-2 font-semibold transition', activeTab === 'used' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black']">
                            Used
                        </li>
                        <li @click="switchTab('expired')" :class="['cursor-pointer pb-2 font-semibold transition', activeTab === 'expired' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black']">
                            Expired
                        </li>
                    </ul>
                </div>

                <!-- Loading -->
                <div v-if="loading" class="space-y-4">
                    <div v-for="i in 3" :key="i" class="animate-pulse rounded-3xl bg-white p-5 shadow-sm">
                        <div class="h-5 w-40 rounded bg-gray-200 mb-3" />
                        <div class="h-4 w-72 rounded bg-gray-200 mb-4" />
                        <div class="flex justify-between">
                            <div class="h-10 w-28 rounded-xl bg-gray-200" />
                            <div class="h-4 w-24 rounded bg-gray-200" />
                        </div>
                    </div>
                </div>

                <!-- Vouchers -->
                <template v-else>
                    <div v-if="vouchers.length === 0" class="rounded-3xl bg-white p-10 text-center shadow-sm">
                        <img src="/empty.png" alt="Empty" class="mx-auto mb-4 h-40 w-auto object-contain" />
                        <h3 class="text-lg font-semibold text-gray-900">No Vouchers Found</h3>
                        <p class="mt-1 text-sm text-gray-500">There are no vouchers {{ activeTab }} yet.</p>
                    </div>

                    <div v-for="v in vouchers" :key="v.id"
                        :class="['mb-4 rounded-3xl bg-white p-5 shadow-sm', activeTab === 'expired' ? 'opacity-50' : '']">
                        <div>
                            <h4 class="mb-2 text-lg font-bold text-gray-900">{{ v.title ?? v.name ?? 'Voucher' }}</h4>
                            <p class="text-sm text-gray-500">{{ v.description ?? '' }}</p>
                        </div>

                        <div class="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <button v-if="activeTab === 'available'" @click="copyCode(v.code)"
                                class="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90">
                                Copy "{{ v.code }}"
                            </button>
                            <div v-else class="text-sm font-medium text-gray-400">{{ v.code ?? '' }}</div>

                            <div class="text-right">
                                <span class="text-xs uppercase text-gray-400">Expired At</span>
                                <p class="text-sm font-medium text-gray-600">{{ v.expires_at ?? v.expire_date ?? v.end_date ?? '-' }}</p>
                            </div>
                        </div>
                    </div>
                </template>

                <!-- Toast -->
                <Teleport to="body">
                    <Transition name="fade">
                        <div v-if="showToast"
                            class="fixed left-1/2 top-5 z-50 -translate-x-1/2 rounded-xl bg-green-500 px-5 py-3 text-white shadow-lg">
                            {{ toastMessage }}
                        </div>
                    </Transition>
                </Teleport>

            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
