<script setup>
const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(["close", "confirm"]);

const dontShowKey = "hide_comfortable_modal";

function handleDontShow() {
  if (import.meta.client) {
    localStorage.setItem(dontShowKey, "1");
  }
  emit("close");
}

function handleOrder() {
  emit("confirm");
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click.self="emit('close')">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <!-- Modal -->
        <div class="relative w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
          <!-- Header -->
          <div class="relative flex items-center justify-between bg-gradient-to-l from-gray-100 to-gray-100 px-6 py-5">
            <h3 class="text-lg font-bold text-black capitalize">
              {{ $t("about_service") }}
            </h3>
            <button @click="emit('close')"
              class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition hover:bg-gray-300 hover:text-gray-900 hover:scale-110">
              <i class="fa-solid fa-xmark text-sm">x</i>
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto px-6 py-5">
            <!-- Image -->
            <div class="overflow-hidden rounded-2xl shadow-lg">
              <img src="/comfortableimg.jpeg" alt="Service" class="w-full h-48 object-cover" />
            </div>

            <!-- Title -->
            <h4 class="mt-5 text-start text-xl font-bold text-gray-900 leading-relaxed">
              {{ $t("comfortable_service_title") }}
            </h4>

            <!-- Description -->
            <p class="mt-3 text-start text-gray-500 leading-relaxed">
              {{ $t("comfortable_service_desc") }}
            </p>

            <!-- Tagline -->
            <div class="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3">
              <i class="fa-solid fa-car text-red-500"></i>
              <p class="font-bold text-red-600 text-sm">
                # {{ $t("comfortable_service_tagline") }}
              </p>
            </div>

            <!-- Note -->
            <div class="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div class="flex items-start gap-3">
                <div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100">
                  <i class="fa-solid fa-circle-exclamation text-xs text-amber-600"></i>
                </div>
                <div>
                  <h5 class="text-start font-bold text-amber-700 text-sm">
                    {{ $t("important_note") }}
                  </h5>
                  <p class="mt-1 text-start text-sm text-amber-600">
                    {{ $t("comfortable_service_riyadh_only") }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Steps -->
            <div class="mt-5">
              <h5 class="mb-3 text-start font-bold text-gray-800 text-sm">
                {{ $t("how_it_works") }}
              </h5>

              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">1</div>
                  <span class="text-sm text-gray-600">{{ $t("request_service") }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">2</div>
                  <span class="text-sm text-gray-600">{{ $t("share_location") }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">3</div>
                  <span class="text-sm text-gray-600">{{ $t("wait_for_arrival") }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">4</div>
                  <span class="text-sm text-gray-600">{{ $t("get_assistance") }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="border-t border-gray-100 px-6 py-5">
            <button @click="handleDontShow" type="button"
              class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-800">
              {{ $t("dont_show_next_time") }}
            </button>

            <button @click="handleOrder"
              class="mt-3 w-full rounded-xl bg-gradient-to-l from-red-500 to-red-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98]">
              {{ $t("order_now") }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}

.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>
