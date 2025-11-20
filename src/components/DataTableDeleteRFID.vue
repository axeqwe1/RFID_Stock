<template>
  <div class="card">
    <DataTable
      v-model:selection="selectedData"
      v-model:filters="filters"
      dataKey="rfid"
      filterDisplay="row"
      ref="dt"
      :value="data"
      size="small"
      paginator
      stripedRows
      scrollable
      scrollHeight="500px"
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
      tableStyle="min-width: 50rem"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
    >
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="sku" header="SKU" :showFilterMenu="false">
        <template #filter="{ filterCallback, filterModel }">
          <InputText
            label="Search SKU"
            v-model="filterModel.value"
            @input="filterCallback()"
          />
        </template>
      </Column>
      <Column field="rfid" header="RFID" />
      <Column field="createDate" header="Register Date" :showFilterMenu="false">
        <template #body="{ data }">
          <div>
            {{ formatTime(new Date(data.createDate)) }}
          </div>
        </template>
        <template #filter="{ filterCallback, filterModel }">
          <DatePicker
            v-model="dateRange"
            :manualInput="false"
            selectionMode="range"
            dateFormat="yy-mm-dd"
            placeholder="Select Date Range"
            @update:modelValue="
              (value) => onDateChange(value, filterModel, filterCallback)
            "
          />
          <Button
            icon="pi pi-times"
            size="small"
            severity="secondary"
            @click="clearDateFilter(filterModel, filterCallback)"
            :disabled="!dateRange"
          />
        </template>
      </Column>
      <Column class="w-24 !text-end">
        <template #body="{ data }">
          <Button
            icon="pi pi-trash"
            @click="OpenDeleteDialog()"
            severity="danger"
            rounded
            :disabled="disableBtn(data)"
          ></Button>
        </template>
      </Column>
      <template #footer>
        In total there are {{ data ? data.length : 0 }} EPC.
      </template>
    </DataTable>
  </div>

  <Dialog
    v-model:visible="visible"
    modal
    :draggable="false"
    header="Confirm Delete"
    :style="{ width: '25rem' }"
  >
    <span class="text-surface-500 dark:text-surface-400 block mb-8"
      >Delete Product RFID Data.</span
    >

    <div class="flex justify-end gap-2">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="visible = false"
      ></Button>
      <Button
        severity="danger"
        type="button"
        label="Confirm"
        @click="ConfirmDeleteData()"
      ></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import type { ProductDetail, ProductRFID } from "@/types/type";
import { ref, onMounted, watch, watchEffect, nextTick, toRaw } from "vue";
import { FilterMatchMode } from "@primevue/core/api";
import DatePicker from "primevue/datepicker";
import { useFormatTime } from "@/composable/useFormatTime";
import { DeleteRfidProduct } from "@/lib/api/Product";
import type { DeleteProductRFIDRequest } from "@/data/requestDTO/DeleteProudctRFID";
import { useToast } from "primevue";
// sku: string;
// rfid: string;
// createDate: Date;
const props = defineProps<{ ProductRFIDList: ProductRFID[] }>();
const emits = defineEmits(["delete"]);
const toast = useToast();
const data = ref<ProductRFID[]>([]);
const dt = ref();
const selectedData = ref<ProductRFID[] | null>(null);
const visible = ref<boolean>(false);
const filters = ref({
  sku: { value: null, matchMode: FilterMatchMode.CONTAINS },
  rfid: { value: null, matchMode: FilterMatchMode.IN },
  createDate: { value: null, matchMode: FilterMatchMode.BETWEEN }, // 👈 ใช้ BETWEEN
});
const dateRange = ref();
const { formatTime } = useFormatTime();
function onDateChange(
  selectedDates: any,
  filterModel: any,
  filterCallback: any
) {
  if (
    !selectedDates ||
    !Array.isArray(selectedDates) ||
    selectedDates.length !== 2
  ) {
    filterModel.value = null;
  } else {
    // แปลงรูปแบบวันที่
    if (selectedDates[1] != null) {
      filterModel.value = selectedDates.map((date: Date) => {
        const year = String(date.getFullYear());
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hour = String(date.getHours()).padStart(2, "0");
        const minute = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day} : ${hour}:${minute}`;
      });
    }
  }
  filterCallback();
}
const clearDateFilter = async (filterModel: any, filterCallback: any) => {
  try {
    // Clear local state
    dateRange.value = null;
    filterModel.value = null;

    // Reset filter in filters object
    filters.value.createDate = {
      value: null,
      matchMode: FilterMatchMode.BETWEEN,
    };

    // Call filter callback
    filterCallback();

    // Wait for DOM update
    await nextTick();
  } catch (error) {
    console.error("Error clearing date filter:", error);
    // Fallback: force re-render
  }
};

function disableBtn(data: any): boolean {
  if (selectedData.value == null) {
    return true;
  }
  let existData = selectedData.value.find(
    (item) => item.sku == data.sku && item.rfid == data.rfid
  );
  if (existData) return false;
  return true;
}

function OpenDeleteDialog() {
  visible.value = true;
}
async function ConfirmDeleteData() {
  if (selectedData.value != null) {
    const request: DeleteProductRFIDRequest[] = selectedData.value.map(
      (item) => {
        return {
          sku: item.sku,
          rfid: item.rfid,
        };
      }
    ) as DeleteProductRFIDRequest[];
    const res: any = await DeleteRfidProduct(request);
    if (res.status === 200) {
      toast.add({
        severity: "success",
        summary: "Delete Success",
        detail: `${res.data}`,
        life: 3000,
      });
      visible.value = false;
      emits("delete");
    }
  }
}
watch(selectedData, (newVal) => {
  console.log(newVal?.map((item) => toRaw(item)));
});
watchEffect(() => {
  data.value = props.ProductRFIDList;
});
</script>
