<template>
  <div class="max-w-[1600px] mx-auto">
    <div class="grid grid-cols-6 gap-6">
      <div class="col-span-3 space-y-2">
        <label for="PoNo" class="font-semibold">PO NO.</label>
        <div class="flex gap-2">
          <Select
            v-model="PoSelection"
            :options="PoOptions"
            option-label="poNo"
            name="POno"
            placeholder="Select a PO No."
            class="w-full"
            fluid
            filter
          />
        </div>
        <div class="col-span-6 space-y-2">
          <label for="PoNo" class="font-semibold">Receive Qty</label>
          <div class="flex gap-2">
            <InputNumber
              v-model="receiveQty"
              class="flex-1 mt-1"
              size="small"
              name="quantity"
              label="Quantity"
              fluid
              :max="selectData ? selectData.balanceQty : 0"
              :disabled="selectData == null"
            />
          </div>
        </div>
        <DataTable
          :value="listData"
          v-model:selection="selectData"
          selectionMode="single"
          paginator
          :rows="5"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          showGridlines
          scrollable
          scrollHeight="300px"
        >
          <Column
            v-for="col in InternalPoDetailColumns"
            :key="col.field"
            :field="col.field"
            :header="col.header"
          >
          </Column>
        </DataTable>
      </div>

      <div class="col-span-3 card shadow-xl mt-3">
        <RFIDTable @addrfid="AddRfid" :receive-qty="receiveQty" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RFIDTable from "../components/table/RFIDTable.vue";

import Select from "primevue/select";
import { PoDetailColumns } from "../components/table/columns/RFIDFormTableColumn";
import { nextTick, onMounted, ref, watch } from "vue";
import { apiService } from "@/lib/service";
import type { PODescType } from "../../types/poType";
import type { POProductDetailDTO } from "@/dto/response/POProductDetailDTO";
import type { RFIDPOBody, RFIDType } from "../../types/rfidtype";
const emit = defineEmits<{ (e: "AddRFIDData", value: RFIDPOBody[]): void }>();
const InternalPoDetailColumns = ref(PoDetailColumns);
const selectData = ref<any>(null);
const PoSelection = ref<any>();
const receiveQty = ref<number>(0);

const listData = ref<POProductDetailDTO[]>([]);
const PoOptions = ref<PODescType[]>([]);

const AddRfid = async (value: RFIDType[]) => {
  await nextTick(); // รอให้ selectData อัปเดตครบก่อน

  const RFIDPOBody: RFIDPOBody[] = value.map((item) => ({
    rfid: item.rfid,
    ProductCode: selectData.value.itemCode,
    POno: PoSelection.value.poNo,
    SKU: selectData.value.sku,
    Color: selectData.value.colorCode,
    Size: selectData.value.size,
    Unit: selectData.value.uom,
    POItemNo: selectData.value.poItemNo,
  }));
  emit("AddRFIDData", RFIDPOBody);
};

onMounted(async () => {
  const res = await apiService.get("/rfidApi/PurchasePO/GetPoDesc/options");
  PoOptions.value = res.data.data;
  console.log(res);
});

watch(PoSelection, async (newVal) => {
  console.log("Selected PO No:", newVal.poNo);
  if (newVal.poNo != null) {
    const res = await apiService.get(
      `/rfidApi/PurchasePO/GetPoDetail/${newVal.poNo}`
    );
    if (res.data.data == null) {
      listData.value = [];
      return;
    }
    listData.value = res.data.data;
    console.log(res);
  }
});

watch(selectData, async (newVal) => {
  console.log("Selected Data:", selectData.value);
  if (newVal) {
    receiveQty.value = newVal.balanceQty;
  } else {
    receiveQty.value = 0;
  }
});

watch(receiveQty, (newVal) => {
  console.log("Receive Qty Changed:", newVal);
});
</script>

<style scoped></style>
