<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import VOtpInput from "vue3-otp-input";

const props = defineProps({
  show: Boolean,
  type: String,
  itemId: Number,
  qty: { type: Number, default: 1 },
  mode: { type: String, default: "cart" },
});

const emit = defineEmits(["close", "success"]);

const { sendOtpCode, checkCode, logOrRegister, token } = useGlobalApi();
const { addCart, addCartMulti } = useAddToCart();
const userCookie = useCookie("user", { maxAge: 365 * 24 * 60 * 60 });

const step = ref(1);
const phone = ref("");
const loading = ref(false);
const error = ref("");
const registered = ref(null);

function phoneRules(value) {
  if (!value) return "Phone number is required";
  if (!/^\d{9,}$/.test(value)) return "Must be at least 9 digits";
  return true;
}

async function submitPhone(values) {
  loading.value = true;
  error.value = "";
  const fullPhone = `+966${values.phone}`;
  try {
    const res = await sendOtpCode(fullPhone);
    if (res?.status) {
      phone.value = fullPhone;
      registered.value = res?.data?.registered ?? res?.registered;
      step.value = 2;
    } else {
      error.value = res?.message || "Failed to send OTP";
    }
  } catch {
    error.value = "An error occurred";
  } finally {
    loading.value = false;
  }
}

async function handleOtpComplete(value) {
  loading.value = true;
  error.value = "";
  try {
    const checkRes = await checkCode(phone.value, value);
    if (!checkRes?.status) {
      error.value = checkRes?.message || "Invalid code";
      return;
    }
    const lrRes = await logOrRegister({
      phone: phone.value,
      otp_code: value,
    });

    if (lrRes?.status && lrRes?.data?.token) {
      token.value = lrRes.data.token;
      userCookie.value = lrRes.data.user;

      if (props.mode === "login-only") {
        emit("success");
        return;
      }

      if (registered.value === true || registered.value === 'true') {
        await addCart(props.type, props.itemId, props.qty, token.value);
        emit("success");
        return;
      }

      const storedCart = localStorage.getItem("cartGuest");
      const guestCart = storedCart ? JSON.parse(storedCart) : [];

      const items = guestCart.map((item) => ({
        type: item.type,
        item_id: item.item_id,
        qty: 1,
      }));

      items.push({ type: props.type, item_id: props.itemId, qty: props.qty });

      const resMulti = await addCartMulti(items, token.value);
      if (resMulti?.status) {
        localStorage.removeItem("cartGuest");
      }
      emit("success");
    }
  } catch {
    error.value = "Verification failed";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-md p-8 w-full max-w-md mx-4 relative">
        <button @click="emit('close')"
          class="absolute top-3 end-3 text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>

        <div v-if="step === 1">
          <h2 class="text-2xl font-bold text-center mb-6">{{ $t('login_add_cart') }}</h2>
          <Form @submit="submitPhone">
            <div class="mb-4">
              <label class="block text-sm font-bold mb-2">{{ $t('phone_number') }}</label>
              <div class="flex items-center border rounded-lg overflow-hidden" dir="ltr">
                <span class="bg-gray-100 px-3 py-2 text-gray-700 font-bold border-r">+966</span>
                <Field name="phone" type="text" inputmode="numeric" :placeholder="$t('phone_example')" :rules="phoneRules"
                  class="w-[full] px-3 py-2 outline-none" dir="ltr" />
              </div>
              <ErrorMessage name="phone" class="text-red-500 text-sm mt-1" />
            </div>
            <p v-if="error" class="text-red-500 text-sm mb-2">{{ error }}</p>
            <button type="submit" :disabled="loading"
              class="bg-main-color w-full py-2 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
              <span v-if="loading"
                class="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              {{ loading ? $t('please_wait') : $t('submit') }}
            </button>
            <button type="button" @click="emit('close')"
              class="w-full py-2 mt-2 rounded-lg font-bold text-gray-600 border border-gray-300 hover:bg-red-500 transition">
              {{ $t('cancel') }}
            </button>
          </Form>
        </div>

        <div v-else>
          <h2 class="text-xl font-bold text-center mb-6">{{ $t('verify_otp') }}</h2>
          <p class="text-center text-gray-500 mb-4">{{ $t('enter_otp_hint') }}</p>
          <p v-if="error" class="text-red-500 text-sm text-center mb-2">{{ error }}</p>
          <div class="flex justify-center">
            <v-otp-input :num-inputs="4" :should-auto-focus="true" :should-focus-order="true" input-type="number"
              aria-placeholder="*" input-classes="otp-input" @on-complete="handleOtpComplete" />
          </div>
          <div v-if="loading" class="flex justify-center mt-4">
            <span class="w-6 h-6 border-2 border-main-color border-t-transparent rounded-full animate-spin"></span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
:deep(.otp-input) {
  width: 56px;
  height: 56px;
  font-size: 24px;
  font-weight: 600;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  background: #fff;
  text-align: center;
  outline: none;
  transition: all 0.2s ease;
  color: #111827;
  margin: 0 4px;
}

:deep(.otp-input:focus) {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

:deep(.otp-input.is-complete) {
  border-color: #10b981;
  background-color: #ecfdf5;
  color: #065f46;
}

:deep(.otp-input::-webkit-inner-spin-button),
:deep(.otp-input::-webkit-outer-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}
</style>
