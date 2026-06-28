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
        Help
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
              Fill a Form
            </span>
          </div>

          <div>
            <!-- Arrow Icon -->
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
              FAQ
            </span>
          </div>

          <div>
            <!-- Arrow Icon -->
          </div>
        </div>
      </div>

      <!-- Call Us -->
      <div
        class="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div>
              <!-- Call Icon -->
            </div>

            <div class="flex flex-col">
              <h2 class="text-lg font-medium uppercase text-gray-800">
                Call Us
              </h2>

              <p class="text-sm text-gray-500">
                +20 100 000 0000
              </p>
            </div>
          </div>

          <div>
            <!-- Arrow Icon -->
          </div>
        </div>
      </div>

      <!-- Visit Branch -->
      <div
        class="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm cursor-pointer hover:shadow-md transition"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div>
              <!-- Branch Icon -->
            </div>

            <span class="text-lg font-medium text-gray-800">
              Visit Your Nearest Branch
            </span>
          </div>

          <div>
            <!-- Arrow Icon -->
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    </div>
</template>
<script setup>
const isLoggedIn = ref(true)
</script>