<template>
  <div class="cart-page mt-0 lg:mt-3 min-h-screen py-8">
    <div class="min-h-screen  ">
      <div class="mx-auto max-w-6xl px-4">
        <div class="grid gap-6 lg:grid-cols-3 new-style">

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

            <div v-else
              :class="cartItems.length > 5 ? 'max-h-[600px] overflow-y-auto rounded-3xl -mx-4 sm:mx-0 px-4 sm:px-0 space-y-2' : 'space-y-2'">
              <div v-for="item in cartItems" :key="item.id" class="bg-white p-4 sm:p-5 shadow-md rounded-3xl">
                <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div class="flex items-center gap-4 flex-1 min-w-0">
                    <img :src="item.image" class="h-14 w-14 object-contain shrink-0" alt="">
                    <div class="min-w-0">
                      <h3 class="font-semibold text-gray-800 truncate">{{ item.title }}</h3>
                      <p class="text-sm text-gray-500 capitalize">{{ item.type }}</p>
                      <p class="text-lg font-semibold text-black-600 mt-1 truncate">{{ item.price ??
                        item.price_after_discount }} <span class="text-gray-400 uppercase text-sm">sar</span></p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <div class="flex items-center gap-1 border rounded-lg px-2 py-1">
                      <button @click="updateQty(item, (item.qty ?? item.quantity ?? 1) - 1)"
                        :disabled="(item.qty ?? item.quantity ?? 1) <= 1 || updatingQtyId === item.id"
                        class="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black disabled:opacity-30 transition text-lg leading-none">-</button>
                      <span v-if="updatingQtyId === item.id"
                        class="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin block mx-auto"></span>
                      <span v-else class="text-sm text-gray-500 min-w-[20px] text-center">{{ item.qty ?? item.quantity
                        ?? 1 }}</span>
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

              <h2 class="mb-4 text-lg font-semibold">
                Cost Details
              </h2>
              <div class="space-y-3 text-sm ">
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

              <div class="mt-4 flex items-center justify-between rounded-xl bg-green-50 px-4 py-3">
                <span class="font-semibold text-gray-700">
                  Total Amount
                </span>

                <div>
                  <span class="text-2xl font-bold">{{ amountToPay }}</span>
                  <span class="text-xs text-gray-400">SAR</span>
                </div>
              </div>
              <div class="mt-6 flex flex-col sm:flex-row gap-3">
                <button @click="router.push('/services')"
                  class="flex-1 rounded-full border border-black-400 bg-white py-4 font-medium text-black-500 transition hover:bg-yellow-50">
                  Add Another Item
                </button>

                <button @click="router.push({ path: '/order-update-details', query: { order_id } })"
                  class="flex-1 rounded-full bg-yellow-400 py-4 font-medium text-black transition hover:bg-yellow-500">
                  Continue
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
const { getMyCart, deleteItemsFromCart, updateQtyCart, cartCount } = useAddToCart();

const cartItems = ref([]);
const cartTotal = ref("0");
const cartId = ref(null);
const loading = ref(true);
const error = ref("");
const order_id = ref(null)
const vatAmount = ref("0");
const amountToPay = ref("0");
const reservationDate = ref("");
const reservationTime = ref("");
const branch = ref("");
const deletingId = ref(null);
const updatingQtyId = ref(null);

async function fetchCart() {
  loading.value = true;
  error.value = "";
  try {
    const res = await getMyCart();
    const data = res?.data ?? {};
    order_id.value = data.id;

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
    order_id.value = data.id;
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
  } catch (err) {
    console.error("Failed to sync cart", err);
  }
}

async function removeItem(item) {
  deletingId.value = item.id;
  try {
    await deleteItemsFromCart(order_id.value, item.id, item.type);
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
    await updateQtyCart(item.type, order_id.value, item.id, qty);
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
