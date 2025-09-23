<template>
  <div class="card">
    <DataTable
      @filter="onFilter"
      :value="productsDetail"
      v-model:filters="filters"
      filterDisplay="row"
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
          <span class="text-xl font-bold">Shopify Sale Report</span>
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
          <div class="flex gap-2 items-center">
            <DatePicker
              v-model="dateRange"
              selectionMode="range"
              dateFormat="yy-mm-dd"
              placeholder="Select Date Range"
              @update:modelValue="
                (value) => onDateChange2(value, filterModel, filterCallback)
              "
            />
            <Button
              icon="pi pi-times"
              size="small"
              severity="secondary"
              @click="clearDateFilter(filterModel, filterCallback)"
              :disabled="!dateRange"
            />
          </div>
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
      <Column class="font-bold" field="total_qty" sortable header="TotalQty">
        <template #body="{ data }">
          {{
            new Intl.NumberFormat("th-TH", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(data ? data.total_qty : 0)
          }}
        </template>
      </Column>
      <Column
        class="font-bold"
        field="gross_sales"
        sortable
        header="GrossSales"
      >
        <template #body="{ data }">
          {{
            new Intl.NumberFormat("th-TH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(data ? data.gross_sales : 0)
          }}
        </template>
      </Column>
      <Column
        class="font-bold"
        field="total_discount"
        sortable
        header="TotalDiscount"
      >
        <template #body="{ data }">
          {{
            new Intl.NumberFormat("th-TH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(data ? data.total_discount : 0)
          }}
        </template>
      </Column>
      <Column class="font-bold" field="net_sales" sortable header="NetSales">
        <template #body="{ data }">
          {{
            new Intl.NumberFormat("th-TH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(data ? data.net_sales : 0)
          }}
        </template>
      </Column>
      <Column
        class="font-bold"
        field="total_taxes"
        sortable
        header="TotalTaxes"
      >
        <template #body="{ data }">
          {{
            new Intl.NumberFormat("th-TH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(data ? data.total_taxes : 0)
          }}
        </template>
      </Column>
      <Column
        class="font-bold"
        field="distinct_orders"
        sortable
        header="DistinctOrders"
      >
        <template #body="{ data }">
          {{
            new Intl.NumberFormat("th-TH", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(data ? data.distinct_orders : 0)
          }}
        </template>
      </Column>
      <template #footer>
        In total there are
        {{ totalData ? totalData : 0 }}
        products.
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import type { Product, ProductDetail, SalesDaily } from "@/types/type";
import { ref, onMounted, watch, nextTick } from "vue";
import { FilterMatchMode } from "@primevue/core/api";
import DatePicker from "primevue/datepicker";

// import { ProductService } from "@/service/ProductService";

const emits = defineEmits<{
  (e: "onFilter", totalQty: number, totalNetSales: number): void;
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
  order_date: { value: null, matchMode: FilterMatchMode.BETWEEN }, // 👈 ใช้ BETWEEN

  size: { value: null, matchMode: FilterMatchMode.IN },
});

const exportCSV = () => {
  const today = new Date().toISOString().split("T")[0];
  dt.value.exportCSV({ filename: `shopify-sales-${today}.csv` });
};

const totalData = ref(0);
const totalNetSales = ref(0);
const totalQty = ref(0);
const onFilter = (e: any) => {
  // e.filteredValue = แถวที่ถูก filter แล้ว
  totalData.value = e.filteredValue.length;
  totalNetSales.value = e.filteredValue
    ? e.filteredValue.reduce((sum: any, cur: any) => sum + cur.net_sales, 0)
    : 0;
  totalQty.value = e.filteredValue
    ? e.filteredValue.reduce((sum: any, cur: any) => sum + cur.total_qty, 0)
    : 0;
  console.log(e.filteredValue);
  console.log(totalNetSales.value, totalQty.value);
  emits("onFilter", totalQty.value, totalNetSales.value);
};

const tableKey = ref(0);

const clearDateFilter = async (filterModel: any, filterCallback: any) => {
  try {
    // Clear local state
    dateRange.value = null;
    filterModel.value = null;

    // Reset filter in filters object
    filters.value.order_date = {
      value: null,
      matchMode: FilterMatchMode.BETWEEN,
    };

    // Call filter callback
    filterCallback();

    // Wait for DOM update
    await nextTick();

    // Force table refresh if needed
    if (dt.value) {
      // Clear all filters for this field
      dt.value.clearFilter("order_date");

      // Or reset entire table state
      // tableKey.value++;
    }
  } catch (error) {
    console.error("Error clearing date filter:", error);
    // Fallback: force re-render
    tableKey.value++;
  }
};
const dateRange = ref(null);

const onDateChange2 = (
  selectedDates: any,
  filterModel: any,
  filterCallback: any
) => {
  if (
    !selectedDates ||
    !Array.isArray(selectedDates) ||
    selectedDates.length !== 2
  ) {
    filterModel.value = null;
  } else {
    // แปลงรูปแบบวันที่
    filterModel.value = selectedDates.map((date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    });
  }
  filterCallback();
};
onMounted(() => {
  productsDetail.value = props.productDetails;
});
onMounted(() => {});
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
