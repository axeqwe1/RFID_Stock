<template>
  <div class="card">
    <DataTable
      :value="productsDetail"
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
          <span>
            TOTAL :
            {{
              productsDetail
                ? productsDetail.reduce((ac, cur) => ac + cur.qty, 0)
                : 0
            }}
            || TOTAL PRICE:
            {{
              productsDetail
                ? new Intl.NumberFormat("th-TH", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }).format(
                    productsDetail
                      ? productsDetail.reduce(
                          (ac, cur) => ac + cur.price * cur.qty,
                          0
                        )
                      : 0
                  )
                : 0
            }}
            BATH
          </span>
          <div class="flex flex-row gap-3">
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
          </div>
        </div>
      </template>

      <!-- <Column header="Image">
        <template #body="slotProps">
          <img
            :src="slotProps.data.image"
            :alt="slotProps.data.name"
            class="w-24 rounded"
          />
        </template>
      </Column> -->
      <Column field="sku" header="SKU" />

      <Column field="customerStyle" header="CustomerStyle" />

      <Column field="style" header="Style" />

      <Column field="color" header="Color" />

      <Column field="size" header="Size" />
      <Column field="price" header="Price/Qty" />
      <Column field="qty" header="ScanFound" />
      <Column field="shopify_InventoryQty" header="ShopifyInventoryQty" />
      <template #footer>
        In total there are
        {{
          productsDetail
            ? productsDetail.reduce((ac, cur) => ac + cur.qty, 0)
            : 0
        }}
        products.
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import type { ProductDetail } from "@/types/type";
import { ref, onMounted, watch } from "vue";
// import { ProductService } from "@/service/ProductService";

const emits = defineEmits<{
  (e: "scan", value: boolean): void;
  (e: "clear", value: boolean): void;
}>();
const props = defineProps<{
  productDetails: ProductDetail[];
  NotConnectCount?: number;
}>();
const isScan = ref<boolean>(false);

const productsDetail = ref<ProductDetail[]>();

function handleScan() {
  isScan.value = !isScan.value;
  emits("scan", isScan.value);
}
function handleClear() {
  emits("clear", true);
}
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
  productsDetail.value = props.productDetails;
});

watch(
  () => props.productDetails,
  (newVal) => {
    productsDetail.value = newVal;
  }
);
watch(
  () => props.NotConnectCount,
  () => {
    isScan.value = false;
  }
);
</script>
