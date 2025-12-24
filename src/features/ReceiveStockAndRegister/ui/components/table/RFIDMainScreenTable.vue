<template>
  <div class="card">
    <DataTable
      :value="products"
      v-model:filters="filters"
      filterDisplay="row"
      paginator
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
      showGridlines
      tableStyle="min-width: 50rem"
      :dataKey="(row) => `${row.rfId}_${row.receiveNo}`"
      :scrollHeight="'500px'"
      scrollable
      :globalFilterFields="productTransactionColumns.map((c) => c.field)"
      removableSort
    >
      <template #empty> No products found </template>
      <Column
        v-for="col in productTransactionColumns"
        :field="col.field"
        :header="col.header"
        :filter="col.filter"
        :key="col.field"
        :dataType="col.dataType"
        :showFilterMatchModes="false"
        sortable
      >
        <template v-if="col.field == 'receiveNo'" #body="slotProps">
          <span
            @click="
              async () => {
                edit(slotProps.data.receiveNo);
                if (slotProps.data.inType == 'Purchase') {
                  await router.push('/receivetostockandregister/register');
                } else {
                  await router.push('/receivetostockandregister/receive');
                }
              }
            "
            class="text-sky-600 hover:underline cursor-pointer"
            >{{ slotProps.data.receiveNo }}
          </span>
        </template>
        <template
          v-if="col.field == 'rfId'"
          #filter="{ filterCallback, filterModel }"
        >
          <InputText
            v-model="filterModel.value"
            type="text"
            size="small"
            @input="filterCallback()"
            placeholder="Search by RFID"
          />
        </template>

        <template
          v-if="col.field == 'productBarcode'"
          #filter="{ filterCallback, filterModel }"
        >
          <InputText
            v-model="filterModel.value"
            type="text"
            size="small"
            @input="filterCallback()"
            placeholder="Search by ProductBarcode"
          />
        </template>
        <template
          v-if="col.field == 'sku'"
          #filter="{ filterCallback, filterModel }"
        >
          <InputText
            v-model="filterModel.value"
            type="text"
            size="small"
            @input="filterCallback()"
            placeholder="Search by SKU"
          />
        </template>
        <template
          v-if="col.field == 'poNo'"
          #filter="{ filterCallback, filterModel }"
        >
          <InputText
            v-model="filterModel.value"
            type="text"
            size="small"
            @input="filterCallback()"
            placeholder="Search by PONo"
          />
        </template>
        <template
          v-if="col.field == 'receiveDate'"
          #filter="{ filterCallback, filterModel }"
        >
          <DatePicker
            v-model="filterModel.value"
            dateFormat="mm/dd/yy"
            placeholder="mm/dd/yyyy"
            selectionMode="range"
            size="small"
            @update:modelValue="
              filterDateBetween(filterModel.value, filterCallback)
            "
            fluid
            class="w-50"
          />
        </template>
        <template v-if="col.field == 'receiveDate'" #body="slotProps">
          {{ formatDate(slotProps.data.receiveDate) }}
        </template>
        <template v-if="col.field == 'invoiceDate'" #body="slotProps">
          {{ formatDate(slotProps.data.invoiceDate) }}
        </template>
        <template v-if="col.field == 'inputDate'" #body="slotProps">
          {{ formatDate(slotProps.data.inputDate) }}
        </template>

        <template
          v-if="col.field == 'colorCode'"
          #filter="{ filterModel, filterCallback }"
        >
          <MultiSelect
            v-model="filterModel.value"
            @change="filterCallback()"
            filter
            size="small"
            :options="[...new Set(products?.map((item) => item.colorCode))]"
            placeholder="Color"
            style="min-width: 4rem"
            :maxSelectedLabels="1"
          >
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
        <template
          v-if="col.field == 'size'"
          #filter="{ filterModel, filterCallback }"
        >
          <MultiSelect
            v-model="filterModel.value"
            @change="filterCallback()"
            filter
            size="small"
            :options="[...new Set(products?.map((item) => item.size))]"
            placeholder="Size"
            style="min-width: 4rem"
            :maxSelectedLabels="1"
          >
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
        <template
          v-if="col.field == 'inType'"
          #filter="{ filterModel, filterCallback }"
        >
          <Select
            v-model="filterModel.value"
            @change="filterCallback()"
            filter
            showClear
            size="small"
            :options="[...new Set(products?.map((item) => item.inType))]"
            placeholder="InType"
            style="min-width: 4rem"
            :maxSelectedLabels="1"
          >
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option }}</span>
              </div>
            </template>
          </Select>
        </template>
        <template #filterclear="{ filterCallback }">
          <Button
            type="button"
            icon="pi pi-times"
            @click="
              () => {
                products = data;
                filterCallback();
              }
            "
            severity="secondary"
          ></Button>
        </template>

        <!-- outStatus -->
        <template v-if="col.field == 'outStatus'" #body="slotProps">
          <span
            :class="[
              slotProps.data.outStatus
                ? 'p-3 bg-green-300 rounded-full'
                : 'p-3 bg-red-300 rounded-full',
            ]"
          >
            <i
              :class="[
                slotProps.data.outStatus
                  ? 'pi pi-check font-bold text-2xl text-green-700'
                  : 'pi pi-times font-bold text-2xl text-red-700',
              ]"
            ></i>
          </span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";

import { useRouter } from "vue-router";
// import { productTransactionColumns } from "./columns/productTransColumn";
import { useFPSProductTransCompose } from "../../composables/useFPSProductTransCompose";
import { FilterMatchMode, FilterOperator } from "@primevue/core/api";
import Dialog from "primevue/dialog";
import DatePicker from "primevue/datepicker";
import FormField from "primevue/datepicker";
import Select from "primevue/select";
// import { dummyProductTransactions } from "./dummy";
import type { ProductTransactionResult } from "@/features/ReceiveStockAndRegister/types/productOnlineType";
import { receiveStockStore } from "@/features/ReceiveStockAndRegister/store/receiveStockStore";
import { formatDate } from "@/utils/format";
import { useFPSWarehouseCompos } from "../../composables/useFPSWarehouseCompos";

const { getTrans } = useFPSProductTransCompose();
const { GetReceiveIn } = useFPSWarehouseCompos();
const router = useRouter();
const RECEIVE_STORE = receiveStockStore();
const products = ref<ProductTransactionResult[]>();
const internalSelectReceiveNo = ref<string>("");
const visible = ref<boolean>(false);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },

  warehouse: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  rfId: { value: null, matchMode: FilterMatchMode.CONTAINS },
  productBarcode: { value: null, matchMode: FilterMatchMode.CONTAINS },
  sku: { value: null, matchMode: FilterMatchMode.CONTAINS },
  itemCode: { value: null, matchMode: FilterMatchMode.IN },
  colorCode: { value: null, matchMode: FilterMatchMode.IN },
  size: { value: null, matchMode: FilterMatchMode.IN },
  receiveNo: { value: null, matchMode: FilterMatchMode.CONTAINS },

  receiveDate: {
    value: null,
    matchMode: undefined,
  },
  invoiceDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
  outDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
  inputDate: { value: null, matchMode: FilterMatchMode.DATE_IS },

  inType: { value: null, matchMode: FilterMatchMode.CONTAINS },
  invoiceNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
  poNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
  uom: { value: null, matchMode: FilterMatchMode.CONTAINS },

  outStatus: { value: null, matchMode: FilterMatchMode.EQUALS },
  outNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
  inputBy: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const productTransactionColumns = ref([
  { field: "warehouse", header: "Warehouse", filter: true },
  { field: "rfId", header: "RFID", filter: true },
  // { field: "productBarcode", header: "Barcode", filter: true },
  { field: "sku", header: "SKU", filter: true },
  { field: "itemCode", header: "ItemCode", filter: true },
  { field: "colorCode", header: "Color", filter: true },
  { field: "size", header: "Size", filter: true },
  { field: "receiveNo", header: "Receive No", filter: true },

  {
    field: "receiveDate",
    header: "Receive Date",
    dataType: "date",
    filter: true,
  },
  { field: "inType", header: "In Type", filter: true },
  { field: "invoiceNo", header: "Invoice No", filter: true },

  {
    field: "invoiceDate",
    header: "Invoice Date",
    dataType: "date",
    filter: true,
  },

  { field: "poNo", header: "PO No", filter: true },
  { field: "uom", header: "UOM", filter: true },

  {
    field: "outStatus",
    header: "Out Status",
    dataType: "boolean",
    filter: true,
  },

  {
    field: "outDate",
    header: "Out Date",
    dataType: "date",
    filter: true,
  },

  { field: "outNo", header: "Out No", filter: true },
  { field: "inputBy", header: "Input By", filter: true },

  {
    field: "inputDate",
    header: "Input Date",
    dataType: "date",
    filter: true,
  },
]);

const data = ref<ProductTransactionResult[]>([]);
async function filterDateBetween(value: any, callback: any) {
  if (value[1] == null) {
    return;
  }
  products.value = data.value.filter((item) => {
    if (item.receiveDate) {
      const itemDate = new Date(item.receiveDate);
      value[0].setHours(0, 0, 0, 0);
      value[1].setHours(23, 59, 59, 999);
      return itemDate >= value[0] && itemDate <= value[1];
    }
  });
}
const edit = (receiveNo: string) => {
  RECEIVE_STORE.editReceiveId = receiveNo;
};
onMounted(async () => {
  data.value = await getTrans();
  products.value = data.value;

  await nextTick();
});
watch(products, (newVal) => {
  console.log("Products updated:", newVal);
});
</script>
