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
          <span class="text-xl font-bold">Products</span>
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
        field="order_date"
        filterField="order_date"
        :showFilterMenu="false"
        header="Order Date"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span>{{ data.order_date.split("T")[0] }}</span>
          </div>
        </template>

        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect
            size="small"
            filter
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="[
              ...new Set(
                productsDetail.map(
                  (item) => item.order_date?.toString().split('T')[0]
                )
              ),
            ]"
            placeholder="Filter Order "
            style="min-width: 1rem"
            :maxSelectedLabels="1"
          >
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option.split("T")[0] }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>

      <Column field="title" header="Title" />

      <Column
        field="source_name"
        filterField="source_name"
        :showFilterMenu="false"
        header="Source"
      >
        <template #body="{ data }">
          <div class="flex items-center justify-center gap-2">
            <span class="text-center">{{ data.source_name }}</span>
          </div>
        </template>

        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect
            size="small"
            filter
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="[
              ...new Set(productsDetail.map((item) => item.source_name)),
            ]"
            placeholder="Source"
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

      <Column field="currency" header="Currency">
        <template #body="{ data }">
          <div class="flex items-center justify-center gap-2">
            <span class="text-center">{{ data.currency }}</span>
          </div>
        </template>
      </Column>
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
            :options="[...new Set(productsDetail.map((item) => item.sku))]"
            placeholder="SKU"
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
          <div class="flex items-center justify-center gap-2">
            <span>{{ data.size }}</span>
          </div>
        </template>

        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect
            size="small"
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="[...new Set(productsDetail.map((item) => item.size))]"
            placeholder="Size"
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
      <Column field="total_qty" sortable header="TotalQty" />
      <Column
        class="font-bold"
        field="gross_sales"
        sortable
        header="GrossSales"
      />
      <Column
        class="font-bold"
        field="total_discount"
        sortable
        header="TotalDiscount"
      />
      <Column class="font-bold" field="net_sales" sortable header="NetSales" />
      <Column
        class="font-bold"
        field="total_taxes"
        sortable
        header="TotalTaxes"
      />
      <Column
        class="font-bold"
        field="distinct_orders"
        sortable
        header="DistinctOrders"
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
import type { Product, ProductDetail, SalesDaily } from "@/types/type";
import { ref, onMounted, watch } from "vue";
import { FilterMatchMode } from "@primevue/core/api";
// import { ProductService } from "@/service/ProductService";

const emits = defineEmits<{
  (e: "scan", value: boolean): void;
  (e: "clear", value: boolean): void;
}>();
const props = defineProps<{
  productDetails: SalesDaily[];
  NotConnectCount?: number;
}>();
const isScan = ref<boolean>(false);
const dt = ref();
const productsDetail = ref<SalesDaily[]>([]);
const filters = ref({
  sku: { value: null, matchMode: FilterMatchMode.IN },
  source_name: { value: null, matchMode: FilterMatchMode.IN },
  order_date: { value: null, matchMode: FilterMatchMode.IN },
  size: { value: null, matchMode: FilterMatchMode.IN },
});

const exportCSV = () => {
  dt.value.exportCSV();
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
