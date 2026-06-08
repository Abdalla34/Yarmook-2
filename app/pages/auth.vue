<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import VOtpInput from "vue3-otp-input";

const router = useRouter();
const { auth, checkCode } = useGlobalApi();

const step = ref(1);
const phone = ref("");
const otp = ref("");
const otpInput = ref(null);
const loading = ref(false);
const error = ref("");
const registered = ref(false);

function validatePhone(value) {
  if (!value) return "Phone number is required";
  if (!/^5\d{8}$/.test(value)) return "Enter a valid phone number (5XXXXXXXX)";
  return true;
}

async function sendOtp(values) {
  phone.value = `966${values.phone}`;
  loading.value = true;
  error.value = "";
  try {
    const res = await auth(values.phone);
    if (res?.status === true) {
      registered.value = res?.data?.registered === true;
      step.value = 2;
    } else {
      error.value = "Failed to send OTP. Try again.";
    }
  } catch {
    error.value = "Something went wrong. Try again.";
  } finally {
    loading.value = false;
  }
}

async function handleOtpComplete(value) {
  otp.value = value;
  loading.value = true;
  error.value = "";
  try {
    const res = await checkCode(phone.value, value);
    if (res?.status === true) {
      if (registered.value) {
        router.push("/services");
      } else {
        router.push({
          path: "/register",
          query: {
            phone: phone.value,
            otpCode: value,
          },
        });
       }
    } else {
      error.value = "Invalid code. Please try again.";
      otpInput.value?.clearInput();
    }
  } catch {
    error.value = "Verification failed. Try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="container mx-auto px-4">
      <div class="max-w-md mx-auto mt-12">
        <div v-if="step === 1">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-center mb-6">Login</h2>
            <Form @submit="sendOtp">
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <span class="bg-gray-100 px-4 py-3 text-gray-700 font-medium border-r border-gray-300">+966</span>
                <Field name="phone" type="tel" :rules="validatePhone" placeholder="5XXXXXXXX"
                  class="w-full px-4 py-3 outline-none" />
              </div>
              <ErrorMessage name="phone" class="text-red-500 text-sm mt-1 block" />
              <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
              <button type="submit" :disabled="loading"
                class="w-full bg-main-color text-black py-3 rounded-lg mt-4 font-bold hover:bg-yellow-200 transition disabled:opacity-50">
                {{ loading ? "Sending..." : "Next" }}
              </button>
            </Form>
          </div>
        </div>

        <div v-else>
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-center mb-6">Verify OTP</h2>
            <p class="text-center text-gray-500 mb-4">Enter the code sent to your phone</p>
            <p v-if="error" class="text-red-500 text-sm text-center mb-2">{{ error }}</p>
            <div class="flex justify-center">
              <v-otp-input ref="otpInput" :num-inputs="4" :should-auto-focus="true" :should-focus-order="true"
                input-type="number" input-classes="otp-input" @on-complete="handleOtpComplete" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.otp-input {
  width: 48px;
  height: 48px;
  padding: 5px;
  margin: 0 6px;
  font-size: 20px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  text-align: center;
  outline: none;
}

.otp-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.otp-input.is-complete {
  background-color: #e4e4e4;
}

.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
