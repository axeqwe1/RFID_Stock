<template>
  <div class="card flex justify-center">
    <Toast />

    <Form
      ref="formRef"
      v-slot="$form"
      :initialValues
      :resolver
      @submit="onFormSubmit"
      class="flex flex-col gap-4 w-full max-w-[1300px] mx-auto"
    >
      <div class="flex flex-row items-center justify-center gap-4 w-full">
        <div class="flex flex-col gap-1 w-full relative">
          <label>Barcode</label>
          <InputText
            v-model="initialValues.barcode"
            name="barcode"
            :disabled="!isScan"
            type="text"
            placeholder="Barcode"
            fluid
          />
          <button @click="searchBarcode" class="absolute top-7 right-0 btn">
            Search
          </button>
          <Message
            v-if="$form.productname?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.productname.error?.message }}</Message
          >
        </div>
        <div class="flex flex-col gap-1 w-full">
          <label>Style</label>
          <AutoComplete
            name="stylename.style"
            placeholder="style"
            optionLabel="style"
            :disabled="!isScan"
            :suggestions="filteredProduct"
            v-model="initialValues.stylename.style"
            @complete="searchProduct"
            fluid
          />

          <Message
            v-if="$form.style?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.style.error?.message }}</Message
          >
        </div>
        <div class="flex flex-col gap-1 w-full">
          <label>Color</label>
          <InputText
            v-model="initialValues.color"
            name="color"
            :disabled="!isScan"
            type="text"
            placeholder="Color"
            fluid
          />
          <Message
            v-if="$form.color?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.color.error?.message }}</Message
          >
        </div>
        <div class="flex flex-col gap-1 w-full">
          <label>Size</label>
          <InputText
            v-model="initialValues.size"
            name="size"
            :disabled="!isScan"
            type="text"
            placeholder="Size"
            fluid
          />
          <Message
            v-if="$form.size?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.size.error?.message }}</Message
          >
        </div>
        <div class="flex flex-col gap-1 w-full">
          <label>Target Qty (Optional)</label>
          <InputNumber
            v-model="initialValues.targetQty"
            name="targetQty"
            type="number"
            :disabled="!isScan"
            placeholder="Target QTY"
            fluid
            :min="0"
          />
          <Message
            v-if="$form.targetQty?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.targetQty.error?.message }}</Message
          >
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
    </Form>
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
import type { AddRfidRequest } from "@/data/requestDTO/AddRFIDRequest";
import { AddRfidToProduct, GetProductData } from "@/lib/api/Product";
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
const requestData = ref<AddRfidRequest[]>([]);
const invalidCount = ref<number>(0);
const NotConnectCount = ref<number>(0);
const isScan = ref<boolean>(true);
const Productdata = ref<Product[]>([]);
const styleList = ref<{ style: string }[]>([]);
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

const searchProduct = (event: any) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredProduct.value = [...Productdata.value];
    } else {
      // filter ตาม query
      let temp = Productdata.value.filter((data) =>
        data.style.toLowerCase().startsWith(event.query.toLowerCase())
      );

      // unique ตาม style โดยเก็บ object ครบ
      const uniqueMap = new Map<string, (typeof temp)[0]>();
      temp.forEach((item) => {
        if (!uniqueMap.has(item.style)) {
          uniqueMap.set(item.style, item);
        }
      });

      filteredProduct.value = Array.from(uniqueMap.values());

      // ถ้าต้องการสร้าง styleList (แค่ style) แยกออก
      filteredProduct.value = filteredProduct.value.map((item) => ({
        style: item.style,
      }));

      console.log(filteredProduct.value);
      console.log(styleList.value);
    }
  }, 250);
};
const searchBarcode = (event: Event) => {
  event.preventDefault();
  const filterBarcode = Productdata.value.find((item) => {
    return initialValues.barcode === item.barcode;
  });

  if (filterBarcode) {
    initialValues.color = filterBarcode.color;
    initialValues.stylename.style = filterBarcode.style;
    initialValues.size = filterBarcode.size;
  } else {
    initialValues.color = "";
    initialValues.stylename.style = "";
    initialValues.size = "";
    toast.add({
      severity: "warn",
      summary: "Not Found data in Barcode.",
      detail: `Not Found data in Barcode !`,
      life: 3000,
    });
  }
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
const onFormSubmit = async (event: any) => {
  const { valid, values } = event;
  // console.log(requestData.value.map((item) => item.EPC).length);
  if (validateField() && requestData.value.map((item) => item.EPC).length > 0) {
    const res = (await AddRfidToProduct(requestData.value)) as AxiosResponse;
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
      // console.log(message);
      isConnected.value = true;
      listData.value.push(message);
      listData.value = [...new Set(listData.value)];
      const newEPC: AddRfidRequest = {
        Barcode: initialValues.barcode,
        Style: initialValues.stylename.style,
        Color: initialValues.color,
        Size: initialValues.size,
        targetQty: initialValues.targetQty,
        EPC: message,
      };
      const index = requestData.value.findIndex((i) => i.EPC === newEPC.EPC);
      if (index > -1) {
        requestData.value[index] = newEPC; // update ตัวเก่า
      } else {
        requestData.value.push(newEPC); // insert ตัวใหม่
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
