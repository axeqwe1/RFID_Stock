<template>
  <div
    class="bg-linear-to-b from-white dark:from-base-200 to-green-100 dark:togreen-900 p-5 rounded-2xl shadow-md"
  >
    <CardSection />
    <DataView />
  </div>
</template>

<script setup lang="ts">
import CardSection from "@/components/CardSection.vue";
import DataView from "@/components/DataView.vue";
</script>

<style scoped></style>
