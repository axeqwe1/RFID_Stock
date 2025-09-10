import { defineStore } from "pinia";
import { ref } from "vue";

export const useMaster = defineStore("master", () => {
  const MASTER_PRODUCT = ref();
  const FETCH_MASTER_DATA = async () => {
    try {
    } catch (err: any) {
      throw err;
    }
  };

  return { MASTER_PRODUCT, FETCH_MASTER_DATA };
});
