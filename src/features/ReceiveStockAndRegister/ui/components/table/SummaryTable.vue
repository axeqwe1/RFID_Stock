<template>
  <DataTable
    :value="data"
    removableSort
    showGridlines
    stripedRows
    scrollHeight="300px"
    tableStyle="min-width: 50rem"
  >
    <Column
      field="ProductCode"
      header="ProductCode"
      sortable
      style="width: 25%"
    ></Column>
    <Column field="Color" header="Color" sortable style="width: 25%"></Column>
    <Column field="Size" header="Size" sortable style="width: 25%"></Column>
    <Column header="Total">
      <template #body="{ data }">
        {{
          mapQty
            ? mapQty.get(`${data.ProductCode}_${data.Color}_${data.Size}`)
            : 0
        }}
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { onMounted, ref, watch } from "vue";
import type { summaryDataDTO } from "@/features/ReceiveStockAndRegister/dto/SummaryDataDTO";

const data = ref<summaryDataDTO[]>([]);
const mapQty = ref<Map<string, number>>();
const props = defineProps<{
  sumData: summaryDataDTO[];
  mapColorSize: Map<string, number> | undefined;
}>();

watch(
  () => props.sumData,
  (newVal) => {
    if (newVal !== undefined) {
      console.log(newVal);
      data.value = newVal;
    }
  },
  { immediate: true }
);

watch(
  () => props.mapColorSize,
  (newVal) => {
    if (newVal !== undefined) {
      console.log(newVal);
      mapQty.value = newVal;
    }
  },
  { immediate: true }
);
</script>

<style scoped></style>
