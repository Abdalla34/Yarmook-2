<template>
  <svg v-if="status === 'completed' || status === 'paid'" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#22c55e" />
    <path d="M8 12.5L10.5 15L16 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
  <svg v-else-if="status === 'cancelled'" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#ef4444" />
    <path d="M9 9L15 15M15 9L9 15" stroke="white" stroke-width="2" stroke-linecap="round" />
  </svg>
  <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#eab308" />
    <path d="M12 7V12L15 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<script setup>
defineProps({ status: String })
</script>
