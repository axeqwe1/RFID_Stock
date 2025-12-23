<template>
  <div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { AuthStore } from "./features/Login/ui/store/AuthStore";

const AUTH_STORE = AuthStore();

onMounted(() => {
  AUTH_STORE.Auth;
});
</script>

<style scoped></style>
