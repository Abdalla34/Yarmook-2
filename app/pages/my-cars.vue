<template>
  <ProfileLinksBar :isLoggedIn="isLoggedIn" />
  <div class="min-h-screen mt-2 bg-gray-50 py-10">
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
          class="rounded-3xl  bg-white p-5 shadow-md transition "
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="flex items-center gap-4">
              <div
                class="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gray-100"
              >
                <img v-if="car.image" :src="car.image" @error="$event.target.style.display='none'; $event.target.nextElementSibling.style.display='flex'"
                  alt="car"
                  class="h-14 w-14 object-contain"
                />
                <svg v-else class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 17v2a1 1 0 001 1h12a1 1 0 001-1v-2M5 17l2-9h10l2 9M5 17H3m16 0h2M8 12h8m-6 4h4"/>
                </svg>
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
                @click="handleCarDetails(car)"
                :disabled="loadingDetailsId === car.id"
                class="w-full sm:w-auto rounded-xl border border-yellow-500 px-4 py-2 text-sm font-medium transition hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                :class="loadingDetailsId === car.id ? 'text-gray-400' : 'text-black-500'"
              >
                <span v-if="loadingDetailsId === car.id" class="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                {{ loadingDetailsId === car.id ? 'Loading...' : 'Car Details' }}
              </button>
              <button
                v-if="!car.is_default"
                @click="handleSetDefault(car)"
                :disabled="settingDefaultId === car.id"
                class="w-full sm:w-auto rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span v-if="settingDefaultId === car.id" class="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                {{ settingDefaultId === car.id ? 'Setting...' : 'Set as Default' }}
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
const token = useCookie("token");
const isLoggedIn = computed(() => !!token.value);

const { getMycars, deleteCar, getUserCarId, setCarDefault } = useCarServices();

const cars = ref([]);
const loading = ref(true);
const deletingId = ref(null);
const loadingDetailsId = ref(null);
const settingDefaultId = ref(null);
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

async function handleCarDetails(car) {
  loadingDetailsId.value = car.id;
  try {
    const res = await getUserCarId(car.id);
    navigateTo(`/car-details/${car.id}`);
  } catch (err) {
    console.error(err);
  } finally {
    loadingDetailsId.value = null;
  }
}

async function handleSetDefault(car) {
  settingDefaultId.value = car.id;
  try {
    const res = await setCarDefault(car.id);
    if (res?.status) {
      cars.value.forEach(c => c.is_default = c.id === car.id);
    }
  } catch (err) {
    console.error(err);
  } finally {
    settingDefaultId.value = null;
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