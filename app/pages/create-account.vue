<script setup>
const { handleSubmit } = useForm()
const router = useRouter()
const { sendOtpCode } = useGlobalApi()
const loading = ref(false)

const { t } = useI18n()

const phoneRules = (value) => {
  if (!value) return t('phone_required')
  if (!/^\d{8,}$/.test(value)) return t('phone_min_digits')
  return true
}

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  const fullPhone = `+${values.phone}`
  const res = await sendOtpCode(fullPhone).finally(() => loading.value = false)
  if (res?.status) {
    router.push({ path: '/auth', query: { phone: fullPhone, registered: res.data.registered } })
  }
})

</script>

<template>
  <div class="create-account-page">
    <div class="container mx-auto">
      <div class="flex justify-center items-center min-h-[80vh]">
        <div class="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
          <h1 class="text-2xl font-bold text-center mb-6">{{ $t('create_account') }}</h1>
          <form @submit="onSubmit">
            <div class="mb-4">
              <label class="block text-sm font-bold mb-2">{{ $t('phone_number') }}</label>
              <div class="flex items-center border rounded-lg overflow-hidden">
                <span class="bg-gray-100 px-3 py-2 text-gray-700 font-bold border-r">+966</span>
                <Field
                  name="phone"
                  type="text"
                  inputmode="numeric"
                  :placeholder="$t('phone_example')"
                  :rules="phoneRules"
                  class="w-full px-3 py-2 outline-none"
                />
              </div>
              <ErrorMessage name="phone" class="text-red-500 text-sm mt-1" />
            </div>
            <button type="submit" :disabled="loading" class="bg-main-color w-full py-2 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
              <span v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ loading ? $t('please_wait') : $t('submit') }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
