<script setup>
const { getWallte, CashbackWallet } = useUserinformation()

const loading = ref(true)
const walletData = ref(null)
const showDepositModal = ref(false)

const balance = computed(() => walletData.value?.balance ?? 0)
const transactions = computed(() => {
    if (!walletData.value) return []
    if (Array.isArray(walletData.value)) return walletData.value
    if (Array.isArray(walletData.value.data)) return walletData.value.data
    if (Array.isArray(walletData.value.transactions)) return walletData.value.transactions
    if (Array.isArray(walletData.value.transactions?.items)) return walletData.value.transactions.items
    return []
})
const currentPage = ref(1)
const totalPages = ref(1)
const total = ref(0)
const hasPrev = computed(() => currentPage.value > 1)
const hasNext = computed(() => currentPage.value < totalPages.value)

const depositAmount = ref('')
const cashbackData = ref(null)
const cashbackLoading = ref(false)
let cashbackTimer = null

const amountNum = computed(() => Number(depositAmount.value) || 0)
const cashbackAmount = computed(() => Number(cashbackData.value?.cashback ?? cashbackData.value?.amount ?? 0))
const totalAmount = computed(() => amountNum.value + cashbackAmount.value)

watch(depositAmount, () => {
    if (cashbackTimer) clearTimeout(cashbackTimer)
    cashbackData.value = null
    if (!depositAmount.value || amountNum.value <= 0) return
    cashbackTimer = setTimeout(async () => {
        cashbackLoading.value = true
        try {
            const res = await CashbackWallet(depositAmount.value)
            if (res?.status) {
                cashbackData.value = res.data
            }
        } catch {
        } finally {
            cashbackLoading.value = false
        }
    }, 1000)
})

async function fetchWallet(page = 1) {
    loading.value = true
    try {
        const res = await getWallte(page)
        if (res?.status) {
            walletData.value = res.data
            currentPage.value = res.data?.current_page ?? 1
            totalPages.value = res.data?.total_pages ?? 1
            total.value = res.data?.total ?? 0
        }
    } catch (e) {
    } finally {
        loading.value = false
    }
}

function prevPage() {
    if (hasPrev.value) fetchWallet(currentPage.value - 1)
}

function nextPage() {
    if (hasNext.value) fetchWallet(currentPage.value + 1)
}

function formatDate(dateStr) {
    if (!dateStr) return ''
    try {
        const d = new Date(dateStr)
        return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
        return dateStr
    }
}

onMounted(() => {
    fetchWallet()
})
</script>

<template>
    <ProfileLinksBar />
    <div class="wallet-page">
        <div class="min-h-screen bg-gray-50 py-8">
            <div class="mx-auto max-w-4xl px-4">

                <!-- Wallet Header -->
                <div class="mb-6 rounded-3xl bg-white p-6 shadow-sm">
                    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div class="flex flex-wrap items-center gap-3">
                            <h1 class="text-2xl font-bold text-gray-900">Wallet</h1>
                            <button @click="showDepositModal = true"
                                class="rounded-xl bg-black px-5 py-2 text-sm font-medium text-white transition hover:opacity-90">
                                Deposit Money
                            </button>
                        </div>
                        <div class="text-center md:text-right">
                            <p class="text-sm text-gray-500">Current Balance</p>
                            <div class="mt-1 flex items-center justify-center gap-2 md:justify-end">
                                <span class="text-2xl font-bold text-gray-900">{{ Number(balance).toLocaleString() }}</span>
                                <span class="text-sm uppercase text-gray-500">SAR</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Loading -->
                <div v-if="loading" class="space-y-4">
                    <div v-for="i in 3" :key="i" class="animate-pulse rounded-3xl bg-white p-5 shadow-sm">
                        <div class="flex items-center gap-4">
                            <div class="h-12 w-12 rounded-full bg-gray-200" />
                            <div class="flex-1 space-y-2">
                                <div class="h-4 w-32 rounded bg-gray-200" />
                                <div class="h-3 w-48 rounded bg-gray-200" />
                            </div>
                            <div class="h-5 w-16 rounded bg-gray-200" />
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else-if="transactions.length === 0" class="rounded-3xl bg-white p-10 text-center shadow-sm">
                    <img src="/empty.png" alt="Empty" class="mx-auto mb-4 h-40 w-auto object-contain" />
                    <h3 class="text-lg font-semibold text-gray-900">No Transactions Yet</h3>
                    <p class="mt-1 text-sm text-gray-500">Your wallet transactions will appear here.</p>
                </div>

                <!-- Transactions -->
                <template v-else>
                    <div v-for="t in transactions" :key="t.id"
                        class="mb-4 rounded-3xl bg-white p-5 shadow-sm">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div :class="['flex h-12 w-12 items-center justify-center rounded-full', (t.type === 'deposit' || t.type === 'credit') ? 'bg-green-100' : 'bg-red-100']">
                                    <svg v-if="t.type === 'deposit' || t.type === 'credit'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M14.6673 6.75065H9.25065V1.33398C9.25065 0.650651 8.68398 0.0820312 8.00065 0.0820312C7.31732 0.0820312 6.75065 0.650651 6.75065 1.33398V6.75065H1.33398C0.650651 6.75065 0.0839844 7.31536 0.0839844 7.9987C0.0839844 8.68203 0.650651 9.2487 1.33398 9.2487H6.75065V14.6654C6.75065 15.3487 7.31732 15.9154 8.00065 15.9154C8.68398 15.9154 9.25065 15.3487 9.25065 14.6654V9.2487H14.6673C15.3507 9.2487 15.9173 8.68203 15.9173 7.9987C15.9173 7.31536 15.3507 6.7487 14.6673 6.7487Z" fill="#41C980" />
                                    </svg>
                                    <svg v-else width="16" height="4" viewBox="0 0 16 4" fill="none">
                                        <path d="M14.6673 3.25H1.33398C0.650651 3.25 0.0839844 2.68333 0.0839844 2C0.0839844 1.31667 0.650651 0.75 1.33398 0.75H14.6673C15.3507 0.75 15.9173 1.31667 15.9173 2C15.9173 2.68333 15.3507 3.25 14.6673 3.25Z" fill="#EB5757" />
                                    </svg>
                                </div>
                                <div>
                                    <h5 class="font-semibold text-gray-900 capitalize">{{ t.type_value ?? t.type ?? '' }}</h5>
                                    <p class="text-sm text-gray-500">{{ formatDate(t.created_at ?? t.date) }}</p>
                                    <p v-if="t.description" class="mt-1 text-sm font-semibold text-gray-700">{{ t.description }}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <span :class="['text-lg font-bold', (t.type === 'deposit' || t.type === 'credit') ? 'text-green-600' : 'text-red-600']">
                                    {{ (t.type === 'deposit' || t.type === 'credit') ? '+' : '-' }}{{ Math.abs(t.amount ?? t.points ?? 0) }}
                                </span>
                                <span class="ml-1 text-sm text-gray-500">SAR</span>
                            </div>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <div v-if="totalPages > 1" class="mt-8 flex items-center justify-center gap-4">
                        <button @click="prevPage" :disabled="!hasPrev"
                            class="rounded-xl border border-gray-200 px-5 py-2 transition hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
                            Prev
                        </button>
                        <span class="font-medium text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
                        <button @click="nextPage" :disabled="!hasNext"
                            class="rounded-xl border border-gray-200 px-5 py-2 transition hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
                            Next
                        </button>
                    </div>
                </template>

            </div>
        </div>

        <!-- Deposit Money Modal -->
        <Teleport to="body">
            <div v-if="showDepositModal" @click.self="showDepositModal = false" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                    <div class="mb-5 flex items-center justify-between">
                        <h3 class="text-xl font-bold text-gray-900">Deposit Amount</h3>
                        <button @click="showDepositModal = false" class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
                            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                    </div>

                    <input v-model="depositAmount" type="number" placeholder="Enter amount"
                        class="mb-4 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black" />

                    <label class="mb-4 flex cursor-pointer items-center gap-3">
                        <input type="checkbox" class="h-5 w-5 accent-black" />
                        <span class="text-sm font-medium text-gray-700">CashbackWallet</span>
                    </label>

                    <div class="rounded-2xl bg-gray-50 p-4">
                        <div class="mb-3 flex justify-between">
                            <span class="text-gray-600">Amount</span>
                            <span class="font-semibold">{{ amountNum }} SAR</span>
                        </div>
                        <div class="mb-3 flex justify-between">
                            <span class="text-gray-600">Cash Back</span>
                            <span v-if="cashbackLoading" class="text-sm text-gray-400">calculating...</span>
                            <span v-else class="font-semibold text-green-600">+{{ cashbackAmount }} SAR</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Expenses</span>
                            <span class="font-semibold">0 SAR</span>
                        </div>
                    </div>
                    <div class="mt-4 rounded-2xl bg-black p-4 text-center text-white">
                        <p class="text-sm opacity-80">Total Amount</p>
                        <h4 class="mt-1 text-2xl font-bold">{{ totalAmount }} <span class="uppercase text-sm text-gray-100">sar</span></h4>
                    </div>
                    <button class="mt-5 w-full rounded-2xl bg-black py-4 font-medium text-white transition hover:opacity-90">
                        Deposit Money
                    </button>
                </div>
            </div>
        </Teleport>
    </div>
</template>
