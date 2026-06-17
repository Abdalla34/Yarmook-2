<template>
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="container mx-auto max-w-5xl px-4">

      <h1 class="mb-8 text-3xl font-bold text-gray-800">
        My Cars
      </h1>

      <div v-if="loading" class="space-y-4">
        <div
          v-for="i in 3"
          :key="i"
          class="animate-pulse rounded-3xl bg-white p-5 shadow-sm"
        >
          <div class="flex items-center gap-4">
            <div class="h-20 w-20 rounded-2xl bg-gray-200" />
            <div class="flex-1 space-y-2">
              <div class="h-5 w-40 rounded bg-gray-200" />
              <div class="h-4 w-24 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="cars.length" class="space-y-4">
        <div
          v-for="car in cars"
          :key="car.id"
          class="rounded-3xl bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="flex items-center gap-4">
              <div
                class="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gray-100"
              >
                <img
                  :src="car.image || 'https://via.placeholder.com/80'"
                  alt="car"
                  class="h-14 w-14 object-contain"
                />
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="text-lg font-semibold text-gray-800 truncate">
                    {{ car.name }}
                  </h3>
                  <span
                    v-if="car.is_default"
                    class="shrink-0 rounded-full bg-yellow-400 px-3 py-1 text-xs font-medium text-black"
                  >
                    Default
                  </span>
                </div>
                <p class="mt-1 text-sm text-gray-500 truncate">
                  {{ car.brand.title }} - {{ car.car_type.title }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="w-full sm:w-auto rounded-xl border border-yellow-500 px-4 py-2 text-sm font-medium text-black-500 transition hover:bg-red-50"
              >
                Car Details
              </button>
              <button
                @click="handleDelete(car)"
                :disabled="deletingId === car.id"
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
              >
                <svg v-if="deletingId !== car.id" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center"
      >
        <h3 class="mb-2 text-lg font-semibold text-gray-700">
          No Cars Added
        </h3>
        <p class="text-gray-500">
          Add your car to display here
        </p>
      </div>

      <div class="mt-8 flex justify-center">
        <button @click="navigateTo('/carbrands')"
          class="w-full sm:w-auto rounded-full bg-yellow-400 px-8 py-4 font-semibold text-black transition hover:bg-yellow-500"
        >
          Add New Car
        </button>
      </div>

    </div>
  </div>

  <div
    v-if="showDeletePopup"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    @click="cancelDelete"
  >
    <div
      class="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl"
      @click.stop
    >
      <h3 class="text-lg font-semibold text-gray-800 text-center">
        Delete {{ carToDelete?.name || carToDelete?.brand?.title || 'Car' }}
      </h3>
      <p class="mt-2 text-sm text-gray-500 text-center">
        Are you sure you want to delete this car?
      </p>
      <div class="mt-6 flex items-center gap-3">
        <button
          @click="confirmDelete"
          class="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
        >
          Yes
        </button>
        <button
          @click="cancelDelete"
          class="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { getMycars, deleteCar } = useCarServices();

const cars = ref([]);
const loading = ref(true);
const deletingId = ref(null);
const showDeletePopup = ref(false);
const carToDelete = ref(null);

async function fetchCars() {
  try {
    const response = await getMycars();
    cars.value = response?.data?.data ?? response?.data ?? [];
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function handleDelete(car) {
  carToDelete.value = car;
  showDeletePopup.value = true;
}

async function confirmDelete() {
  if (!carToDelete.value) return;
  const car = carToDelete.value;
  showDeletePopup.value = false;
  deletingId.value = car.id;
  try {
    const response = await deleteCar(car.id);
    if (response?.status) {
      cars.value = cars.value.filter(c => c.id !== car.id);
    }
  } catch (err) {
    console.error(err);
  } finally {
    deletingId.value = null;
    carToDelete.value = null;
  }
}

function cancelDelete() {
  showDeletePopup.value = false;
  carToDelete.value = null;
}

onMounted(fetchCars);
</script>