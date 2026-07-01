<template>
  <ProfileLinksBar :isLoggedIn="isLoggedIn" />
  <div class="container mx-auto px-4 py-8">
    <div class="w-full lg:w-2/3 mx-auto">

      <!-- Back Button -->
      <div class="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <span @click="$router.push('/help')" class="cursor-pointer hover:text-yellow-500">←</span>
        <span>{{ $t('help') }} > {{ $t('fill_a_form') }}</span>
      </div>

      <!-- Title -->
      <h1 class="mb-6 text-center text-3xl font-bold capitalize text-gray-900">
        {{ $t('fill_a_form') }}
      </h1>

      <!-- Form -->
      <div class="space-y-6 mb-20">

        <!-- Full Name -->
        <div class="flex flex-col gap-2">
          <input v-model="form.name" type="text" :placeholder="$t('full_name')"
            class="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500" />
        </div>

        <!-- Phone -->
        <div class="flex flex-col gap-2">
          <input v-model="form.phone" type="text" :placeholder="$t('phone_number')"
            class="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500" />
        </div>

        <!-- Address -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">{{ $t('address') }}</label>
          <input v-model="form.address" type="text"
            class="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500" />
        </div>

        <!-- Message -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">{{ $t('message') }}</label>
          <textarea v-model="form.message" rows="5" :placeholder="$t('write_message')"
            class="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 resize-none"></textarea>
        </div>

      </div>

      <!-- Error -->
      <p v-if="errorMsg" class="mb-4 text-center text-sm text-red-500">{{ errorMsg }}</p>

      <!-- Submit Button -->
      <div
        class="flex h-14 w-full items-center justify-center rounded-full bg-yellow-400 transition hover:bg-yellow-500">
        <button @click="submitForm" type="button" class="w-full h-full text-lg font-bold text-black"
          :disabled="sending">
          {{ sending ? $t('sending') : $t('send') }}
        </button>
      </div>

      <!-- Success Modal -->
      <div v-if="showSuccess" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div class="w-full max-w-sm rounded-2xl bg-white px-6 py-8 text-center shadow-xl animate-scale-in">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <svg class="h-7 w-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p class="mb-6 text-base text-gray-700 leading-relaxed">
            {{ successMsg }}
          </p>
          <button @click="$router.push('/help')"
            class="w-full rounded-full bg-yellow-400 px-5 py-3 font-bold text-black transition hover:bg-yellow-500">
            {{ $t('close') }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const token = useCookie("token")
const isLoggedIn = computed(() => !!token.value)

const { FormUserContact } = useHelp()

const sending = ref(false)
const showSuccess = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const form = reactive({
  name: '',
  phone: '',
  address: '',
  message: '',
})

const userCookie = useCookie("user", { maxAge: 365 * 24 * 60 * 60 })

onMounted(() => {
  if (userCookie.value) {
    const user = typeof userCookie.value === "string" ? JSON.parse(userCookie.value) : userCookie.value
    form.name = [user.first_name, user.last_name].filter(Boolean).join(' ')
    form.phone = user.phone || ''
  }
})

async function submitForm() {
  errorMsg.value = ''

  if (!form.name) { errorMsg.value = 'Please enter your name'; return }
  if (!form.phone) { errorMsg.value = 'Please enter your phone'; return }
  if (!form.address) { errorMsg.value = 'Please enter your address'; return }

  sending.value = true
  try {
    const res = await FormUserContact({ name: form.name, phone: form.phone, title: form.address, message: form.message })
    if (res?.status === false) {
      errorMsg.value = res.message || 'Something went wrong'
      return
    }
    successMsg.value = res?.message || 'Your message has been sent successfully.'
    showSuccess.value = true
    form.name = ''
    form.phone = ''
    form.address = ''
    form.message = ''
  } catch (e) {
    errorMsg.value = e?.data?.message || e?.message || 'Submission failed. Please try again.'
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}
@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
