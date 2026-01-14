<template>
  <div class="">
    <DataTable
      :value="OUTSTOCK_STORE.itemListRequest"
      v-model:filters="filters"
      filterDisplay="row"
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
      showGridlines
      tableStyle="min-width: 40rem"
      removableSort
    >
      <template #empty> No items </template>

      <template v-if="props.showBtn == true" #header>
        <div class="flex flex-row justify-between items-center">
          <span class="font-semibold text-lg">Out Stock Items</span>
          <Button
            @click="
              () => {
                visible = !visible;
              }
            "
            security="primary"
            label="Add Product"
          />
        </div>
      </template>
      <Column
        v-for="col in outStockColumns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :filter="col.filter"
        sortable
      >
        <!-- Qty ชิดขวา -->
        <template v-if="col.field === 'qty'" #body="{ data }">
          <span class="font-semibold text-right block">
            {{ data.qty }}
          </span>
        </template>
      </Column>
      <Column header="Action" style="width: 6rem" bodyClass="text-center">
        <template #body="{ index }">
          <Button
            icon="pi pi-trash"
            severity="danger"
            text
            rounded
            @click="removeItem(index)"
          />
        </template>
      </Column>
      <template #footer> Total {{ items.length }} items </template>
    </DataTable>

    <RFIDModal v-model:visible="visible" title="Add Product Item">
      <!-- The modal content can be placed here if needed -->
      <AddProductForm @update:itemListRequest="AddProductItem" />
    </RFIDModal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { FilterMatchMode } from "@primevue/core/api";
import type { RequestOutItem } from "@/features/Outstock/outstock.model";
import RFIDModal from "@/features/ReceiveStockAndRegister/ui/components/modal/RFIDModal.vue";
import AddProductForm from "../../view/AddProductForm.vue";
import { outstockStore } from "@/features/Outstock/outstock.store";
import { getDetailRequest } from "@/features/Outstock/outstock.api";
const visible = ref(false);
const OUTSTOCK_STORE = outstockStore();
const props = defineProps<{ showBtn: boolean }>();
const outStockColumns = ref([
  { field: "productCode", header: "Product Code", filter: true },
  { field: "color", header: "Color", filter: true },
  { field: "size", header: "Size", filter: true },
  { field: "qty", header: "Qty", filter: true },
  { field: "uom", header: "UOM", filter: true },
]);

const items = ref<RequestOutItem[]>([
  {
    productCode: "P-001",
    color: "Red",
    size: "M",
    qty: 10,
    uom: "PCS",
  },
]);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  productCode: { value: null, matchMode: FilterMatchMode.CONTAINS },
  color: { value: null, matchMode: FilterMatchMode.CONTAINS },
  size: { value: null, matchMode: FilterMatchMode.CONTAINS },
  qty: { value: null, matchMode: FilterMatchMode.EQUALS },
  uom: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const AddProductItem = (newItem: RequestOutItem) => {
  if (
    OUTSTOCK_STORE.itemListRequest.some(
      (item) =>
        item.productCode == newItem.productCode &&
        item.color == newItem.color &&
        item.size == newItem.size
    )
  ) {
    const index = OUTSTOCK_STORE.itemListRequest.findIndex(
      (item) =>
        item.productCode == newItem.productCode &&
        item.color == newItem.color &&
        item.size == newItem.size
    );
    if (index !== -1) {
      OUTSTOCK_STORE.itemListRequest[index].qty += newItem.qty;
      console.log(OUTSTOCK_STORE.itemListRequest);
      return;
    }
  }
  OUTSTOCK_STORE.itemListRequest.push(newItem);
  console.log(OUTSTOCK_STORE.itemListRequest);
};

const removeItem = (index: number) => {
  OUTSTOCK_STORE.itemListRequest.splice(index, 1);
};

watch(
  () => OUTSTOCK_STORE.OUT_EDITID,
  async (newVal) => {
    console.log(newVal);
    if (newVal == "" || newVal == null) {
      return;
    }

    const res = await getDetailRequest(newVal);
    console.log(res);
  },
  { immediate: true }
);
</script>

<style scoped></style>
