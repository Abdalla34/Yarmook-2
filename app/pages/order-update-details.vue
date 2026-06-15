<template>
    <div class="update-details">
        <div class="container mx-auto">
            <div class="container mx-auto max-w-5xl px-4 py-8">
                <div class="grid grid-cols-1 gap-8">

                    <div>
                        <h1 class="mb-6 text-2xl font-bold text-gray-800">
                            Order Details
                        </h1>
                        <div class="rounded-3xl bg-white p-6 shadow-sm">

                            <!-- My Cars -->
                            <div class="mb-5">
                                <label class="mb-2 block text-sm font-medium text-gray-700">
                                    My Cars
                                </label>

                                <select
                                    class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-yellow-400">
                                    <option>Select Car</option>
                                    <option>Toyota Camry</option>
                                    <option>Hyundai Elantra</option>
                                    <option>Kia Sportage</option>
                                </select>
                            </div>

                            <!-- Branch -->
                            <div class="mb-5">
                                <label class="mb-2 block text-sm font-medium text-gray-700">
                                    Branch
                                </label>

                                <div
                                    class="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 cursor-pointer">
                                    <span class="text-gray-500">
                                        Select Branch
                                    </span>

                                    <span>⌄</span>
                                </div>
                            </div>

                            <!-- Date -->
                            <div class="mb-5">
                                <label class="mb-2 block text-sm font-medium text-gray-700">
                                    Date & Time
                                </label>

                                <div
                                    class="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 cursor-pointer">
                                    <span class="text-gray-500">
                                        Select Date & Time
                                    </span>

                                    <span>⌄</span>
                                </div>
                            </div>

                            <!-- Details -->
                            <div class="mb-5">
                                <label class="mb-2 block text-sm font-medium text-gray-700">
                                    Details
                                </label>

                                <textarea rows="5" placeholder="Issues details"
                                    class="w-full rounded-xl border border-gray-200 p-4 outline-none focus:border-yellow-400"></textarea>
                            </div>

                            <!-- Upload -->
                            <div class="mb-6">
                                <label class="mb-2 block text-sm font-medium text-gray-700">
                                    Problem Photo
                                </label>

                                <div class="rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center">


                                    <input type="file" class="hidden" id="upload" />

                                    <label for="upload" class="cursor-pointer font-medium text-yellow-500">
                                        Upload from your gallery
                                    </label>

                                    <p class="mt-2 text-sm text-gray-400">
                                        JPG, PNG up to 10MB
                                    </p>
                                </div>
                            </div>

                            <!-- Buttons -->
                            <div class="flex flex-col gap-3 sm:flex-row">


                                <button
                                    class="flex-1 rounded-xl bg-yellow-400 py-3 font-medium text-black transition hover:bg-yellow-500">
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