<script setup>
const { handleSubmit } = useForm()
const router = useRouter()
const { sendOtpCode } = useGlobalApi()

const phoneRules = (value) => {
  if (!value) return 'Phone number is required'
  if (!/^\d{9,}$/.test(value)) return 'Must be at least 9 digits'
  return true
}

const onSubmit = handleSubmit(async (values) => {
  const fullPhone = `+966${values.phone}`
  const res = await sendOtpCode(fullPhone)
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
          <h1 class="text-2xl font-bold text-center mb-6">Create Account</h1>
          <form @submit="onSubmit">
            <div class="mb-4">
              <label class="block text-sm font-bold mb-2">Phone Number</label>
              <div class="flex items-center border rounded-lg overflow-hidden">
                <span class="bg-gray-100 px-3 py-2 text-gray-700 font-bold border-r">+966</span>
                <Field
                  name="phone"
                  type="text"
                  inputmode="numeric"
                  placeholder="5XXXXXXXX"
                  :rules="phoneRules"
                  class="w-full px-3 py-2 outline-none"
                />
              </div>
              <ErrorMessage name="phone" class="text-red-500 text-sm mt-1" />
            </div>
            <button type="submit" class="bg-main-color w-full py-2 rounded-lg font-bold hover:opacity-90 transition">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
