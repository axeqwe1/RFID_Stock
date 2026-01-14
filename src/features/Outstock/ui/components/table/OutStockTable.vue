<template>
  <div>
    <DataTable
      :value="products"
      v-model:filters="filters"
      filterDisplay="row"
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
      showGridlines
      scrollable
      scrollHeight="500px"
      dataKey="requestNo"
      :globalFilterFields="requestOutStockColumns.map((c) => c.field)"
    >
      <template #empty>No data</template>

      <Column
        v-for="col in requestOutStockColumns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :filter="col.filter"
        :dataType="col.dataType"
        sortable
      >
        <!-- clickable Request No -->
        <template v-if="col.field === 'outNo'" #body="{ data }">
          <span
            class="text-sky-600 cursor-pointer hover:underline"
            @click="edit(data.outNo)"
          >
            {{ data.outNo }}
          </span>
        </template>

        <!-- date format -->
        <template v-if="col.field === 'requestDate'" #body="{ data }">
          {{ formatDate(data.requestDate) }}
        </template>

        <!-- color filter -->
        <template
          v-if="col.field === 'color'"
          #filter="{ filterModel, filterCallback }"
        >
          <MultiSelect
            v-model="filterModel.value"
            :options="[...new Set(products.map((p) => p.colorCode))]"
            @change="filterCallback()"
            size="small"
            placeholder="Color"
          />
        </template>

        <!-- size filter -->
        <template
          v-if="col.field === 'size'"
          #filter="{ filterModel, filterCallback }"
        >
          <MultiSelect
            v-model="filterModel.value"
            :options="[...new Set(products.map((p) => p.size))]"
            @change="filterCallback()"
            size="small"
            placeholder="Size"
          />
        </template>
      </Column>

      <template #footer> Total {{ products?.length ?? 0 }} items </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { receiveStockStore } from "@/features/ReceiveStockAndRegister/store/receiveStockStore";
import type { ProductTransactionResult } from "@/features/ReceiveStockAndRegister/types/productOnlineType";
import { formatDate } from "@/utils/format";
import { onMounted, ref } from "vue";
import { FilterMatchMode, FilterOperator } from "@primevue/core/api";
import { useFPSWarehouseCompos } from "@/features/ReceiveStockAndRegister/ui/composables/useFPSWarehouseCompos";
import { useFPSProductTransCompose } from "@/features/ReceiveStockAndRegister/ui/composables/useFPSProductTransCompose";
import { useRouter } from "vue-router";
import Select from "primevue/select";
import DatePicker from "primevue/datepicker";
import { fetchRequestOutstock } from "@/features/Outstock/outstock.api";
import type { OutRequest } from "@/features/Outstock/outstock.model";
import { outstockStore } from "@/features/Outstock/outstock.store";
const products = ref<OutRequest[]>([]);

const requestOutStockColumns = ref([
  { field: "outNo", header: "Request No", filter: true },
  {
    field: "requestDate",
    header: "Request Date",
    dataType: "date",
    filter: true,
  },
  { field: "outType", header: "Out Type", filter: true },
  { field: "requestBy", header: "Request By", filter: true },
  { field: "itemCode", header: "Product Code", filter: true },
  { field: "colorCode", header: "Color", filter: true },
  { field: "size", header: "Size", filter: true },
  { field: "outQty", header: "Qty", filter: false },
  { field: "uom", header: "UOM", filter: true },
]);
const OUTSTOCK_STORE = outstockStore();
const { getTrans } = useFPSProductTransCompose();
const { GetReceiveIn } = useFPSWarehouseCompos();
const router = useRouter();
const data = ref<OutRequest[]>([]);
const selectDate = ref<[Date | null, Date | null] | null>(null);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },

  requestNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
  requestDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
  outType: { value: null, matchMode: FilterMatchMode.CONTAINS },
  requestBy: { value: null, matchMode: FilterMatchMode.CONTAINS },
  productBarcode: { value: null, matchMode: FilterMatchMode.CONTAINS },
  sku: { value: null, matchMode: FilterMatchMode.CONTAINS },
  productCode: { value: null, matchMode: FilterMatchMode.CONTAINS },
  color: { value: null, matchMode: FilterMatchMode.IN },
  size: { value: null, matchMode: FilterMatchMode.IN },
  uom: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
function filterDateBetween(value: [Date | null, Date | null] | null) {
  console.log(value);
  if (
    selectDate.value == null ||
    selectDate.value[0] == null ||
    selectDate.value[1] == null
  )
    return;
  if (!selectDate.value || !selectDate.value[0] || !selectDate.value[1]) {
    products.value = data.value;
    return;
  }

  const [start, end] = selectDate.value;

  const from = new Date(start);
  const to = new Date(end);
  from.setHours(0, 0, 0, 0);
  to.setHours(23, 59, 59, 999);

  products.value = data.value.filter((item) => {
    if (!item.requestDate) return false;
    const itemDate = new Date(item.requestDate);
    return itemDate >= from && itemDate <= to;
  });
}
const clearDatePicker = () => {
  selectDate.value = null; // สำคัญมาก
  products.value = data.value; // reset table
};
const edit = (receiveNo: string) => {
  OUTSTOCK_STORE.OUT_EDITID = receiveNo;
  console.log(OUTSTOCK_STORE.OUT_EDITID);
  router.push("/queueoutstock/scanoutstock");
};

onMounted(async () => {
  const res = await fetchRequestOutstock();
  products.value = res.data;
  console.log(products.value);
});
</script>

<style scoped></style>
