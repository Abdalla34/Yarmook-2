<template>
  <div
    class="bg-white rounded-2xl border border-gray-200 p-4 transition-shadow hover:shadow-sm"
  >
    <div class="flex items-center gap-4">
      <button
        @click="$emit('add-to-cart', item)"
        :disabled="loadingId === item.id"
        class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50 transition"
        :class="item.in_cart ? 'bg-green-200' : 'bg-main-color'"
      >
        <svg v-if="item.in_cart" class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <div class="flex-1 min-w-0">
        <h2 class="text-base font-semibold text-gray-800 truncate">{{ item.title }}</h2>
        <span class="text-sm font-semibold text-red-500">
          {{ item.price }} <span class="text-gray-400 uppercase text-xs">sar</span>
        </span>
      </div>
      <img :src="item.image" class="w-14 h-14 object-contain rounded-xl shrink-0 bg-gray-50" alt="">
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: { type: Object, required: true },
  loadingId: { type: [Number, String], default: null },
})
defineEmits(['add-to-cart'])
</script>
