import { defineStore } from "pinia";
import { ref } from "vue";

export const useMaster = defineStore("master", () => {
  const MASTER_PRODUCT = ref();
  const IP = ref<string>("");
  const PORT = ref<string>("");
  const SETNETWORK = async (IPConf: string, PORTConf: string) => {
    IP.value = IPConf;
    PORT.value = PORTConf;
    localStorage.setItem("IP", IP.value);
    localStorage.setItem("PORT", PORT.value);
  };
  const FETCH_MASTER_DATA = async () => {
    try {
    } catch (err: any) {
      throw err;
    }
  };

  return { MASTER_PRODUCT, FETCH_MASTER_DATA, IP, PORT, SETNETWORK };
});
