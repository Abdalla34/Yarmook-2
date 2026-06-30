<template>
     <ProfileLinksBar :isLoggedIn="isLoggedIn" />
    <div class="lang-page">
        <div class="min-h-screen bg-gray-50 py-8">
            <div class="mx-auto max-w-2xl px-4">

                <!-- Page Title -->
                <div class="mb-8">
                    <h1 class="text-2xl font-bold text-gray-900">
                        {{ $t('language') }}
                    </h1>
                </div>

                <!-- Arabic Language -->
                <div class="mb-4 rounded-2xl bg-white p-5 shadow-sm" @click="selectLang('ar')">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                🇸🇦
                            </div>
                            <h5 class="text-lg font-medium text-gray-900">
                                Arabic
                            </h5>
                        </div>
                        <input type="checkbox" :checked="locale === 'ar'"
                            class="h-5 w-5 pointer-events-none rounded border-gray-300 accent-black" />
                    </div>
                </div>

                <!-- English Language -->
                <div class="mb-4 rounded-2xl bg-white p-5 shadow-sm" @click="selectLang('en')">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                🇺🇸
                            </div>
                            <h5 class="text-lg font-medium text-gray-900">
                                English
                            </h5>
                        </div>
                        <input type="checkbox" :checked="locale === 'en'"
                            class="h-5 w-5 pointer-events-none rounded border-gray-300 accent-black" />
                    </div>
                </div>

                <!-- Change Language Modal -->
                <div v-if="showModal"
                    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div class="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl">

                        <!-- Flag -->
                        <div
                            class="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-4xl">
                            {{ targetLang.flag }}
                        </div>

                        <!-- Title -->
                        <h3 class="mb-2 text-xl font-semibold text-gray-900">
                            Change Language to {{ targetLang.name }}
                        </h3>

                        <!-- Description -->
                        <p class="mb-6 text-sm text-gray-500">
                            Are you sure you want to change the language to {{ targetLang.name }}?
                        </p>

                        <!-- Actions -->
                        <div class="flex gap-3">
                            <button @click="cancelLang"
                                class="flex-1 rounded-2xl border border-gray-200 py-3 font-medium text-gray-700 transition hover:bg-gray-50">
                                Cancel
                            </button>
                            <button @click="confirmLang"
                                class="flex-1 rounded-2xl bg-black py-3 font-medium text-white transition hover:opacity-90">
                                Yes, Change
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
const { locale, setLocale } = useI18n()
const { token } = useGlobalApi()

const isLoggedIn = computed(() => !!token.value)
const showModal = ref(false)
const selectedLang = ref(null)

const langMap = {
  ar: { name: 'Arabic', flag: '🇸🇦' },
  en: { name: 'English', flag: '🇺🇸' },
}

const targetLang = computed(() => langMap[selectedLang.value] || langMap.ar)

function selectLang(code) {
  if (code === locale.value) return
  selectedLang.value = code
  showModal.value = true
}

function cancelLang() {
  showModal.value = false
  selectedLang.value = null
}

function confirmLang() {
  if (selectedLang.value) {
    setLocale(selectedLang.value)
  }
  showModal.value = false
  selectedLang.value = null
}
</script>
