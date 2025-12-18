import { defineStore } from "pinia";
import { ref } from "vue";
import type { ProductTransactionResult } from "../types/productOnlineType";
import type { RFIDPOBody } from "../types/rfidtype";

export const receiveStockStore = defineStore("receiveStock", () => {
  const editReceiveId = ref<string | null>(null);
  const listDataRFIDPO = ref<RFIDPOBody[]>([]);
  return { editReceiveId, listDataRFIDPO };
});
