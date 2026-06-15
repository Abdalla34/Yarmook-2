<template>
    <div class="min-h-screen bg-gray-50 py-10">
  <div class="container mx-auto max-w-5xl px-4">

    <h1 class="mb-8 text-3xl font-bold text-gray-800">
      My Cars
    </h1>

    <!-- Cars List -->
    <div class="space-y-4">

      <!-- Car Card -->
      <div
        class="rounded-3xl bg-white p-5 shadow-sm transition hover:shadow-md"
      >
        <div class="flex items-center justify-between">

          <div class="flex items-center gap-4">
            <div
              class="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100"
            >
              <img
                src="https://via.placeholder.com/80"
                alt="car"
                class="h-14 w-14 object-contain"
              />
            </div>

            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-lg font-semibold text-gray-800">
                  Toyota Camry
                </h3>

                <span
                  class="rounded-full bg-yellow-400 px-3 py-1 text-xs font-medium text-black"
                >
                  Default
                </span>
              </div>

              <p class="mt-1 text-sm text-gray-500">
                Sedan 2024
              </p>
            </div>
          </div>

          <button
            class="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
          >
            Car Details
          </button>

        </div>
      </div>

      <!-- Car Card -->
      <div
        class="rounded-3xl bg-white p-5 shadow-sm transition hover:shadow-md"
      >
        <div class="flex items-center justify-between">

          <div class="flex items-center gap-4">
            <div
              class="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100"
            >
              <img
                src="https://via.placeholder.com/80"
                alt="car"
                class="h-14 w-14 object-contain"
              />
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray-800">
                Hyundai Elantra
              </h3>

              <p class="mt-1 text-sm text-gray-500">
                Sedan 2023
              </p>
            </div>
          </div>

          <button
            class="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
          >
            Car Details
          </button>

        </div>
      </div>

      <!-- Car Card -->
      <div
        class="rounded-3xl bg-white p-5 shadow-sm transition hover:shadow-md"
      >
        <div class="flex items-center justify-between">

          <div class="flex items-center gap-4">
            <div
              class="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100"
            >
              <img
                src="https://via.placeholder.com/80"
                alt="car"
                class="h-14 w-14 object-contain"
              />
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray-800">
                Kia Sportage
              </h3>

              <p class="mt-1 text-sm text-gray-500">
                SUV 2022
              </p>
            </div>
          </div>

          <button
            class="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
          >
            Car Details
          </button>

        </div>
      </div>

    </div>

    <!-- Empty State Example -->
    <div
      class="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center"
    >
      <h3 class="mb-2 text-lg font-semibold text-gray-700">
        No Cars Added
      </h3>

      <p class="text-gray-500">
        Add your car to display here
      </p>
    </div>

    <!-- Add New Car Button -->
    <div class="mt-8 flex justify-center">
      <button
        class="rounded-full bg-yellow-400 px-8 py-4 font-semibold text-black transition hover:bg-yellow-500"
      >
        Add New Car
      </button>
    </div>

  </div>
</div>
</template>