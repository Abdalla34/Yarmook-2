<template>
    <ProfileLinksBar />
    <div class="wallet-page">
        <div class="min-h-screen bg-gray-50 py-8">
            <div class="mx-auto max-w-4xl px-4">

                <!-- Wallet Header -->
                <div class="mb-6 rounded-3xl bg-white p-6 shadow-sm">
                    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div class="flex flex-wrap items-center gap-3">
                            <h1 class="text-2xl font-bold text-gray-900">
                                Wallet
                            </h1>

                            <button
                                class="rounded-xl bg-black px-5 py-2 text-sm font-medium text-white transition hover:opacity-90">
                                Deposit Money
                            </button>
                        </div>

                        <div class="text-center md:text-right">
                            <p class="text-sm text-gray-500">
                                Current Balance
                            </p>

                            <div class="mt-1 flex items-center justify-center gap-2 md:justify-end">
                                <span class="text-2xl font-bold text-gray-900">
                                    2,500
                                </span>
                                <span class="text-sm uppercase text-gray-500">
                                    SAR
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Transaction Card -->
                <div class="mb-4 rounded-3xl bg-white p-5 shadow-sm">
                    <div class="flex items-center justify-between">

                        <div class="flex items-center gap-4">

                            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path
                                        d="M14.6673 6.75065H9.25065V1.33398C9.25065 0.650651 8.68398 0.0839844 8.00065 0.0839844C7.31732 0.0839844 6.75065 0.650651 6.75065 1.33398V6.75065H1.33398C0.650651 6.75065 0.0839844 7.31732 0.0839844 8.00065C0.0839844 8.68398 0.650651 9.25065 1.33398 9.25065H6.75065V14.6673C6.75065 15.3507 7.31732 15.9173 8.00065 15.9173C8.68398 15.9173 9.25065 15.3507 9.25065 14.6673V9.25065H14.6673C15.3507 9.25065 15.9173 8.68398 15.9173 8.00065C15.9173 7.31732 15.3507 6.75065 14.6673 6.75065Z"
                                        fill="#41C980" />
                                </svg>
                            </div>

                            <div>
                                <h5 class="font-semibold text-gray-900">
                                    Deposit
                                </h5>

                                <p class="text-sm text-gray-500">
                                    Monday, Jun 23, 2026
                                    <span>10:30 AM</span>
                                </p>

                                <p class="mt-1 text-sm font-semibold text-gray-700">
                                    Wallet Deposit
                                </p>
                            </div>

                        </div>

                        <div class="text-right">
                            <span class="text-lg font-bold text-green-600">
                                +150
                            </span>
                            <span class="ml-1 text-sm text-gray-500">
                                SAR
                            </span>
                        </div>

                    </div>
                </div>

                <!-- Withdraw Example -->
                <div class="mb-4 rounded-3xl bg-white p-5 shadow-sm">
                    <div class="flex items-center justify-between">

                        <div class="flex items-center gap-4">

                            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                                    <path
                                        d="M14.6673 3.25H1.33398C0.650651 3.25 0.0839844 2.68333 0.0839844 2C0.0839844 1.31667 0.650651 0.75 1.33398 0.75H14.6673C15.3507 0.75 15.9173 1.31667 15.9173 2C15.9173 2.68333 15.3507 3.25 14.6673 3.25Z"
                                        fill="#EB5757" />
                                </svg>
                            </div>

                            <div>
                                <h5 class="font-semibold text-gray-900">
                                    Withdraw
                                </h5>

                                <p class="text-sm text-gray-500">
                                    Monday, Jun 23, 2026
                                    <span>11:00 AM</span>
                                </p>

                                <p class="mt-1 text-sm font-semibold text-gray-700">
                                    Wallet Withdrawal
                                </p>
                            </div>

                        </div>

                        <div class="text-right">
                            <span class="text-lg font-bold text-red-600">
                                -50
                            </span>
                            <span class="ml-1 text-sm text-gray-500">
                                SAR
                            </span>
                        </div>

                    </div>
                </div>

                <!-- Pagination -->
                <div class="mt-8 flex items-center justify-center gap-4">
                    <button class="rounded-xl border border-gray-200 px-5 py-2 hover:bg-gray-100">
                        Prev
                    </button>

                    <span class="font-medium text-gray-700">
                        Page 1
                    </span>

                    <button class="rounded-xl border border-gray-200 px-5 py-2 hover:bg-gray-100">
                        Next
                    </button>
                </div>

            </div>
        </div>

        <!-- Deposit Money Modal -->
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

                <h3 class="mb-4 text-xl font-bold text-gray-900">
                    Deposit Amount
                </h3>

                <!-- Amount Input -->
                <input type="number" placeholder="Enter amount"
                    class="mb-4 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black" />

                <!-- Details -->
                <div class="rounded-2xl bg-gray-50 p-4">

                    <div class="mb-3 flex justify-between">
                        <span class="text-gray-600">Amount</span>
                        <span class="font-semibold">100 SAR</span>
                    </div>

                    <div class="mb-3 flex justify-between">
                        <span class="text-gray-600">Cash Back</span>
                        <span class="font-semibold text-green-600">
                            +10 SAR
                        </span>
                    </div>

                    <div class="flex justify-between">
                        <span class="text-gray-600">Expenses</span>
                        <span class="font-semibold">
                            5 SAR
                        </span>
                    </div>

                </div>

                <!-- Total -->
                <div class="mt-4 rounded-2xl bg-black p-4 text-center text-white">
                    <p class="text-sm opacity-80">
                        Total Amount
                    </p>

                    <h4 class="mt-1 text-2xl font-bold">
                        115 SAR
                    </h4>
                </div>

                <!-- Button -->
                <button
                    class="mt-5 w-full rounded-2xl bg-black py-4 font-medium text-white transition hover:opacity-90">
                    Deposit Money
                </button>

            </div>
        </div>
    </div>
</template>