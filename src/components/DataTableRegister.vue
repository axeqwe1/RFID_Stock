<template>
  <div class="card">
    <DataTable
      :value="data"
      size="small"
      paginator
      stripedRows
      scrollable
      scrollHeight="500px"
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      tableStyle="min-width: 50rem"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
    >
      <template #header>
        <div
          class="flex flex-wrap items-center justify-between gap-2 sticky top-0"
        >
          <span class="text-xl font-bold">Products</span>
          <div class="px-5">
            {{ data ? data.length : 0 }} / {{ targetQtyref }}
          </div>
          <div class="flex flex-row gap-3">
            <Button
              class="w-40"
              :label="'Clear'"
              :icon="'pi pi-refresh'"
              @click="clear"
              :class="'p-button-info'"
            />
            <Button
              class="w-40"
              :label="isScan ? 'STOP SCAN' : 'START SCAN'"
              :icon="isScan ? 'pi pi-stop-circle' : 'pi pi-play-circle'"
              @click="handleStart"
              :class="isScan ? 'p-button-danger' : 'p-button-secondary'"
            />
          </div>
        </div>
      </template>

      <Column field="EPC" header="EPC" />

      <template #footer>
        In total there are {{ data ? data.length : 0 }} EPC.
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
// import { ProductService } from "@/service/ProductService";

const isScan = ref<boolean>(false);
onMounted(() => {});

const products = ref();
const listData = ref();
const data = ref<{ EPC: string }[]>();
const targetQtyref = ref<number>();
const props = defineProps<{
  targetQty: number;
  listData: string[];
  invalidCount?: number;
  NotConnectCount?: number;
}>();
const emit = defineEmits<{
  (e: "startscan", value: boolean): void;
  (e: "clear", value: boolean): void;
}>();

const handleStart = () => {
  isScan.value = !isScan.value;
  emit("startscan", isScan.value);
};
const clear = () => {
  emit("clear", true);
  targetQtyref.value = 0;
  data.value = [];
  listData.value = [];
  isScan.value = false;
};

const formatCurrency = (value: any) => {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
};
const getSeverity = (product: any) => {
  switch (product.inventoryStatus) {
    case "INSTOCK":
      return "success";

    case "LOWSTOCK":
      return "warn";

    case "OUTOFSTOCK":
      return "danger";

    default:
      return undefined;
  }
};

onMounted(() => {
  targetQtyref.value = props.targetQty;
  listData.value = props.listData;
});
watch(
  () => props.targetQty,
  (newVal) => {
    targetQtyref.value = newVal;
  }
);
watch(
  () => props.listData,
  (newVal) => {
    console.log(newVal);
    const datas: { EPC: string }[] = [];
    newVal.forEach((item) => {
      const data: { EPC: string } = {
        EPC: item,
      };
      datas.push(data);
    });
    data.value = datas;
  }
);
watch(
  () => props.invalidCount,
  () => {
    isScan.value = false;
  }
);
watch(
  () => props.NotConnectCount,
  () => {
    isScan.value = false;
  }
);
</script>
