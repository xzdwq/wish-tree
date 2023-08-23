<template>
  <div>
    {{ isAuthenticated }}
    <button @click="AuthService.logoutPopup()">logout</button>
    <br />
    <button @click="fetchApi()">reload api</button>
    <div>{{ response?.data || 'No data' }}</div>
    <pre>{{ userProfile?.profile?.upn || 'No user info' }}</pre>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { AuthService, userProfile, isAuthenticated } from '~/auth/oidc.auth';
  import api from '~/api';

  const response = ref<{ data: string }>({ data: '' });

  onMounted(async () => {
    await fetchApi();
  });

  const fetchApi = async (): Promise<void> => {
    response.value = await api.get('v1');
  };
</script>
