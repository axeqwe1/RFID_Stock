<template>
  <div
    class="w-full h-16 bg-base-200 flex items-center px-26 border-b border-gray-300 fixed top-0 z-10"
  >
    <div class="flex flex-row justify-between items-center w-full">
      <div class="flex flex-row items-center gap-3">
        <Button
          icon="pi pi-bars"
          class="p-button-rounded p-button-text text-2xl"
          severity="contrast"
          @click="$emit('toggleSidebar')"
        >
        </Button>
        <h1 class="text-xl font-bold">RFID Stock</h1>
      </div>
      <!-- <div>
        <ul class="flex flex-row items-center ml-10 space-x-6">
          <li>
            <div class="relative">
              <button class="p-2 rounded-full hover:bg-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
              </button>
              <span
                class="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                >3</span
              >
            </div>
          </li>
          <li>
            <div class="relative">
              <button class="p-2 rounded-full hover:bg-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </button>
            </div>
          </li>
        </ul>
      </div> -->
      <Button label="Settings" @click="visible = true" />

      <Dialog
        v-model:visible="visible"
        modal
        header="Settings"
        :style="{ width: '90vw', height: '90vh' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      >
        <div class="w-full h-full flex flex-col">
          <Tabs value="0">
            <TabList>
              <Tab value="0">Set PowerANT</Tab>
              <Tab value="1">Config Network</Tab>
            </TabList>
            <TabPanels>
              <TabPanel value="0">
                <div
                  class="w-full h-full flex flex-col gap-6 justify-center items-center"
                >
                  <div class="flex flex-row gap-6 justify-center items-center">
                    <label>ANT1</label>
                    <InputText type="text" :value="modelANT.ant1.toString()" />
                  </div>
                  <div class="flex flex-row gap-6 justify-center items-center">
                    <label>ANT2</label>
                    <InputText type="text" :value="modelANT.ant1.toString()" />
                  </div>
                  <div class="flex flex-row gap-6 justify-center items-center">
                    <label>ANT3</label>
                    <InputText type="text" :value="modelANT.ant1.toString()" />
                  </div>
                  <div class="flex flex-row gap-6 justify-center items-center">
                    <label>ANT4</label>
                    <InputText type="text" :value="modelANT.ant1.toString()" />
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="1">
                <div
                  class="w-full h-full flex flex-col gap-6 justify-center items-center"
                >
                  <div class="flex flex-col justify-start items-start gap-3">
                    <div
                      class="flex flex-row gap-6 justify-center items-center"
                    >
                      <label class="w-15">IP</label>
                      <InputText type="text" :value="modelNetConfig.IP" />
                      <span class="font-bold text-2xl">:</span>
                      <label class="">PORT</label>
                      <InputText
                        class="max-w-[70px]"
                        type="text"
                        :value="modelNetConfig.IP"
                      />
                    </div>
                    <div
                      class="flex flex-row gap-6 justify-center items-center"
                    ></div>
                    <div
                      class="flex flex-row gap-6 justify-center items-center"
                    >
                      <label class="w-15">Gateway</label>
                      <InputText type="text" :value="modelNetConfig.Gateway" />
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import InputText from "primevue/inputtext";
import { reactive, ref } from "vue";
const visible = ref(false);
const modelANT = reactive({
  ant1: 0,
  ant2: 0,
  ant3: 0,
  ant4: 0,
} as {
  ant1: number;
  ant2: number;
  ant3: number;
  ant4: number;
});
const modelNetConfig = reactive({
  IP: "",
  PORT: "",
  Gateway: "",
});
defineEmits(["toggleSidebar"]);
</script>

<style scoped></style>
