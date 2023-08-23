<template>
  <div>
    <div style="padding: 2px; display: flex; justify-content: center; gap: 10px">
      <button @click="AuthService.loginPopup()">login</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { AuthService } from '~/auth/oidc.auth';
</script>
