<template>
  <div>{{ response?.data || 'No data' }}</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import api from '~/api';

const response = ref<{ data: string }>({ data: '' });

onMounted(async () => {
  response.value = await api.get('v1');
})
</script>
