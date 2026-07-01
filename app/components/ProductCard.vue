<template>
  <div
    class="bg-white flex flex-col items-center rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
  >
    <img :src="item.image" class="max-w-[100px]" alt="">
    <h2 class="text-xl font-bold text-gray-800 mb-2">{{ item.title }}</h2>
    <div class="flex items-center justify-between w-full">
      <span class="text-lg font-semibold text-black-600">
        {{ item.price }} <span class="text-gray-400 uppercase text-sm">sar</span>
      </span>
      <button
        @click="$emit('add-to-cart', item)"
        :disabled="loadingId === item.id"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        :class="item.in_cart ? 'bg-white text-black border rounded-lg' : 'bg-main-color text-black hover:bg-yellow-200'"
      >
        <span
          v-if="loadingId === item.id"
          class="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"
        ></span>
        {{ item.in_cart ? $t('added_to_cart') : (loadingId === item.id ? $t('adding') : $t('add_to_cart')) }}
      </button>
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
