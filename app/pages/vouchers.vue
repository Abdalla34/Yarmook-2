<template>
    <ProfileLinksBar />
    <div class="vaouchers-page">
        <div class="min-h-screen bg-gray-50 py-8">
            <div class="mx-auto max-w-4xl px-4">

                <!-- Header -->
                <div class="mb-6 rounded-3xl bg-white p-6 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div class="text-center">
                            <h2 class="text-2xl font-bold text-gray-900">
                                Vouchers
                            </h2>
                            <p class="mt-1 text-sm text-gray-500">
                                Available Coupons & Discounts
                            </p>
                        </div>

                        <button class="rounded-full bg-black px-5 py-2 text-sm font-medium text-white">
                            My Vouchers
                        </button>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="mb-6">
                    <ul class="flex items-center justify-center gap-8 border-b border-gray-200 pb-3">
                        <li class="cursor-pointer border-b-2 border-black pb-2 font-semibold text-black">
                            Available
                        </li>

                        <li class="cursor-pointer pb-2 text-gray-500 transition hover:text-black">
                            Used
                        </li>

                        <li class="cursor-pointer pb-2 text-gray-500 transition hover:text-black">
                            Expired
                        </li>
                    </ul>
                </div>

                <!-- Voucher Card -->
                <div class="mb-4 rounded-3xl bg-white p-5 shadow-sm">
                    <div>
                        <h4 class="mb-2 text-lg font-bold text-gray-900">
                            Summer Discount
                        </h4>

                        <p class="text-sm text-gray-500">
                            Get 20% off on all products during summer campaign.
                        </p>
                    </div>

                    <div class="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <button
                            class="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90">
                            Copy "SUMMER20"
                        </button>

                        <div class="text-right">
                            <span class="text-xs uppercase text-gray-400">
                                Expired At
                            </span>

                            <p class="text-sm font-medium text-gray-600">
                                2026-12-31
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Voucher Card -->
                <div class="mb-4 rounded-3xl bg-white p-5 shadow-sm">
                    <div>
                        <h4 class="mb-2 text-lg font-bold text-gray-900">
                            Welcome Offer
                        </h4>

                        <p class="text-sm text-gray-500">
                            New customers can enjoy a special welcome discount.
                        </p>
                    </div>

                    <div class="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <button
                            class="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90">
                            Copy "WELCOME10"
                        </button>

                        <div class="text-right">
                            <span class="text-xs uppercase text-gray-400">
                                Expired At
                            </span>

                            <p class="text-sm font-medium text-gray-600">
                                2026-11-15
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Success Message -->
                <div
                    class="fixed left-1/2 top-5 z-50 -translate-x-1/2 rounded-xl bg-green-500 px-5 py-3 text-white shadow-lg">
                    Voucher copied successfully
                </div>

                <!-- Empty State -->
                <div class="rounded-3xl bg-white p-10 text-center shadow-sm">
                    <div
                        class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-4xl">
                        🎟️
                    </div>

                    <h3 class="mb-2 text-lg font-semibold text-gray-900">
                        No Vouchers Found
                    </h3>

                    <p class="text-sm text-gray-500">
                        There are no vouchers available yet.
                    </p>
                </div>

                <!-- Expired Example -->
                <div class="mt-6 rounded-3xl bg-white p-5 opacity-50 shadow-sm">
                    <h4 class="mb-2 text-lg font-bold text-gray-900">
                        Expired Voucher
                    </h4>

                    <p class="text-sm text-gray-500">
                        This voucher is no longer valid.
                    </p>

                    <div class="mt-4 text-right">
                        <span class="text-xs uppercase text-gray-400">
                            Expired At
                        </span>

                        <p class="text-sm text-gray-600">
                            2025-12-01
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>