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

                            <div v-if="Number(balance) > 0" class="mt-4 flex items-center justify-between rounded-xl bg-green-50 px-4 py-3">
                                <span class="text-sm font-medium text-gray-700">Use Wallet</span>
                                <div class="flex items-center gap-2">
                                    <span class="text-xs text-gray-500">Balance: {{ balance }} SAR</span>
                                    <button @click="handleWalletToggle" :disabled="walletLoading" type="button"
                                        :class="['relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none', useWalletActive ? 'bg-green-500' : 'bg-gray-200']">
                                        <span v-if="walletLoading"
                                            class="inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out animate-pulse mx-auto"></span>
                                        <span v-else
                                            :class="['inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', useWalletActive ? 'translate-x-5' : 'translate-x-0']"></span>
                                    </button>
                                </div>
                            </div>

                            <div class="mt-4 flex items-center justify-between rounded-xl bg-green-50 px-4 py-3">
                                <span class="font-semibold text-gray-700">
                                    Total Amount
                                </span>
                                <div>
                                    <span class="text-2xl font-bold">{{ amountToPay }}</span>
                                    <span class="text-xs text-gray-400">SAR</span>
                                </div>
                            </div>

                            <div v-if="useWalletActive && Number(amountToPay) === 0 && Number(balance) > 0" class="mt-2 text-xs text-green-600 text-center">
                                Wallet covers the full amount
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
      await router.push("/");
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
</script>

<style scoped>
.box-design {
    background-color: #f7f9f9;
}
</style>
