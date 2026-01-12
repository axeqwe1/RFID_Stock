<template>
  <DataTable
    :value="listData"
    paginator
    :rows="5"
    removableSort
    :rowsPerPageOptions="[5, 10, 20, 50]"
    :scrollable="true"
    scrollHeight="300px"
    showGridlines
    size="small"
    :pt="{
      bodyCell: ({ context } : any) => {
        // context.field === ชื่อ field ของ column
        // context.rowData === ข้อมูล row นั้น
        // context.index === row index

        if (context.field === 'status') {
          return { class: 'bg-red-100 text-red-600 font-bold' };
          // if (context.rowData.status === 'urgent') {
          //   return { class: 'bg-red-100 text-red-600 font-bold' };
          // }
        }



        return {}; // default ไม่มีอะไร
      },
    }"
  >
    <template #header>
      <div
        class="w-full flex-row justify-between items-center flex border-b-2 pb-3"
      >
        <div class="flex flex-col space-x-2">
          <label
            v-if="RECEIVE_STORE.listDataRFIDPO.length > 0"
            class="text-sm text-green-500 font-semibold"
            >added : {{ RECEIVE_STORE.listDataRFIDPO.length }}</label
          >
          <label class="text-lg font-bold">RFID List</label>
          <label class="text-sm text-gray-400 font-semibold"
            >Total : {{ listData.length }} / {{ maxScaned ?? 0 }}</label
          >
          <label
            v-if="listData.filter((item) => item.status).length > 0"
            class="text-sm text-rose-500 font-semibold"
            >duplicate :
            {{ listData.filter((item) => item.status).length }} !</label
          >
        </div>

        <div class="col-span-2 flex items-end gap-2">
          <Button
            @click="handleAddRfid"
            severity="success"
            label="ADD RFID"
            :disabled="
              listData.length !== maxScaned ||
              listData.filter((item) => !item.status).length > 0 ||
              listData.length === 0
            "
          ></Button>
          <Button
            severity="info"
            label="Clear"
            @click="
              () => {
                listData = [];
              }
            "
          />
          <Button
            class="w-40"
            :label="isScan ? 'STOP SCAN' : 'START SCAN'"
            :icon="isScan ? 'pi pi-stop-circle' : 'pi pi-play-circle'"
            @click="handleStart"
            :class="isScan ? 'p-button-danger' : 'p-button-secondary'"
          />
        </div>
      </div>
    </template>
    <Column field="rfid" header="RFID" />
    <Column field="status" header="Status" sortable>
      <template #body="$slotProps">
        <span
          class="p-3 rounded-2xl bg-red-400 text-red-900 font-semibold text-md"
          v-if="!$slotProps.data.status"
          ><i class="pi pi-times" style="font-size: 1rem"></i>
        </span>

        <span
          class="p-3 rounded-2xl bg-green-400 text-green-900 font-semibold text-md"
          v-else
        >
          <i class="pi pi-check" style="font-size: 1rem"></i>
          <span> Can Register </span>
        </span>
      </template>
    </Column>
    <Column>
      <template #body="$slotProps">
        <Button
          label="Remove"
          class="p-button-danger"
          @click="
            () => {
              const index = listData.findIndex(
                (item) => item.rfid === $slotProps.data.rfid
              );
              if (index !== -1) {
                listData.splice(index, 1);
              }
            }
          "
        />
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import { useSignalR } from "@/composable/useSignalR";
import { CheckEPCOutStock } from "@/features/Outstock/outstock.api";
import type { ScanOutStockRequest } from "@/features/Outstock/outstock.model";
import { receiveStockStore } from "@/features/ReceiveStockAndRegister/store/receiveStockStore";
import type { RFIDType } from "@/features/ReceiveStockAndRegister/types/rfidtype";
import { CheckEPC, startRfid, stopRfid } from "@/lib/api/RFID";
import { useMaster } from "@/stores/MasterStore";
import type { bodyCell } from "@primeuix/themes/aura/datatable";
import { onMounted, onUnmounted, ref, watch } from "vue";

const signalR = useSignalR(import.meta.env.VITE_HUB_URL);
const listData = ref<RFIDType[]>([]);
const store = useMaster();
// const props = defineProps<{}>();
const emit = defineEmits<{ (e: "addrfid", value: RFIDType[]): void }>();
const props = defineProps<{
  receiveQty: number;
  request: ScanOutStockRequest | null;
}>();
const isScan = ref<boolean>(false);
const RECEIVE_STORE = receiveStockStore();
const maxScaned = ref<number>(props.receiveQty);
const handleStart = async () => {
  isScan.value = !isScan.value;
  isScan.value
    ? await startRfid(store.IP, store.PORT)
    : await stopRfid(store.IP, store.PORT);
};

const handleAddRfid = () => {
  emit("addrfid", listData.value);
  stopRfid(store.IP, store.PORT);
  isScan.value = false;
  listData.value = [];
};
onMounted(async () => {
  await signalR.startConnection();
  if (signalR.isConnected.value) {
    signalR.onEvent("ReceiveRFIDUpdate", (message: any) => {
      console.log(message);
    });
    signalR.onEvent("ReceiveRFIDData", async (message: any) => {
      let rangeValue = -999;
      if (store.RANGE_READER === "Close") {
        rangeValue = -30;
      }
      if (store.RANGE_READER === "Medium") {
        rangeValue = -55;
      }
      if (store.RANGE_READER === "High") {
        rangeValue = -85;
      }
      // console.log(rangeValue);
      if (message.rssi > rangeValue) {
        const existData = listData.value.find(
          (item) => item.rfid === message.epc
        );
        if (!existData && props.request != null) {
          const EPCDDetail = await CheckEPCOutStock(message.epc, props.request);
          console.log(EPCDDetail);
          let newItem: RFIDType = {
            rfid: message.epc,
            status: EPCDDetail.isFound,
            sku: EPCDDetail.sku,
          };
          const inList = RECEIVE_STORE.listDataRFIDPO.find(
            (item) => item.rfid === newItem.rfid
          );
          if (inList != null) {
            newItem.status = true;
            newItem.sku = inList.SKU;
          }

          console.log(maxScaned.value + " " + listData.value.length);
          listData.value.push(newItem);
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

onUnmounted(async () => {
  await stopRfid(store.IP, store.PORT);
});

watch(
  () => props.receiveQty,
  (newVal) => {
    maxScaned.value = newVal;
  }
);

watch(
  () => RECEIVE_STORE.listDataRFIDPO,
  (newVal) => {
    listData.value = [];
  }
);

watch(
  () => props.request,
  (newVal) => {
    console.log("Request changed:", newVal);
  }
);
</script>

<style scoped></style>
