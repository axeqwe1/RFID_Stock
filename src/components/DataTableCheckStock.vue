<template>
  <div class="card">
    <DataTable
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
          <span class="text-xl font-bold">Check Stock</span>
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
        field="sku"
        filterField="sku"
        :showFilterMenu="false"
        header="SKU"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span>{{ data.sku }}</span>
          </div>
        </template>

        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect
            size="small"
            filter
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="productsDetail.map((item) => item.sku)"
            placeholder="Filter SKU "
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

      <Column field="customerStyle" header="CustomerStyle" />

      <Column
        field="style"
        filterField="style"
        :showFilterMenu="false"
        header="Style"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span>{{ data.style }}</span>
          </div>
        </template>

        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect
            size="small"
            filter
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="[...new Set(productsDetail.map((item) => item.style))]"
            placeholder="Filter Style"
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
        field="color"
        filterField="color"
        :showFilterMenu="false"
        header="Color"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span>{{ data.color }}</span>
          </div>
        </template>

        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect
            size="small"
            filter
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="[...new Set(productsDetail.map((item) => item.color))]"
            placeholder="Filter Color"
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
        field="size"
        filterField="size"
        :showFilterMenu="false"
        header="SIZE"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span>{{ data.size }}</span>
          </div>
        </template>

        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect
            size="small"
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="[...new Set(productsDetail.map((item) => item.size))]"
            placeholder="Filter Size"
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
      <Column field="price" sortable header="Price/Qty" />
      <Column
        class="font-bold"
        field="shopify_InventoryQty"
        sortable
        header="InventoryQty"
      />
      <Column
        class="font-bold"
        field="rfidScan"
        sortable
        header="RFIDRegister"
      />

      <template #footer>
        In total there are
        {{ productsDetail ? productsDetail.length : 0 }}
        products.
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import type { Product, ProductDetail } from "@/types/type";
import { ref, onMounted, watch } from "vue";
import { FilterMatchMode } from "@primevue/core/api";
// import { ProductService } from "@/service/ProductService";

const emits = defineEmits<{
  (e: "scan", value: boolean): void;
  (e: "clear", value: boolean): void;
}>();
const props = defineProps<{
  productDetails: Product[];
  NotConnectCount?: number;
}>();
const isScan = ref<boolean>(false);
const dt = ref();
const productsDetail = ref<Product[]>([]);
const filters = ref({
  sku: { value: null, matchMode: FilterMatchMode.IN },
  size: { value: null, matchMode: FilterMatchMode.IN },
  color: { value: null, matchMode: FilterMatchMode.IN },
  style: { value: null, matchMode: FilterMatchMode.IN },
});

const exportCSV = () => {
  const today = new Date().toISOString().split("T")[0];
  dt.value.exportCSV({ filename: `stockrfid-shopify-${today}.csv` });
};
onMounted(() => {
  productsDetail.value = props.productDetails;
});

watch(
  () => props.productDetails,
  (newVal) => {
    productsDetail.value = newVal;
    console.log(productsDetail.value);
  }
);
watch(
  () => props.NotConnectCount,
  () => {
    isScan.value = false;
  }
);
</script>
