<template>
  <div>
    <DataTable
      :value="items"
      v-model:filters="filters"
      filterDisplay="row"
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
      showGridlines
      scrollable
      scrollHeight="500px"
      dataKey="rfid"
      :globalFilterFields="columns.map((c) => c.field)"
    >
      <template #empty>No data</template>

      <Column
        v-for="col in columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :filter="col.filter"
        :dataType="col.dataType"
        sortable
      >
        <!-- clickable Out No -->
        <template v-if="col.field === 'outNo'" #body="{ data }">
          <span class="text-sky-600 cursor-pointer hover:underline">
            {{ data.outNo }}
          </span>
        </template>

        <!-- boolean status -->
        <template v-if="col.field === 'status'" #body="{ data }">
          <i
            class="pi"
            :class="
              data.status ? 'pi-check text-green-600' : 'pi-times text-red-600'
            "
          />
        </template>

        <!-- date format -->
        <template
          v-if="
            ['outDate', 'inputOutDate', 'receiveDate', 'inputDate'].includes(
              col.field
            )
          "
          #body="{ data }"
        >
          {{ formatDate(data[col.field]) }}
        </template>

        <!-- color filter -->
        <template
          v-if="col.field === 'color'"
          #filter="{ filterModel, filterCallback }"
        >
          <MultiSelect
            v-model="filterModel.value"
            :options="[...new Set(items.map((i) => i.color))]"
            size="small"
            placeholder="Color"
            @change="filterCallback()"
          />
        </template>

        <!-- size filter -->
        <template
          v-if="col.field === 'size'"
          #filter="{ filterModel, filterCallback }"
        >
          <MultiSelect
            v-model="filterModel.value"
            :options="[...new Set(items.map((i) => i.size))]"
            size="small"
            placeholder="Size"
            @change="filterCallback()"
          />
        </template>
      </Column>

      <template #footer> Total {{ items?.length ?? 0 }} records </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { FilterMatchMode } from "@primevue/core/api";
import type { WarehouseOutstock } from "../../../outstock.model";
import { formatDate } from "@/utils/format";

const items = ref<WarehouseOutstock[]>([]);

const columns = ref([
  { field: "warehouse", header: "Warehouse", filter: true },
  { field: "rfid", header: "RFID", filter: true },
  { field: "productBarcode", header: "Barcode", filter: true },
  { field: "sku", header: "SKU", filter: true },
  { field: "productCode", header: "Product Code", filter: true },
  { field: "color", header: "Color", filter: true },
  { field: "size", header: "Size", filter: true },
  { field: "uom", header: "UOM", filter: true },

  {
    field: "status",
    header: "Status",
    dataType: "boolean",
    filter: true,
  },

  { field: "outNo", header: "Out No", filter: true },
  {
    field: "outDate",
    header: "Out Date",
    dataType: "date",
    filter: true,
  },
  { field: "outType", header: "Out Type", filter: true },
  { field: "outBy", header: "Out By", filter: true },

  {
    field: "inputOutDate",
    header: "Input Out Date",
    dataType: "date",
    filter: true,
  },

  { field: "receiveNo", header: "Receive No", filter: true },
  {
    field: "receiveDate",
    header: "Receive Date",
    dataType: "date",
    filter: true,
  },

  { field: "inputBy", header: "Input By", filter: true },
  {
    field: "inputDate",
    header: "Input Date",
    dataType: "date",
    filter: true,
  },
]);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },

  warehouse: { value: null, matchMode: FilterMatchMode.CONTAINS },
  rfid: { value: null, matchMode: FilterMatchMode.CONTAINS },
  productBarcode: { value: null, matchMode: FilterMatchMode.CONTAINS },
  sku: { value: null, matchMode: FilterMatchMode.CONTAINS },
  productCode: { value: null, matchMode: FilterMatchMode.CONTAINS },
  color: { value: null, matchMode: FilterMatchMode.IN },
  size: { value: null, matchMode: FilterMatchMode.IN },
  uom: { value: null, matchMode: FilterMatchMode.CONTAINS },

  status: { value: null, matchMode: FilterMatchMode.EQUALS },

  outNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
  outDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
  outType: { value: null, matchMode: FilterMatchMode.CONTAINS },
  outBy: { value: null, matchMode: FilterMatchMode.CONTAINS },

  inputOutDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
  receiveNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
  receiveDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
  inputBy: { value: null, matchMode: FilterMatchMode.CONTAINS },
  inputDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
});
</script>

<style scoped></style>
