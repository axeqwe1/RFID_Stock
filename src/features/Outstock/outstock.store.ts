import { defineStore } from "pinia";
import { ref } from "vue";
import type { RequestOutItem } from "./outstock.model";

export const outstockStore = defineStore("outstock", () => {
  const itemListRequest = ref<RequestOutItem[]>([]);

  return { itemListRequest };
});
