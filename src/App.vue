<script setup lang="ts">
import { Button, PanelMenu } from "primevue";
import { ref } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import Topbar from "./components/Topbar.vue";

const isSidebarOpen = ref(true);
</script>

<template>
  <div class="bg-base-200">
    <Topbar @toggleSidebar="isSidebarOpen = !isSidebarOpen" />
    <div class="pt-22 h-full">
      <Sidebar :is-sidebar-open="isSidebarOpen" />
      <div
        :class="{ 'ml-[18rem]': isSidebarOpen, 'ml-0': isSidebarOpen }"
        class="mx-6 mb-6 rounded-xl h-full bg-white shadow-md transition-all duration-300"
      >
        <div class="p-5">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
