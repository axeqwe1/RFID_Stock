<template>
  <div class="card">
    <DataTable
      @filter="onFilter"
      :value="productsDetail"
      v-model:filters="filters"
      filterDisplay="row"
      dataKey="sku"
      ref="dt"
      size="small"
      removableSort
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
      <template #header>
        <div
          class="flex flex-wrap items-center justify-between gap-2 sticky top-0"
        >
          <span class="text-xl font-bold">Warehouse Stock</span>
          <div class="text-end pb-4">
            <Button
              icon="pi pi-external-link"
              label="Export"
              @click="exportCSV()"
            />
          </div>
          <!-- <div class="flex flex-row gap-3">
            <Button
              class="w-40"
              :label="'Clear'"
              :icon="'pi pi-refresh'"
              @click="handleClear"
              :class="'p-button-info'"
            />
            <Button
              class="w-40"
              :label="isScan ? 'STOP SCAN' : 'START SCAN'"
              :icon="isScan ? 'pi pi-stop-circle' : 'pi pi-play-circle'"
              @click="handleScan"
              :class="isScan ? 'p-button-danger' : 'p-button-secondary'"
            />
          </div> -->
        </div>
      </template>

      <Column
        field="locationId"
        filterField="locationId"
        :showFilterMenu="false"
        header="LocationId"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span>{{ data.locationId }}</span>
          </div>
        </template>

        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect
            size="small"
            filter
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="productsDetail.map((item) => item.locationId)"
            placeholder="Filter LocationId "
            style="min-width: 1rem"
            :maxSelectedLabels="1"
          >
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>

      <Column
        field="warehouse"
        filterField="warehouse"
        :showFilterMenu="false"
        header="Warehouse"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span>{{ data.warehouse }}</span>
          </div>
        </template>

        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect
            size="small"
            filter
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="[
              ...new Set(productsDetail.map((item) => item.warehouse)),
            ]"
            placeholder="Filter Name"
            style="min-width: 1rem"
            :maxSelectedLabels="1"
          >
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column
        field="address"
        filterField="address"
        :showFilterMenu="false"
        header="Address"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span>{{ data.address }}</span>
          </div>
        </template>

        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect
            size="small"
            filter
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="[...new Set(productsDetail.map((item) => item.address))]"
            placeholder="Filter Address"
            style="min-width: 1rem"
            :maxSelectedLabels="1"
          >
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>

      <Column
        field="availableStock"
        filterField="availableStock"
        :showFilterMenu="false"
        header="Available"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span>{{ data.availableStock }}</span>
          </div>
        </template>

        <template #filter="{ filterModel, filterCallback }">
          <Slider
            v-model="filterModel.value"
            @change="filterCallback()"
            range
            class="m-4"
            :max="maxAvailableStock"
          ></Slider>
          <div class="flex items-center justify-between px-2">
            <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
            <span>{{ filterModel.value ? filterModel.value[1] : 0 }}</span>
            <span>{{ maxAvailableStock }}</span>
          </div>
        </template>
      </Column>

      <template #footer>
        In total there are
        {{ productsDetail ? productsDetail.length : 0 }}
        products.
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import type { Product, ProductDetail, WarehouseStock } from "@/types/type";
import { ref, onMounted, watch } from "vue";
import { FilterMatchMode } from "@primevue/core/api";
// import { ProductService } from "@/service/ProductService";

const emits = defineEmits<{
  (e: "on-filter", totalQty: number): void;
}>();
const props = defineProps<{
  productDetails: WarehouseStock[];
  NotConnectCount?: number;
}>();
const isScan = ref<boolean>(false);
const dt = ref();
const productsDetail = ref<WarehouseStock[]>([]);
const filters = ref({
  locationId: { value: null, matchMode: FilterMatchMode.IN },
  warehouse: { value: null, matchMode: FilterMatchMode.IN },
  address: { value: null, matchMode: FilterMatchMode.IN },
  availableStock: { value: null, matchMode: FilterMatchMode.BETWEEN },
});
const maxAvailableStock = ref<number>(9999);
const exportCSV = () => {
  const today = new Date().toISOString().split("T")[0];
  dt.value.exportCSV({ filename: `stockrfid-shopify-${today}.csv` });
};

const totalAvailableStock = ref<number>(0);
const onFilter = (e: any) => {
  // e.filteredValue = แถวที่ถูก filter แล้ว

  totalAvailableStock.value = e.filteredValue
    ? e.filteredValue.reduce(
        (sum: any, cur: any) => sum + cur.availableStock,
        0
      )
    : 0;

  emits("on-filter", totalAvailableStock.value);
};

onMounted(() => {
  productsDetail.value = props.productDetails;
});

watch(
  () => props.productDetails,
  (newVal) => {
    productsDetail.value = newVal;
    console.log(productsDetail.value);
    const availableStock = productsDetail.value.map((item) => {
      return item.availableStock;
    });
    console.log(availableStock, Math.max(...availableStock));
    maxAvailableStock.value = Math.max(...availableStock);
  }
);
watch(
  () => props.NotConnectCount,
  () => {
    isScan.value = false;
  }
);
</script>
