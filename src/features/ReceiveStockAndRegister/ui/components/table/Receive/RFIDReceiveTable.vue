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
        <label class="text-lg font-bold">RFID Summary Receive</label>
        <div class="flex gap-3">
          <Button
            :disabled="RECEIVE_STORE.editReceiveId != null"
            class="w-40"
            severity="info"
            label="Clear"
          ></Button>
          <Button
            :disabled="RECEIVE_STORE.editReceiveId != null"
            class="w-40"
            :label="isScan ? 'STOP SCAN' : 'START SCAN'"
            :icon="isScan ? 'pi pi-stop-circle' : 'pi pi-play-circle'"
            @click="handleStart"
            :class="isScan ? 'p-button-danger' : 'p-button-secondary'"
          />
        </div>
      </div>
    </template>

    <!-- RFID -->
    <Column field="rfid" header="RFID" />
    <!-- SKU -->
    <Column field="Barcode" header="BARCODE" />
    <!-- SKU -->
    <Column field="SKU" header="SKU" />

    <!-- Product Code -->
    <Column field="ProductCode" header="Product Code" />

    <!-- Color -->
    <Column field="Color" header="Color" />

    <!-- Size -->
    <Column field="Size" header="Size" />

    <!-- Status (Custom Body) -->
    <Column field="Status" header="Status">
      <template #body="$slotProps">
        <span
          class="p-3 rounded-2xl bg-red-400 text-red-900 font-semibold text-md"
          v-if="$slotProps.data.Status"
        >
          <i class="pi pi-times" style="font-size: 1rem"></i>
        </span>
        <span
          class="p-3 rounded-2xl bg-green-400 text-green-900 font-semibold text-md"
          v-else
        >
          <i class="pi pi-check" style="font-size: 1rem"></i>
        </span>
      </template>
    </Column>

    <!-- Action -->
    <Column header="Actions">
      <template #body="$slotProps">
        <Button
          :disabled="RECEIVE_STORE.editReceiveId != null"
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
        />
      </template>
    </Column>
    <ColumnGroup type="footer">
      <Row>
        <Column footer="Totals:" :colspan="2" footerStyle="text-align:right" />
        <Column :footer="RECEIVE_STORE.listDataRFIDPO.length.toString()" />
      </Row>
    </ColumnGroup>
  </DataTable>
  <RFIDModal v-model:visible="visible" title="Add RFID Item">
    <RFIDDetailForm />
  </RFIDModal>
</template>

<script setup lang="ts">
import type {
  RFIDPOBody,
  RFIDType,
} from "@/features/ReceiveStockAndRegister/types/rfidtype";
import { onMounted, onUnmounted, ref, watch } from "vue";
import RFIDModal from "../../modal/RFIDModal.vue";
import RFIDDetailForm from "../../../form/RFIDDetailForm.vue";
import { startRfid, stopRfid } from "@/lib/api/RFID";
import { receiveStockStore } from "@/features/ReceiveStockAndRegister/store/receiveStockStore";
import { useMaster } from "@/stores/MasterStore";
import { useSignalR } from "@/composable/useSignalR";
import { useFPSWarehouseCompos } from "../../../composables/useFPSWarehouseCompos";
import type { WarehouseRFIdItem } from "@/features/ReceiveStockAndRegister/dto/CreateWarehouseReceiveDTO";

const signalR = useSignalR(import.meta.env.VITE_HUB_URL);
const listData = ref<RFIDPOBody[]>([]);
const Total = ref<number>(10);
const props = defineProps<{}>();
const visible = ref<boolean>(false);
const isScan = ref<boolean>(false);
const rfidInWarehouse = ref<WarehouseRFIdItem[]>([]);
const RECEIVE_STORE = receiveStockStore();
const store = useMaster();
const { GetWarehouseRfids } = useFPSWarehouseCompos();
const handleStart = async () => {
  isScan.value = !isScan.value;
  isScan.value ? await startRfid() : await stopRfid();
};

// RFID Reader
onMounted(async () => {
  await signalR.startConnection();
  if (signalR.isConnected.value) {
    signalR.onEvent("ReceiveRFIDUpdate", (message: any) => {
      console.log(message);
    });
    signalR.onEvent("ReceiveRFIDData", (message: any) => {
      let rangeValue = 0;
      if (store.RANGE_READER === "Close") {
        rangeValue = -33;
      }
      if (store.RANGE_READER === "Medium") {
        rangeValue = -55;
      }
      if (store.RANGE_READER === "High") {
        rangeValue = -85;
      } else {
        rangeValue = -999;
      }
      if (message.rssi > rangeValue) {
        let newItem: RFIDType = {
          rfid: message.epc,
          status: message.isOut,
          sku: message.sku,
        };

        let detail = rfidInWarehouse.value.find((t) => t.rfid == newItem.rfid);
        // console.log(detail);
        if (detail) {
          var existData = listData.value.filter((t) => t.rfid == newItem.rfid);
          if (existData.length > 0) {
            return;
          }
          let newBody: RFIDPOBody = {
            rfid: newItem.rfid,
            POno: detail?.poNo,
            POItemNo: (detail as any).poItemNo,
            Color: detail.colorCode,
            Size: detail.size,
            SKU: detail.sku,
            Barcode: "",
            Unit: detail.uom,
            ProductCode: detail.itemCode,
            Status: newItem.status,
          };
          listData.value.push(newBody);
          RECEIVE_STORE.listDataRFIDPO = listData.value;
          console.log(RECEIVE_STORE.listDataRFIDPO);
        }

        // console.log(listData.value);
      }

      // const newEPC: AddRfidBySKURequest = {
      //   SKU: selectedSku.value,
      //   EPC: message.epc,
      // };
      // const index = requestData.value.findIndex((i) => i.EPC === newEPC.EPC);
      // if (index > -1) {
      //   requestData.value[index] = newEPC;
      // } else {
      //   requestData.value.push(newEPC);
      // }
    });
  }
});

onMounted(async () => {
  const res = await GetWarehouseRfids();
  rfidInWarehouse.value = res;
  console.log(res);
});

watch(listData, (newVal) => {
  RECEIVE_STORE.listDataRFIDPO = newVal;
});
watch(
  () => RECEIVE_STORE.listDataRFIDPO,
  (newVal) => {
    listData.value = newVal;
  }
);

onUnmounted(async () => {
  await stopRfid();
  RECEIVE_STORE.listDataRFIDPO = [];
});
</script>

<style scoped></style>
