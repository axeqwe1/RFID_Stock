<template>
  <div class="card flex justify-center">
    <Toast />

    <div class="flex flex-row items-center justify-center gap-4 w-full">
      <div class="flex flex-col gap-1 w-full">
        <label>SKU</label>
        <Select
          v-model="selectedSku"
          :options="skuList"
          filter
          placeholder="Select a Sku"
          class="w-full md:w-56"
          :disabled="!isScan"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center">
              <div>{{ slotProps.value }}</div>
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
          <template #option="slotProps">
            <div class="flex items-center">
              <div>{{ slotProps.option }}</div>
            </div>
          </template>
        </Select>
      </div>
    </div>
    <Button @click="visible = true" severity="primary" label="Submit" />

    <DataTableComponent
      @startscan="onScan"
      @clear="onClear"
      :targetQty="initialValues.targetQty"
      :listData="listData"
      :invalidCount="invalidCount"
      :NotConnectCount="NotConnectCount"
    />
  </div>
  <Dialog
    v-model:visible="visible"
    modal
    header="Confirm"
    :style="{ width: '25rem' }"
  >
    <span class="text-surface-500 dark:text-surface-400 block mb-8"
      >Are you sure to add <b>RFID</b> to data?</span
    >

    <div class="flex justify-end gap-2">
      <Button
        class="w-20"
        type="button"
        label="Cancel"
        severity="secondary"
        @click="visible = false"
      ></Button>
      <Button
        class="w-20"
        type="submit"
        label="Save"
        @click="submitForm"
      ></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
import Select from "primevue/select";
import { useToast } from "primevue/usetoast";
import DataTableComponent from "@/components/DataTableRegister.vue";
import Dialog from "primevue/dialog";
import InputNumber from "primevue/inputnumber";
import {
  createSignalRConnection,
  getSignalRConnection,
} from "@/services/signalRService";
import type { HubConnection } from "@microsoft/signalr";
import { startRfid, stopRfid } from "@/lib/api/RFID";
import type {
  AddRfidBySKURequest,
  AddRfidRequest,
} from "@/data/requestDTO/AddRFIDRequest";
import {
  AddRfidToProduct,
  AddRfidToProductBySKU,
  GetProductData,
} from "@/lib/api/Product";
import type { Product } from "@/types/type";
import { item } from "@primeuix/themes/aura/breadcrumb";
import type { AxiosResponse } from "axios";

const toast = useToast() as any;
const filteredProduct = ref<any[]>([]);
const datas = ref();
const visible = ref(false);
const formRef = ref();
const connection = ref<HubConnection | null>(null);
const listData = ref<string[]>([]);
const requestData = ref<AddRfidBySKURequest[]>([]);
const invalidCount = ref<number>(0);
const NotConnectCount = ref<number>(0);
const isScan = ref<boolean>(true);
const Productdata = ref<Product[]>([]);
const skuList = ref<string[]>([]);
const selectedSku = ref<string>("Select");
const isConnected = ref<boolean>(false);
// ใช้ any กับข้อมูลฟอร์ม เพราะ PrimeVue ต้องการ Record<string, any>
const initialValues = reactive({
  barcode: "",
  stylename: { style: "" },
  color: "",
  size: "",
  targetQty: 0,
});

// ใช้ type ตาม PrimeVue คาดหวัง
const resolver = (options: any) => {
  const { values } = options;
  const errors: any = {};

  if (!values.datas) {
    errors.username = [{ message: "Username is required." }];
  }

  return {
    values,
    errors,
  };
};

function resetData() {
  visible.value = false;
  initialValues.color = "";
  initialValues.stylename.style = "";
  initialValues.size = "";
  initialValues.barcode = "";
  listData.value = [];
  requestData.value = [];
  isScan.value = true;
}
// ใช้ type ตาม PrimeVue คาดหวัง
const onFormSubmit = async () => {
  // console.log(requestData.value.map((item) => item.EPC).length);
  if (validateField() && requestData.value.map((item) => item.EPC).length > 0) {
    const res = (await AddRfidToProductBySKU(
      requestData.value
    )) as AxiosResponse;
    if (res.status === 200) {
      resetData();
      toast.add({
        severity: "success",
        summary: "Add RFID to Product Success.",
        detail: `Add RFID to Product Success !`,
        life: 3000,
      });
    }
    if (res.status === 400) {
      const resError: any = res;
      let error: any[] = [];
      error = resError.response.data;

      // ต่อ array เป็น string แยกด้วย comma หรือ newline
      let errorMessage = "";
      errorMessage = error.join(", "); // หรือ "\n" ถ้าอยากขึ้นบรรทัดใหม่

      toast.add({
        severity: "error",
        summary: "Fail to add RFID to product.",
        detail: `${errorMessage}!`,
        life: 10000,
      });
    }
  } else {
    toast.add({
      severity: "error",
      summary: "Notfound any RFID.",
      detail: `Notfound any RFID in Request!`,
      life: 3000,
    });
  }
};
const submitForm = () => {
  formRef.value.submit(); // เรียก submit ผ่าน ref
};
const onScan = async (isScaned: boolean) => {
  console.log(isScaned);

  if (isScaned && !validateField()) {
    await stopRfid();
    invalidCount.value++;
  } else {
    if (requestData.value.length < 1 && isConnected.value) {
      isScan.value = !isScaned;
    }
    isScaned ? await startRfid() : await stopRfid();
  }
  if (!isConnected.value) {
    // await stopRfid();
    toast.add({
      severity: "error",
      summary: "Please connect the RFID device.",
      detail: `Please connect the RFID device!`,
      life: 3000,
    });
    isScan.value = true;
    NotConnectCount.value++;
  }
};
const onClear = (clear: boolean) => {
  if (clear) {
    listData.value = [];
    requestData.value = [];
    initialValues.barcode = "";
    initialValues.stylename.style = "";
    initialValues.color = "";
    initialValues.size = "";
    initialValues.targetQty = 0;
    isScan.value = clear;
    stopRfid();
  }
};
onMounted(async () => {
  if (connection.value?.state === "Connected") {
    return;
  }
  createSignalRConnection(import.meta.env.VITE_HUB_URL);
  connection.value = getSignalRConnection();
  let rangeSetting = localStorage.getItem("rangeSetting");
  let rangeValue = 0;
  if (rangeSetting === "Close") {
    rangeValue = -33;
  }
  if (rangeSetting === "Medium") {
    rangeValue = -55;
  }
  if (rangeSetting === "High") {
    rangeValue = -85;
  }
  if (connection.value) {
    connection.value.on("ReceiveRFIDUpdate", (message) => {
      console.log(message);
      if (message == "NotConnect") {
        isConnected.value = false;
        stopRfid();
        NotConnectCount.value++;
      } else {
        toast.add({
          severity: "success",
          summary: "Connect RFID Scanner.",
          detail: `Connect RFID Scanner Success!`,
          life: 3000,
        });
        isConnected.value = true;
      }
    });
    connection.value.on("ReceiveRFIDData", (message) => {
      isConnected.value = true;
      if (message.RSSI > rangeValue) {
        listData.value.push(message.EPC);
        listData.value = [...new Set(listData.value)];
      }

      const newEPC: AddRfidBySKURequest = {
        SKU: initialValues.barcode,
        EPC: message,
      };
      const index = requestData.value.findIndex((i) => i.EPC === newEPC.EPC);
      if (index > -1) {
        requestData.value[index] = newEPC;
      } else {
        requestData.value.push(newEPC);
      }
      console.log(requestData.value);
    });
    try {
      await connection.value.start();
      console.log("SignalR Connected.");
    } catch (err) {
      console.error("SignalR Connection Error: ", err);
    }
  } else {
  }
  datas.value = [{ name: "test" }];
});

function validateField() {
  // ตรวจสอบว่ามี field ใดว่างเปล่าหรือไม่
  if (
    initialValues.barcode.trim() === "" ||
    initialValues.stylename.style.trim() === "" ||
    initialValues.color.trim() === "" ||
    initialValues.size.trim() === "" ||
    initialValues.targetQty < 0 ||
    initialValues.targetQty == null
  ) {
    // แสดงข้อความแจ้งเตือน
    toast.add({
      severity: "error",
      summary: "Request is invalid", // หรือ "ส่งข้อมูลไม่สำเร็จ"
      detail: "Please complete all required fields", // หรือ "Please complete all required fields."
      life: 3000,
    });
    // เพิ่มการ return false เพื่อบอกว่าการ validate ไม่ผ่าน
    return false;
  }
  // return true หากทุกอย่างถูกต้อง
  return true;
}

watch(requestData, (newVal) => {
  if (requestData.value.length > 0) {
    isScan.value = false;
  }
});

onMounted(async () => {
  await stopRfid();
  const fetchData = async () => {
    const res = await GetProductData();
    Productdata.value = res.data;
  };
  await fetchData();
  skuList.value = Productdata.value.map((item) => item.sku);
  console.log(Productdata.value);
});
onUnmounted(() => {
  // หยุด connection เมื่อ component ถูก unmount
  if (connection.value) {
    connection.value.off("ReceiveRFIDUpdate");
    connection.value.off("ReceiveRFIDData");
    connection.value.stop();
    stopRfid();
  }
});
</script>
