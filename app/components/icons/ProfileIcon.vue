<template>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12C14.4853 12 16.5 9.98528 16.5 7.5C16.5 5.01472 14.4853 3 12 3C9.51472 3 7.5 5.01472 7.5 7.5C7.5 9.98528 9.51472 12 12 12Z"
            :stroke="active ? '#000000' : '#7E7E7E'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M3 21C3 18.5 5.5 15 12 15C18.5 15 21 18.5 21 21"
            :stroke="active ? '#000000' : '#7E7E7E'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
</template>

<script setup>
defineProps({ active: Boolean })
</script>
