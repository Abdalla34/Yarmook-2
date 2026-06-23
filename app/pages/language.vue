<template>
    <ProfileLinksBar />
    <div class="lang-page">
        <div class="min-h-screen bg-gray-50 py-8">
            <div class="mx-auto max-w-2xl px-4">

                <!-- Page Title -->
                <div class="mb-8">
                    <h1 class="text-2xl font-bold text-gray-900">
                        Language
                    </h1>
                </div>

                <!-- Arabic Language -->
                <div class="mb-4 rounded-2xl bg-white p-5 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                🇸🇦
                            </div>

                            <h5 class="text-lg font-medium text-gray-900">
                                Arabic
                            </h5>
                        </div>

                        <input type="checkbox" checked
                            class="h-5 w-5 cursor-pointer rounded border-gray-300 accent-black" />
                    </div>
                </div>

                <!-- English Language -->
                <div class="mb-4 rounded-2xl bg-white p-5 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                🇺🇸
                            </div>

                            <h5 class="text-lg font-medium text-gray-900">
                                English
                            </h5>
                        </div>

                        <input type="checkbox" class="h-5 w-5 cursor-pointer rounded border-gray-300 accent-black" />
                    </div>
                </div>

                <!-- Change Language Modal -->
                <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div class="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl">

                        <!-- Flag -->
                        <div
                            class="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-4xl">
                            🇸🇦
                        </div>

                        <!-- Title -->
                        <h3 class="mb-2 text-xl font-semibold text-gray-900">
                            Change Language to Arabic
                        </h3>

                        <!-- Description -->
                        <p class="mb-6 text-sm text-gray-500">
                            Are you sure you want to change the language to Arabic?
                        </p>

                        <!-- Actions -->
                        <div class="flex gap-3">
                            <button
                                class="flex-1 rounded-2xl border border-gray-200 py-3 font-medium text-gray-700 transition hover:bg-gray-50">
                                Cancel
                            </button>

                            <button
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