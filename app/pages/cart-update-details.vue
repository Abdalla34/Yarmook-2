<template>
    <div class="cart-page mt-0 lg:mt-3 min-h-screen py-8">
      <div class="min-h-screen">
        <div class="mx-auto max-w-6xl px-4">
          <div class="grid gap-6 lg:grid-cols-3">
  
            <!-- Left Side -->
            <div class="lg:col-span-2 min-w-0">
              <h2 class="mb-6 text-xl font-semibold text-gray-800">
                Order Details
              </h2>
  
              <div class="space-y-2">
                <!-- Item 1 -->
                <div class="bg-white p-4 sm:p-5 shadow-md rounded-3xl">
                  <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div class="flex items-center gap-4 flex-1 min-w-0">
                      <img
                        src="https://via.placeholder.com/60"
                        class="h-14 w-14 object-contain shrink-0"
                        alt=""
                      />
                      <div>
                        <h3 class="font-semibold text-gray-800">
                          Oil Change
                        </h3>
                        <p class="text-sm text-gray-500">
                          Service
                        </p>
                        <p class="text-lg font-semibold mt-1">
                          120 SAR
                        </p>
                      </div>
                    </div>
  
                    <div class="flex items-center gap-3">
                      <div class="flex items-center gap-1 border rounded-lg px-2 py-1">
                        <button class="w-6 h-6 flex items-center justify-center">
                          -
                        </button>
  
                        <span class="text-sm min-w-[20px] text-center">
                          1
                        </span>
  
                        <button class="w-6 h-6 flex items-center justify-center">
                          +
                        </button>
                      </div>
  
                      <button
                        class="text-red-500 text-xl flex items-center justify-center w-6 h-6"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                </div>
  
                <!-- Item 2 -->
                <div class="bg-white p-4 sm:p-5 shadow-md rounded-3xl">
                  <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div class="flex items-center gap-4 flex-1 min-w-0">
                      <img
                        src="https://via.placeholder.com/60"
                        class="h-14 w-14 object-contain shrink-0"
                        alt=""
                      />
                      <div>
                        <h3 class="font-semibold text-gray-800">
                          Car Wash
                        </h3>
                        <p class="text-sm text-gray-500">
                          Service
                        </p>
                        <p class="text-lg font-semibold mt-1">
                          80 SAR
                        </p>
                      </div>
                    </div>
  
                    <div class="flex items-center gap-3">
                      <div class="flex items-center gap-1 border rounded-lg px-2 py-1">
                        <button class="w-6 h-6 flex items-center justify-center">
                          -
                        </button>
  
                        <span class="text-sm min-w-[20px] text-center">
                          1
                        </span>
  
                        <button class="w-6 h-6 flex items-center justify-center">
                          +
                        </button>
                      </div>
  
                      <button
                        class="text-red-500 text-xl flex items-center justify-center w-6 h-6"
                      >
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
                <h2 class="mb-5 text-lg font-semibold">
                  Order Details
                </h2>
  
                <div class="space-y-3 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500">Branch</span>
                    <span class="font-medium">Main Branch</span>
                  </div>
  
                  <div class="flex justify-between">
                    <span class="text-gray-500">Reservation Date</span>
                    <span class="font-medium">18 Jun 2026</span>
                  </div>
  
                  <div class="flex justify-between">
                    <span class="text-gray-500">Reservation Time</span>
                    <span class="font-medium">03:00 PM</span>
                  </div>
                </div>
  
                <hr class="my-6" />
  
                <h2 class="mb-4 text-lg font-semibold">
                  Cost Details
                </h2>
  
                <div class="space-y-3 text-sm box-design">
                  <div class="flex justify-between">
                    <span class="text-gray-500">Total Order</span>
                    <span>200 SAR</span>
                  </div>

                  <div class="flex justify-between">
                    <span class="text-gray-500">VAT</span>
                    <span>30 SAR</span>
                  </div>

                  <div class="flex justify-between">
                    <span class="text-gray-500">Final Amount</span>
                    <span>230 SAR</span>
                  </div>
                </div>
  
                <hr class="my-6" />
  
                <div class="mt-5 relative">
                  <input
                    type="text"
                    placeholder="Promocode"
                    class="w-full rounded-lg border border-gray-200 px-4 py-3 pr-20 outline-none focus:border-yellow-400"
                  />
                  <button
                    class="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-medium text-black transition hover:bg-yellow-500"
                  >
                    Apply
                  </button>
                </div>
  
                <div
                  class="mt-4 flex items-center justify-between rounded-xl bg-green-50 px-4 py-3"
                >
                  <span class="font-semibold text-gray-700">
                    Total Amount
                  </span>
  
                  <div>
                    <span class="text-2xl font-bold">230</span>
                    <span class="text-xs text-gray-400">SAR</span>
                  </div>
                </div>
  
                <div class="mt-6 flex gap-3">
                
  
                  <button
                    class="flex-1 rounded-full bg-yellow-400 py-4 font-medium text-black transition hover:bg-yellow-500"
                  >
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