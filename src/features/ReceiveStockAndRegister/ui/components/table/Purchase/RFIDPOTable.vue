<template>
  <DataTable
    :value="listData"
    paginator
    :rows="5"
    :rowsPerPageOptions="[5, 10, 20, 50]"
    showGridlines
    scrollable
    scrollHeight="400px"
  >
    <template #header>
      <div
        class="w-full flex-row justify-between items-center flex border-b-2 pb-3"
      >
        <label class="text-lg font-bold">RFID Summary</label>
        <Button
          label="ADD"
          @click="
            () => {
              visible = true;
            }
          "
          :disabled="RECEIVE_STORE.editReceiveId != null"
        />
      </div>
    </template>

    <!-- RFID -->
    <Column field="rfid" header="RFID" />

    <!-- PO No -->
    <Column field="POno" header="PO No" />

    <!-- Product Code -->
    <Column field="ProductCode" header="Product Code" />

    <!-- Color -->
    <Column field="Color" header="Color" />

    <!-- Size -->
    <Column field="Size" header="Size" />

    <!-- SKU -->
    <Column field="SKU" header="SKU" />

    <!-- Unit -->
    <Column field="Unit" header="Unit" />

    <!-- Status (Custom Body) -->

    <!-- Action -->
    <Column header="Actions">
      <template #body="$slotProps">
        <Button
          label="Remove"
          class="p-button-danger"
          @click="
            () => {
              const index = listData.findIndex(
                (item) => item.rfid === $slotProps.data.rfid
              );
              if (index !== -1) listData.splice(index, 1);
            }
          "
          :disabled="RECEIVE_STORE.editReceiveId != null"
        />
      </template>
    </Column>
    <ColumnGroup type="footer">
      <Row>
        <Column footer="Totals:" :colspan="7" footerStyle="text-align:right" />
        <Column :footer="listData.length.toString()" />
      </Row>
    </ColumnGroup>
  </DataTable>
  <RFIDModal v-model:visible="visible" title="Add RFID Item">
    <RFIDDetailForm @AddRFIDData="AddRFIDData" />
  </RFIDModal>
</template>

<script setup lang="ts">
import type {
  RFIDPOBody,
  RFIDType,
} from "@/features/ReceiveStockAndRegister/types/rfidtype";
import { onMounted, ref, watch } from "vue";
import RFIDModal from "../../modal/RFIDModal.vue";
import RFIDDetailForm from "../../../form/RFIDDetailForm.vue";
import { receiveStockStore } from "@/features/ReceiveStockAndRegister/store/receiveStockStore";

const listData = ref<RFIDPOBody[]>([]);
const Total = ref<number>(10);
const RECEIVE_STORE = receiveStockStore();
const props = defineProps<{}>();
const visible = ref<boolean>(false);
const emits = defineEmits<{
  (e: "addData", value: RFIDPOBody[]): void;
}>();

const AddRFIDData = (value: RFIDPOBody[]) => {
  if (value) {
    visible.value = false;
    const existData = listData.value.filter((newItem) =>
      value.some((existingItem) => existingItem.rfid === newItem.rfid)
    );
    if (existData.length > 0) {
      value.forEach((newItem) => {
        const idx = listData.value.findIndex((x) => x.rfid === newItem.rfid);

        if (idx !== -1) {
          // replace data
          listData.value[idx] = { ...newItem };
        }
      });
    } else {
      // ไม่มีของซ้ำ → push ใหม่
      listData.value.push(...value);
    }
    RECEIVE_STORE.listDataRFIDPO = listData.value;
    console.log("RFIDPOTable - AddRFIDData:", value);
    emits("addData", value);
  }
};

watch(
  () => RECEIVE_STORE.listDataRFIDPO,
  (newVal) => {
    listData.value = newVal;
  }
);
</script>

<style scoped></style>
