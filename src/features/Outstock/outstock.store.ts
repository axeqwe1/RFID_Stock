import { defineStore } from "pinia";
import { ref } from "vue";
import type { RequestOutItem, ScanOutStockRequest } from "./outstock.model";
import type { RFIDType } from "../ReceiveStockAndRegister/types/rfidtype";

export const outstockStore = defineStore("outstock", () => {
  const itemListRequest = ref<RequestOutItem[]>([]);
  const requestScanOutstock = ref<ScanOutStockRequest | null>(null);
  const listDataRFIDPO = ref<RequestOutItem[]>([]);
  const OUT_EDITID = ref<string | null>(null);
  return { itemListRequest, requestScanOutstock, listDataRFIDPO, OUT_EDITID };
});
