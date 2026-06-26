<template>
    <div class="cart-page mt-0 lg:mt-3 min-h-screen py-8">
        <div class="min-h-screen">
            <div class="mx-auto max-w-6xl px-4">
                <div class="grid gap-6 lg:grid-cols-3 new-style">

                    <!-- Left Side -->
                    <div class="lg:col-span-2 min-w-0">
                        <h2 class="mb-6 text-xl font-semibold text-gray-800">
                            Order Details
                        </h2>

                        <div class="space-y-2">

                            <!-- Item -->
                            <div class="bg-white p-4 sm:p-5 shadow-md rounded-3xl">
                                <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                    <div class="flex items-center gap-4 flex-1 min-w-0">
                                        <!-- <img src="https://via.placeholder.com/60"
                                            class="h-14 w-14 object-contain shrink-0" alt="" /> -->

                                        <div class="min-w-0">
                                            <h3 class="font-semibold text-gray-800 truncate">
                                                Website Design Service
                                            </h3>

                                            <p class="text-sm text-gray-500 capitalize">
                                                Service
                                            </p>

                                            <p class="text-lg font-semibold text-black-600 mt-1 truncate">
                                                150
                                                <span class="text-gray-400 uppercase text-sm">SAR</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div class="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                                        <div class="flex items-center gap-1 border rounded-lg px-2 py-1">
                                            <button
                                                class="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black transition text-lg leading-none">
                                                -
                                            </button>

                                            <span class="text-sm text-gray-500 min-w-[20px] text-center">
                                                1
                                            </span>

                                            <button
                                                class="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black transition text-lg leading-none">
                                                +
                                            </button>
                                        </div>

                                        <button
                                            class="text-red-500 hover:text-red-700 transition text-xl leading-none flex items-center justify-center w-6 h-6">
                                            &times;
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Item -->
                            <div class="bg-white p-4 sm:p-5 shadow-md rounded-3xl">
                                <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                    <div class="flex items-center gap-4 flex-1 min-w-0">
                                        <img src="https://via.placeholder.com/60"
                                            class="h-14 w-14 object-contain shrink-0" alt="" />

                                        <div class="min-w-0">
                                            <h3 class="font-semibold text-gray-800 truncate">
                                                Spare Part
                                            </h3>

                                            <p class="text-sm text-gray-500 capitalize">
                                                Product
                                            </p>

                                            <p class="text-lg font-semibold text-black-600 mt-1 truncate">
                                                250
                                                <span class="text-gray-400 uppercase text-sm">SAR</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div class="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                                        <div class="flex items-center gap-1 border rounded-lg px-2 py-1">
                                            <button
                                                class="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black transition text-lg leading-none">
                                                -
                                            </button>

                                            <span class="text-sm text-gray-500 min-w-[20px] text-center">
                                                2
                                            </span>

                                            <button
                                                class="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black transition text-lg leading-none">
                                                +
                                            </button>
                                        </div>

                                        <button
                                            class="text-red-500 hover:text-red-700 transition text-xl leading-none flex items-center justify-center w-6 h-6">
                                            &times;
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- Right Side -->
                    <div>
                        <div class="rounded-3xl bg-white p-6 shadow-md box-design">

                            <h2 class="mb-4 text-lg font-semibold">
                                Cost Details
                            </h2>

                            <div class="space-y-3 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Total Order</span>
                                    <span>400 SAR</span>
                                </div>

                                <div class="flex justify-between">
                                    <span class="text-gray-500">VAT</span>
                                    <span>60 SAR</span>
                                </div>

                                <div class="flex justify-between">
                                    <span class="text-gray-500">Final Amount</span>
                                    <span>460 SAR</span>
                                </div>
                            </div>

                            <hr class="my-6" />

                            <div class="mt-4 flex items-center justify-between rounded-xl bg-green-50 px-4 py-3">
                                <span class="font-semibold text-gray-700">
                                    Total Amount
                                </span>

                                <div>
                                    <span class="text-2xl font-bold">460</span>
                                    <span class="text-xs text-gray-400">SAR</span>
                                </div>
                            </div>

                            <div class="mt-6">
                                <button
                                    class="w-full rounded-full bg-yellow-400 py-4 font-medium text-black transition hover:bg-yellow-500">
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