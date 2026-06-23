<script setup>
const { PointsUser, RedeemPoints, TransferPoints } = useUserinformation()

const loading = ref(true)
const pointsData = ref(null)
const activeTab = ref('earned')

const showActionSheet = ref(false)
const showRedeemModal = ref(false)
const showTransferModal = ref(false)

const redeemAmount = ref('')
const loadingRedeem = ref(false)

const transferPhone = ref('')
const transferPoints = ref('')
const loadingTransfer = ref(false)

const redeemMsg = ref('')
const redeemMsgType = ref('success')
const transferMsg = ref('')
const transferMsgType = ref('success')

function showRedeemMessage(text, type = 'success') {
    redeemMsg.value = text
    redeemMsgType.value = type
}
function showTransferMessage(text, type = 'success') {
    transferMsg.value = text
    transferMsgType.value = type
}

const pointsBalance = computed(() => pointsData.value?.current_points_int ?? 0)
const exampleRate = computed(() => pointsData.value?.example_rate ?? { points: 100, amount: 1 })
const transferInfo = computed(() => pointsData.value?.transfer_info ?? {})
const transactions = computed(() => pointsData.value?.transactions?.items ?? [])

const filteredTransactions = computed(() => {
    const items = transactions.value
    if (activeTab.value === 'earned') return items.filter(t => t.type === 'credit')
    if (activeTab.value === 'redeem') return items.filter(t => t.type === 'debit' && t.type_value?.toLowerCase().includes('redeem'))
    return items.filter(t => t.type === 'debit' && t.type_value?.toLowerCase().includes('expire'))
})

async function fetchPoints() {
    loading.value = true
    try {
        const res = await PointsUser()
        if (res?.status) {
            pointsData.value = res.data
        }
    } catch {
    } finally {
        loading.value = false
    }
}

async function handleRedeem() {
    const minPoints = exampleRate.value.points ?? 1000
    if (!redeemAmount.value || Number(redeemAmount.value) < minPoints) return
    loadingRedeem.value = true
    redeemMsg.value = ''
    try {
        const res = await RedeemPoints(redeemAmount.value)
        if (res?.status) {
            showRedeemModal.value = false
            redeemAmount.value = ''
            redeemMsg.value = ''
            await fetchPoints()
        } else {
            showRedeemMessage(res.message ?? res.msg ?? 'Redeem failed', 'error')
        }
    } catch (e) {
        showRedeemMessage(e?.data?.message ?? e?.message ?? 'Something went wrong', 'error')
    } finally {
        loadingRedeem.value = false
    }
}

async function handleTransfer() {
    if (!transferPhone.value || !transferPoints.value) return
    loadingTransfer.value = true
    transferMsg.value = ''
    try {
        const res = await TransferPoints(transferPoints.value, transferPhone.value)
        if (res?.status) {
            showTransferModal.value = false
            transferPhone.value = ''
            transferPoints.value = ''
            transferMsg.value = ''
            await fetchPoints()
        } else {
            showTransferMessage(res.message ?? res.msg ?? 'Transfer failed', 'error')
        }
    } catch (e) {
        showTransferMessage(e?.data?.message ?? e?.message ?? 'Something went wrong', 'error')
    } finally {
        loadingTransfer.value = false
    }
}

function formatDate(dateStr) {
    if (!dateStr) return ''
    try {
        const d = new Date(dateStr)
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
        return dateStr
    }
}

function pointsSign(item) {
    return item.type === 'credit' ? '+' : ''
}

onMounted(() => {
    fetchPoints()
})
</script>

<template>
    <ProfileLinksBar />
    <div class="points">
        <div class="container mx-auto px-4">
            <div class="flex justify-center">
                <div class="w-full max-w-4xl">

                    <!-- Current Points Card -->
                    <div class="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm mb-6">
                        <div class="text-center">
                            <h4 class="text-3xl font-bold text-gray-900">{{ pointsBalance }}</h4>
                            <p class="text-sm text-gray-500 capitalize mt-1">Current Point</p>
                        </div>
                        <button @click="showActionSheet = true"
                            class="cursor-pointer rounded-full border border-gray-200 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                            Redeem
                        </button>
                    </div>

                    <!-- Tabs -->
                    <div class="mb-6">
                        <ul class="flex items-center justify-center gap-8 border-b border-gray-200 pb-3 capitalize">
                            <li @click="activeTab = 'earned'"
                                :class="['cursor-pointer pb-2 font-semibold transition', activeTab === 'earned' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black']">
                                Earned
                            </li>
                            <li @click="activeTab = 'redeem'"
                                :class="['cursor-pointer pb-2 font-semibold transition', activeTab === 'redeem' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black']">
                                Redeem
                            </li>
                            <li @click="activeTab = 'expired'"
                                :class="['cursor-pointer pb-2 font-semibold transition', activeTab === 'expired' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black']">
                                Expired
                            </li>
                        </ul>
                    </div>

                    <!-- Loading -->
                    <div v-if="loading" class="space-y-4">
                        <div v-for="i in 3" :key="i" class="animate-pulse rounded-2xl bg-white p-5 shadow-sm">
                            <div class="flex items-center gap-4">
                                <div class="h-12 w-12 rounded-full bg-gray-200" />
                                <div class="flex-1 space-y-2">
                                    <div class="h-4 w-32 rounded bg-gray-200" />
                                    <div class="h-3 w-24 rounded bg-gray-200" />
                                </div>
                                <div class="h-5 w-16 rounded bg-gray-200" />
                            </div>
                        </div>
                    </div>

                    <!-- Transactions -->
                    <template v-else>
                        <div v-if="filteredTransactions.length === 0" class="text-center py-12">
                            <p class="text-gray-500">There are no points yet</p>
                        </div>
                        <div v-for="item in filteredTransactions" :key="item.id"
                            class="mb-4 flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm">
                            <div class="flex items-center gap-4">
                                <div
                                    :class="['flex h-12 w-12 items-center justify-center rounded-full', item.type === 'credit' ? 'bg-green-100' : activeTab === 'expired' ? 'bg-red-100' : 'bg-yellow-100']">
                                    <svg v-if="item.type === 'credit'" width="16" height="16" viewBox="0 0 16 16"
                                        fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M14.6673 6.7487H9.25065V1.33203C9.25065 0.648698 8.68398 0.0820312 8.00065 0.0820312C7.31732 0.0820312 6.75065 0.648698 6.75065 1.33203V6.7487H1.33398C0.650651 6.7487 0.0839844 7.31536 0.0839844 7.9987C0.0839844 8.68203 0.650651 9.2487 1.33398 9.2487H6.75065V14.6654C6.75065 15.3487 7.31732 15.9154 8.00065 15.9154C8.68398 15.9154 9.25065 15.3487 9.25065 14.6654V9.2487H14.6673C15.3507 9.2487 15.9173 8.68203 15.9173 7.9987C15.9173 7.31536 15.3507 6.7487 14.6673 6.7487Z"
                                            fill="#41C980" />
                                    </svg>
                                    <svg v-else width="24" height="4" viewBox="0 0 24 4" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M22 3.25H2C1.31667 3.25 0.75 2.68333 0.75 2C0.75 1.31667 1.31667 0.75 2 0.75H22C22.6833 0.75 23.25 1.31667 23.25 2C23.25 2.68333 22.6833 3.25 22 3.25Z"
                                            fill="#FDD800" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 class="font-semibold text-gray-900">{{ item.type_value ?? (item.type ===
                                        'credit' ? 'Earned Points' : 'Points Used') }}</h4>
                                    <p class="text-sm text-gray-500">{{ formatDate(item.created_at ?? item.date) }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <span
                                    :class="['text-xl font-bold', item.type === 'credit' ? 'text-green-600' : 'text-gray-900']">{{
                                        pointsSign(item) }}{{ item.points?.replace(/[+\-]/g, '') ?? item.points }}</span>
                                <span class="text-sm text-gray-500">Points</span>
                            </div>
                        </div>
                    </template>



                </div>
            </div>

            <!-- Action Sheet -->
            <Teleport to="body">
                <div v-if="showActionSheet" @click.self="showActionSheet = false"
                    class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
                    <div class="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl">
                        <div class="mb-5 flex items-center justify-between">
                            <h2 class="text-lg font-semibold">Send Points</h2>
                            <button @click="showActionSheet = false"
                                class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div class="space-y-3">
                            <button @click="showActionSheet = false; showRedeemModal = true"
                                class="w-full rounded-2xl bg-black py-4 font-medium text-white transition hover:opacity-80">
                                Redeem Points
                            </button>
                            <button @click="showActionSheet = false; showTransferModal = true"
                                class="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 py-4 font-medium text-gray-700 transition hover:bg-gray-100">
                                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                </svg>
                                Send Points
                            </button>
                        </div>
                    </div>
                </div>
            </Teleport>

            <!-- Redeem Modal -->
            <Teleport to="body">
                <div v-if="showRedeemModal" @click.self="showRedeemModal = false"
                    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <div class="mb-5 flex items-center justify-between">
                            <h2 class="text-xl font-semibold text-gray-900">Redeem Points</h2>
                            <button @click="showRedeemModal = false"
                                class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
                                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div>
                            <input v-model="redeemAmount" type="number" :placeholder="String(exampleRate.points)"
                                class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black" />
                            <p class="mt-2 text-sm text-gray-500">Notes: Minimum points = {{ exampleRate.points }}
                                points</p>
                        </div>
                        <div class="mt-5 flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                            <div class="text-center">
                                <h6 class="text-xl font-bold text-gray-900">{{ redeemAmount || 0 }}</h6>
                                <p class="text-sm text-gray-500">Point</p>
                            </div>
                            <div class="text-center">
                                <div class="mb-1 text-2xl text-gray-400">&#8652;</div>
                                <p class="text-sm text-gray-500">Redeem To</p>
                            </div>
                            <div class="text-center">
                                <h6 class="text-xl font-bold text-gray-900">{{ Math.floor(Number(redeemAmount || 0) /
                                    exampleRate.points * exampleRate.amount) }}</h6>
                                <p class="text-sm uppercase text-gray-500">SAR</p>
                            </div>
                        </div>
                        <p v-if="redeemMsg" :class="['mt-3 text-sm text-center', redeemMsgType === 'success' ? 'text-green-600' : 'text-red-600']">
                            {{ redeemMsg }}
                        </p>
                        <button @click="handleRedeem"
                            :disabled="loadingRedeem || !redeemAmount || Number(redeemAmount) < exampleRate.points"
                            class="mt-6 w-full rounded-2xl bg-black py-4 font-medium text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            <span v-if="loadingRedeem"
                                class="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            {{ loadingRedeem ? 'Redeeming...' : 'Redeem Points' }}
                        </button>
                    </div>
                </div>
            </Teleport>

            <!-- Transfer Points Modal -->
            <Teleport to="body">
                <div v-if="showTransferModal" @click.self="showTransferModal = false"
                    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <div class="mb-5 flex items-center justify-between">
                            <h2 class="text-xl font-semibold text-gray-900">Send Points</h2>
                            <button @click="showTransferModal = false"
                                class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition">
                                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <label class="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
                                <input v-model="transferPhone" type="text" placeholder="Number with dial code like +966"
                                    class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black" />
                            </div>
                            <div>
                                <label class="mb-2 block text-sm font-medium text-gray-700">Points</label>
                                <input v-model="transferPoints" type="number"
                                    :placeholder="transferInfo?.min_transfer_points ?? '100'"
                                    class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black" />
                            </div>
                            <div class="rounded-xl bg-amber-50 p-3">
                                <p class="text-sm text-amber-700">Note: Please make sure this phone number is registered
                                    in the
                                    Yarmook app.</p>
                            </div>
                        </div>
                        <p v-if="transferMsg" :class="['mt-3 text-sm text-center', transferMsgType === 'success' ? 'text-green-600' : 'text-red-600']">
                            {{ transferMsg }}
                        </p>
                        <button @click="handleTransfer" :disabled="loadingTransfer || !transferPhone || !transferPoints"
                            class="mt-6 w-full rounded-2xl bg-black py-4 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            <span v-if="loadingTransfer"
                                class="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            {{ loadingTransfer ? 'Sending...' : 'Send Points' }}
                        </button>
                    </div>
                </div>
            </Teleport>
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