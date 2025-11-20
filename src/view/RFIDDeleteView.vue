<template>
  <div>
    <div class="p-6 space-y-3">
      <div class="shadow-md p-2 rounded-xl container_background">
        <label class="text-2xl font-bold text-gray-200">RFID Delete</label>
      </div>
      <!-- 
      <div class="space-y-4">
        <div class="flex flex-row space-x-3">
          <IftaLabel>
            <InputText id="sku" v-model="SKU" />
            <label for="sku">SKU</label>
          </IftaLabel>
          <IftaLabel>
            <InputText id="sku" v-model="SKU" />
            <label for="sku">RFID ID (Optional)</label>
          </IftaLabel>
        </div>

        <div class="flex flex-row space-x-3">
          <IftaLabel>
            <DatePicker
              v-model="dates"
              selectionMode="range"
              :manualInput="false"
            />
            <label for="date_betweeb">BETWEEN</label>
          </IftaLabel>
          <Button @click="clear" label="Clear" severity="info" />
        </div>
      </div> -->
    </div>
    <div class="px-6">
      <DataTableDeleteRFID :ProductRFIDList="data" @delete="onDelete" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, watchEffect, onMounted } from "vue";
import DatePicker from "primevue/datepicker";
import IftaLabel from "primevue/iftalabel";
import { GetAllProductRFID } from "@/lib/api/Product";
import DataTableDeleteRFID from "@/components/DataTableDeleteRFID.vue";
import type { ProductRFID } from "@/types/type";

const SKU = ref<string>();
const dates = ref<Date[] | null>(null);
const data = ref<ProductRFID[]>([]);
function clear() {
  SKU.value = "";
  dates.value = null;
  console.log(dates.value);
}

async function onDelete() {
  const res = await GetAllProductRFID();
  data.value = res.data;
}
onMounted(async () => {
  const res = await GetAllProductRFID();
  data.value = res.data;
  console.log(res);
});

watchEffect(() => {
  console.log(dates.value);
  console.log(SKU.value);
});
</script>

<style scoped>
.container_background {
  background-image: linear-gradient(to right, #a1bc98, #b7b89f);
}
</style>
