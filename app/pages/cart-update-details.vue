<template>
    <div class="cart-page mt-0 lg:mt-3 min-h-screen py-8">
        <div class="min-h-screen">
            <div class="mx-auto max-w-6xl px-4">
                <div class="grid gap-6 lg:grid-cols-3">

                    <!-- Left Side -->
                    <div class="lg:col-span-2 min-w-0">
                        <h2 class="mb-6 text-xl font-semibold text-gray-800">
                            Order Details
                        </h2>

                        <div v-if="loading" class="space-y-4">
                            <div v-for="n in 3" :key="n"
                                class="bg-white rounded-2xl shadow-md p-4 animate-pulse flex items-center gap-4">
                                <div class="w-20 h-20 bg-gray-200 rounded-lg shrink-0"></div>
                                <div class="flex-1 space-y-2">
                                    <div class="h-5 w-3/4 bg-gray-200 rounded"></div>
                                    <div class="h-4 w-1/4 bg-gray-200 rounded"></div>
                                </div>
                                <div class="h-9 w-24 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>

                        <div v-else-if="error" class="text-center py-12">
                            <p class="text-red-500">{{ error }}</p>
                            <button @click="fetchCart"
                                class="mt-4 px-6 py-2 bg-main-color rounded-lg font-medium hover:opacity-90 transition">
                                Retry
                            </button>
                        </div>

                        <div v-else-if="!cartItems.length" class="text-center py-12">
                            <p class="text-gray-500 text-lg">Your cart is empty</p>
                            <NuxtLink to="/services"
                                class="inline-block mt-4 px-6 py-2 bg-main-color rounded-lg font-medium hover:opacity-90 transition">
                                Browse Services
                            </NuxtLink>
                        </div>

                        <div v-else class="space-y-2">
                            <div v-for="item in cartItems" :key="item.id"
                                class="bg-white p-4 sm:p-5 shadow-md rounded-3xl">
                                <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                    <div class="flex items-center gap-4 flex-1 min-w-0">
                                        <img :src="item.image" class="h-14 w-14 object-contain shrink-0" alt="">
                                        <div class="min-w-0">
                                            <h3 class="font-semibold text-gray-800 truncate">{{ item.title }}</h3>
                                            <p class="text-sm text-gray-500 capitalize">{{ item.type }}</p>
                                            <p class="text-lg font-semibold text-black-600 mt-1 truncate">{{ item.price
                                                ?? item.price_after_discount }} <span
                                                    class="text-gray-400 uppercase text-sm">sar</span></p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                                        <div class="flex items-center gap-1 border rounded-lg px-2 py-1">
                                            <button @click="updateQty(item, (item.qty ?? item.quantity ?? 1) - 1)"
                                                :disabled="(item.qty ?? item.quantity ?? 1) <= 1 || updatingQtyId === item.id"
                                                class="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black disabled:opacity-30 transition text-lg leading-none">-</button>
                                            <span v-if="updatingQtyId === item.id"
                                                class="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin block mx-auto"></span>
                                            <span v-else class="text-sm text-gray-500 min-w-[20px] text-center">{{
                                                item.qty ?? item.quantity ?? 1 }}</span>
                                            <button @click="updateQty(item, (item.qty ?? item.quantity ?? 1) + 1)"
                                                :disabled="item.type === 'service' || updatingQtyId === item.id"
                                                class="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black transition text-lg leading-none">+</button>
                                        </div>
                                        <button @click="removeItem(item)" :disabled="deletingId === item.id"
                                            class="text-red-500 hover:text-red-700 transition text-xl leading-none flex items-center justify-center w-6 h-6">
                                            <span v-if="deletingId === item.id"
                                                class="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin block"></span>
                                            <span v-else>&times;</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Side -->
                    <div v-if="cartItems.length">
                        <div class="rounded-3xl bg-white p-6 shadow-md box-design">

                            <h2 class="mb-5 text-lg font-semibold">
                                Order Details
                            </h2>

                            <div class="space-y-3 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Branch</span>
                                    <span class="font-medium">{{ branch.title || 'Not set' }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Reservation Date</span>
                                    <span class="font-medium">{{ reservationDate || 'Not set' }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Reservation Time</span>
                                    <span class="font-medium">{{ reservationTime || 'Not set' }}</span>
                                </div>
                            </div>

                            <hr class="my-6" />

                            <h2 class="mb-4 text-lg font-semibold">
                                Cost Details
                            </h2>

                            <div class="space-y-3 text-sm box-design">
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Total Order</span>
                                    <span>{{ cartTotal }} SAR</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-500">VAT</span>
                                    <span>{{ vatAmount }} SAR</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Final Amount</span>
                                    <span>{{ amountToPay }} SAR</span>
                                </div>
                            </div>

                            <hr class="my-6" />

                            <div class="mt-5 relative">
                                <input v-model="promoCode" type="text" placeholder="Promocode"
                                    class="w-full rounded-lg border border-gray-200 px-4 py-3 pr-20 outline-none focus:border-yellow-400"
                                    :disabled="!!voucherCode" />
                                <button v-if="!voucherCode" @click="applyPromoCode" :disabled="promoApplying || !promoCode.trim()"
                                    class="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-medium text-black transition hover:bg-yellow-500 disabled:opacity-50">
                                    <span v-if="promoApplying"
                                        class="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin inline-block"></span>
                                    <span v-else>Apply</span>
                                </button>
                                <button v-else @click="deletevoucher" :disabled="promoDeleting"
                                    class="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg bg-red-400 px-4 py-2 text-sm font-medium text-black transition hover:bg-red-500 disabled:opacity-50">
                                    <span v-if="promoDeleting"
                                        class="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin inline-block"></span>
                                    <span v-else>delete</span>
                                </button>
                            </div>
                            <div v-if="voucherCode" class="mt-2 text-sm text-green-600">Promo code "{{ voucherCode }}" applied</div>
                            <div v-if="promoError" class="mt-2 text-sm text-red-600">{{ promoError }}</div>

                            <div v-if="Number(balance) > 0" class="mt-4 rounded-xl border border-green-200 bg-white px-4 py-3">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                            <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <span class="text-sm font-medium text-gray-700">Use Wallet</span>
                                            <p class="flex items-center gap-1 text-xs text-gray-400">
                                                <span>Balance: {{ balance }} SAR</span>
                                                <span v-if="walletLoading" class="inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></span>
                                            </p>
                                        </div>
                                    </div>
                                    <button @click="handleWalletToggle" :disabled="walletLoading" type="button"
                                        :class="['relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none', useWalletActive ? 'bg-green-500' : 'bg-gray-200']">
                                        <span v-if="walletLoading"
                                            class="inline-block h-5 w-5 translate-x-0.5 transform rounded-full bg-white transition duration-200 ease-in-out animate-pulse"></span>
                                        <span v-else
                                            :class="['inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', useWalletActive ? 'translate-x-5' : 'translate-x-0.5']"></span>
                                    </button>
                                </div>
                                <div v-if="useWalletActive && Number(amountToPay) === 0 && Number(balance) > 0" class="mt-2 flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2">
                                    <svg class="h-3.5 w-3.5 shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <span class="text-xs font-medium text-green-700">Wallet covers the full amount</span>
                                </div>
                            </div>

                            <div class="mt-4 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                                <span class="font-semibold text-gray-700">
                                    Total Amount
                                </span>
                                <div>
                                    <span class="text-2xl font-bold">{{ amountToPay }}</span>
                                    <span class="text-xs text-gray-400">SAR</span>
                                </div>
                            </div>

                            <div class="mt-6 flex flex-col sm:flex-row gap-3">
                                <button @click="handleContinue" :disabled="checkoutLoading"
                                    class="flex-1 rounded-full bg-yellow-400 py-4 font-medium text-black transition hover:bg-yellow-500 disabled:opacity-50">
                                    {{ checkoutLoading ? 'Loading...' : 'Continue' }}
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <!-- Success Popup -->
    <Teleport to="body">
        <div v-if="showSuccessPopup"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div class="w-full max-w-sm animate-[fadeIn_0.2s_ease-out] rounded-2xl bg-white px-8 py-10 text-center shadow-2xl">
                <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <h3 class="mb-2 text-lg font-semibold text-gray-800">Payment Successful</h3>
                <p class="mb-6 text-sm text-gray-500">Your order has been paid using your wallet balance.</p>
                <div class="flex flex-col gap-3">
                    <button @click="goToOrder" :disabled="popupLoading"
                        class="flex w-full items-center justify-center gap-2 rounded-full bg-yellow-400 py-3 font-medium text-black transition hover:bg-yellow-500 disabled:opacity-60">
                        <span v-if="popupLoading" class="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></span>
                        <span>Track Order</span>
                    </button>
                    <button @click="goToHome" :disabled="popupLoading"
                        class="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60">
                        <span v-if="popupLoading" class="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent"></span>
                        <span>Go to Home</span>
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
const router = useRouter();
const route = useRoute();
const { getMyCart, deleteItemsFromCart, updateQtyCart, cartCount, applyVoucherToCart, deleteVoucherFromCart, toggleUseWallet, changeCartToOrder } = useAddToCart();
const { getsingleOrder } = useGlobalApi();

const orderIdFromQuery = route.query.order_id;

const cartItems = ref([]);
const cartTotal = ref("0");
const loading = ref(true);
const error = ref("");
const vatAmount = ref("0");
const amountToPay = ref("0");
const reservationDate = ref("");
const reservationTime = ref("");
const branch = ref("");
const deletingId = ref(null);
const updatingQtyId = ref(null);
const submitting = ref(false);
const promoCode = ref("");
const promoApplying = ref(false);
const promoMessage = ref("");
const promoError = ref("");
const voucherCode = ref("");
const promoDeleting = ref(false);

const useWalletActive = ref(false);
const balance = ref("0");
const walletLoading = ref(false);
const checkoutLoading = ref(false);
const showSuccessPopup = ref(false);
const completedOrderId = ref(null);
const popupLoading = ref(false);
let successTimer = null;

async function handleWalletToggle() {
  if (walletLoading.value) return;
  walletLoading.value = true;
  const previousState = useWalletActive.value;
  try {
    const res = await toggleUseWallet(orderIdFromQuery, "cart_type");
    const data = res?.data ?? {};
    useWalletActive.value = data.use_wallet ?? false;
    balance.value = data.user_balance ?? balance.value;
    amountToPay.value = data.amount_to_pay ?? amountToPay.value;
  } catch (err) {
    useWalletActive.value = previousState;
    const message = err?.data?.message || err?.message || "Failed to update wallet";
    console.error("Wallet toggle failed:", message);
    error.value = message;
  } finally {
    walletLoading.value = false;
  }
}

async function handleContinue() {
  if (checkoutLoading.value) return;
  checkoutLoading.value = true;
  try {
    if (Number(amountToPay.value) > 0) {
      await router.push(`/payment?order_id=${orderIdFromQuery}`);
      return;
    }
    const res = await changeCartToOrder(orderIdFromQuery);
    if (res?.status) {
      cartCount.value = 0;
      localStorage.removeItem("yarmook-cart");
      completedOrderId.value = res?.data?.id || orderIdFromQuery;
      showSuccessPopup.value = true;
      successTimer = setTimeout(() => {
        showSuccessPopup.value = false;
        router.push("/");
      }, 4000);
    } else {
      throw new Error(res?.message || "Failed to convert cart to order");
    }
  } catch (err) {
    const message = err?.data?.message || err?.message || "Failed to process order";
    console.error("Continue failed:", message);
    error.value = message;
  } finally {
    checkoutLoading.value = false;
  }
}

function goToHome() {
  if (popupLoading.value) return;
  popupLoading.value = true;
  clearTimeout(successTimer);
  showSuccessPopup.value = false;
  router.push("/");
}

function goToOrder() {
  if (popupLoading.value) return;
  popupLoading.value = true;
  clearTimeout(successTimer);
  showSuccessPopup.value = false;
  router.push(`/singleorderdetailsid/${completedOrderId.value}`);
}

async function applyPromoCode() {
    if (!promoCode.value.trim() || promoApplying.value) return;
    promoApplying.value = true;
    promoMessage.value = "";
    promoError.value = "";
    try {
        const res = await applyVoucherToCart(orderIdFromQuery, promoCode.value.trim());
        const data = res?.data ?? res;
        const isSuccess = data?.status === true || data?.status === "true";
        if (isSuccess) {
            voucherCode.value = promoCode.value.trim();
            promoCode.value = "";
            await syncCart();
        } else {
            promoError.value = data?.message || data?.msg || "Failed to apply promo code.";
        }
    } catch (err) {
        promoError.value = err?.data?.message || err?.data?.msg || err?.message || "Failed to apply promo code.";
        console.error("Promo code error:", err);
    } finally {
        promoApplying.value = false;
    }
}

async function deletevoucher() {
    if (promoDeleting.value) return;
    promoDeleting.value = true;
    promoError.value = "";
    try {
        await deleteVoucherFromCart(orderIdFromQuery);
        voucherCode.value = "";
        promoMessage.value = "";
        await syncCart();
    } catch (err) {
        promoError.value = err?.data?.message || err?.data?.msg || err?.message || "Failed to remove promo code.";
        console.error("Delete promo code error:", err);
    } finally {
        promoDeleting.value = false;
    }
}

async function fetchCart() {
    loading.value = true;
    error.value = "";
    try {
        const res = await getMyCart();
        const data = res?.data ?? {};

        const services = (data.services ?? []).map((item) => ({ ...item, type: "service" }));
        const offers = (data.offers ?? []).map((item) => ({ ...item, type: "offer" }));
        const spareParts = (data.spare_parts ?? []).map((item) => ({ ...item, type: "spare_part" }));

        cartItems.value = [...services, ...offers, ...spareParts];
        cartTotal.value = data.total_amount ?? "0";
        vatAmount.value = data.vat_amount ?? "0";
        amountToPay.value = data.amount_to_pay ?? "0";
        reservationDate.value = data.reservation_date ?? data.created_at ?? "";
        reservationTime.value = data.reservation_time ?? "";
        branch.value = data.branch ?? "";
        voucherCode.value = data.voucher_code || data.promo_code || data.coupon_code || data.discount_code || "";

        if (orderIdFromQuery) {
            const orderRes = await getsingleOrder(orderIdFromQuery);
            const orderData = orderRes?.data ?? {};
            useWalletActive.value = orderData.use_wallet ?? false;
            balance.value = orderData.user_balance ?? "0";
            amountToPay.value = orderData.amount_to_pay ?? amountToPay.value;
            cartTotal.value = orderData.total_amount ?? cartTotal.value;
        }
    } catch (err) {
        error.value = "Failed to load cart";
        console.error(err);
    } finally {
        loading.value = false;
    }
}

async function syncCart() {
    try {
        const res = await getMyCart();
        const data = res?.data ?? {};
        const services = (data.services ?? []).map((item) => ({ ...item, type: "service" }));
        const offers = (data.offers ?? []).map((item) => ({ ...item, type: "offer" }));
        const spareParts = (data.spare_parts ?? []).map((item) => ({ ...item, type: "spare_part" }));
        cartItems.value = [...services, ...offers, ...spareParts];
        cartTotal.value = data.total_amount ?? "0";
        vatAmount.value = data.vat_amount ?? "0";
        amountToPay.value = data.amount_to_pay ?? "0";
        reservationDate.value = data.reservation_date ?? data.created_at ?? "";
        reservationTime.value = data.reservation_time ?? "";
        branch.value = data.branch ?? "";
        voucherCode.value = data.voucher_code || data.promo_code || data.coupon_code || data.discount_code || "";

        if (orderIdFromQuery) {
            const orderRes = await getsingleOrder(orderIdFromQuery);
            const orderData = orderRes?.data ?? {};
            useWalletActive.value = orderData.use_wallet ?? false;
            balance.value = orderData.user_balance ?? "0";
            amountToPay.value = orderData.amount_to_pay ?? amountToPay.value;
            cartTotal.value = orderData.total_amount ?? cartTotal.value;
        }
    } catch (err) {
        console.error("Failed to sync cart", err);
    }
}

async function removeItem(item) {
    deletingId.value = item.id;
    try {
        await deleteItemsFromCart(orderIdFromQuery, item.id, item.type);
        await syncCart();
    } catch (err) {
        console.error("Failed to remove item", err);
    } finally {
        deletingId.value = null;
    }
}

async function updateQty(item, qty) {
    if (qty < 1) return;
    updatingQtyId.value = item.id;
    const oldQty = item.qty ?? item.quantity ?? 1;
    item.qty = qty;
    cartCount.value += qty - oldQty;
    try {
        await updateQtyCart(item.type, orderIdFromQuery, item.id, qty);
        await syncCart();
    } catch (err) {
        item.qty = oldQty;
        cartCount.value -= qty - oldQty;
        console.error("Failed to update qty", err);
    } finally {
        updatingQtyId.value = null;
    }
}

onMounted(fetchCart);

onUnmounted(() => {
  clearTimeout(successTimer);
});
</script>

<style scoped>
.box-design {
    background-color: #f7f9f9;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
