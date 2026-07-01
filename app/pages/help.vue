<template>
  <ProfileLinksBar :isLoggedIn="isLoggedIn" />
    <div class="help-page">
        <div class="container mx-auto px-4 py-8">
  <!-- Skeleton -->
  <div class="grid" v-if="false">
    <!-- Skeleton Component Here -->
  </div>

  <!-- Content -->
  <div class="">
    <div class="w-full mx-auto lg:w-2/3">
      <!-- Title -->
      <h1 class="mb-6 text-3xl font-bold capitalize text-gray-900">
        {{ $t('help') }}
      </h1>

      <!-- Fill Form -->
      <div @click="$router.push('/fill-form')"
        class="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm cursor-pointer hover:shadow-md transition"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div>
              <!-- Icon -->
            </div>
            <span class="text-lg font-medium text-gray-800">
              {{ $t('fill_a_form') }}
            </span>
          </div>

          <div>
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- FAQ -->
      <div @click="$router.push('/faqs')"
        class="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm cursor-pointer hover:shadow-md transition"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div>
              <!-- FAQ Icon -->
            </div>
            <span class="text-lg font-medium uppercase text-gray-800">
              {{ $t('faq') }}
            </span>
          </div>

          <div>
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Call Us -->
      <a :href="`tel:${mobile}`"
        class="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition block">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div>
              <!-- Call Icon -->
            </div>

            <div class="flex flex-col">
              <h2 class="text-lg font-medium uppercase text-gray-800">
                {{ $t('call_us') }}
              </h2>

              <p class="text-sm text-gray-500">
                {{ mobile || '+20 100 000 0000' }}
              </p>
            </div>
          </div>

          <div>
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </a>

      <!-- Visit Branch -->
      <div @click="$router.push('/branches-location')"
        class="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm cursor-pointer hover:shadow-md transition"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div>
              <!-- Branch Icon -->
            </div>

            <span class="text-lg font-medium text-gray-800">
              {{ $t('visit_branch') }}
            </span>
          </div>

          <div>
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    </div>
</template>
<script setup>
const token = useCookie("token")
const isLoggedIn = computed(() => !!token.value)

const { Settings } = useHelp()

const SETTINGS_CACHE_KEY = "settings_cache"
const mobile = ref('')

onMounted(() => {
  if (import.meta.client) {
    const cached = localStorage.getItem(SETTINGS_CACHE_KEY)
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        mobile.value = parsed.mobile || ''
      } catch {}
    }
  }
  ;(async () => {
    try {
      const res = await Settings()
      if (res?.data) {
        mobile.value = res.data.mobile || ''
        if (import.meta.client) {
          localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(res.data))
        }
      }
    } catch {}
  })()
})
</script>