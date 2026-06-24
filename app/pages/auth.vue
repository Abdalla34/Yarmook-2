<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import VOtpInput from "vue3-otp-input";

const router = useRouter();
const route = useRoute();
const { checkCode, logOrRegister, token } = useGlobalApi();

const phone = route.query.phone || '';
const registered = route.query.registered;
const otpCode = ref(null)
const error = ref('')
const loading = ref(false)

const userCookie = useCookie("user", { maxAge: 365 * 24 * 60 * 60 })

const handleOtpComplete = async (value) => {
  loading.value = true
  otpCode.value = value
  const res = await checkCode(phone, value).finally(() => loading.value = false)
  if (res?.status) {
    if (registered === 'true') {
      try {
        const lrRes = await logOrRegister({ phone, otp_code: value, registered })
        if (lrRes?.status && lrRes?.data?.token && lrRes?.data?.user) {
          token.value = lrRes.data.token
          userCookie.value = lrRes.data.user
        }
        navigateTo('/')
      } catch (err) {
        console.log('errrr', err)
      }
    } else {
      router.push({
        path: '/register',
        query: {
          phone: phone, otp_code: otpCode.value, registered: registered
        }
      })
    }
  }
}

</script>

<template>
  <div class="auth-page">
    <div class="container mx-auto px-4">
      <div class="max-w-md mx-auto mt-12">
        <div>
          <div class="bg-white rounded-lg shadow-md p-6 text-center">
            <img src="/newLogo.png" alt="" class="mx-auto mb-2">
            <h2 class="text-xl font-bold text-center mb-3">Verify OTP</h2>
            <p class="text-center text-gray-500 mb-4">Enter the code sent to your phone</p>
            <p v-if="error" class="text-red-500 text-sm text-center mb-2">{{ error }}</p>
            <div class="flex justify-center">
              <v-otp-input ref="otpInput" :num-inputs="4" :should-auto-focus="true" :should-focus-order="true"
                input-type="number" input-classes="otp-input" @on-complete="handleOtpComplete" />
            </div>
            <div v-if="loading" class="flex justify-center mt-4">
              <span class="w-6 h-6 border-2 border-main-color border-t-transparent rounded-full animate-spin"></span>
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