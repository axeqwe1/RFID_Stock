<template>
  <div
    class="bg-linear-to-b from-white dark:from-base-200 to-green-100 dark:togreen-900 p-5 rounded-2xl shadow-md"
  >
    <div v-if="isLoading">Loading...</div>
    <div>
      <!-- TOTAL_QTY: number;
  TOTAL_PRICE: number;
  TOTAL_PRODUCT: number; -->
      <Toast />
      <CardSection
        :TOTAL_QTY="TOTAL_QUANTITY"
        :TOTAL_PRICE="TOTAL_PRICE"
        :TOTAL_PRODUCT="TOTAL_PRODUCTS"
      />
      <DataTableScanStock
        @scan="onScan"
        @clear="onClear"
        :product-details="ProductDetailList"
        :-not-connect-count="NotConnectCount"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CardSection from "@/components/CardSection.vue";
import DataTableScanStock from "@/components/DataTableScanStock.vue";
import { useToast } from "primevue/usetoast";
import { startRfid, stopRfid } from "@/lib/api/RFID";
import {
  createSignalRConnection,
  getSignalRConnection,
} from "@/services/signalRService";
import type { HubConnection } from "@microsoft/signalr";
import { onMounted, onUnmounted, ref, watch } from "vue";
import {
  GetAllProductRFID,
  GetProductData,
  GetProductRFID,
} from "@/lib/api/Product";
import {
  type Product,
  type ProductDetail,
  type ProductRFID,
} from "@/types/type";
const connection = ref<HubConnection | null>(null);
const isConnected = ref<boolean>(false);
const NotConnectCount = ref<number>(0);
const listData = ref<string[]>([]);
const Productdata = ref<Product[]>([]);
const ProductRfidData = ref<ProductRFID[]>([]);
const ProductDetailList = ref<ProductDetail[]>([]);
const TOTAL_QUANTITY = ref<number>(0);
const TOTAL_PRICE = ref<number>(0);
const TOTAL_PRODUCTS = ref<number>(0);
const toast = useToast();
let Products: Product[] = [];
const isLoading = ref<boolean>(false);
let tempDetail: ProductDetail[] = [];
async function onScan(isScan: boolean) {
  isScan ? await startRfid() : await stopRfid();
  if (!isConnected.value) {
    toast.add({
      severity: "error",
      summary: "Please connect the RFID device.",
      detail: `Please connect the RFID device!`,
      life: 3000,
    });

    NotConnectCount.value++;
  }
}
function onClear(clear: boolean) {
  ProductDetailList.value = [];
  tempDetail = [];
}

onMounted(async () => {
  await stopRfid();
  isLoading.value = true;
  const fetchData = async () => {
    const res = await GetProductData();
    const rfid = await GetAllProductRFID();
    console.log(res.data);
    Products = res.data;
    Productdata.value = res.data;
    ProductRfidData.value = rfid.data;
  };

  await fetchData();
  isLoading.value = false;
  console.log(Productdata.value);
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

    connection.value.on("ReceiveRFIDData", async (message) => {
      // console.log(message);
      console.log(tempDetail);
      const rfidData = ProductRfidData.value.find(
        (item) => item.rfid == message
      );
      if (rfidData) {
        const productData = Productdata.value.find((item) => {
          return item.sku == rfidData?.sku;
        });

        const newDetail: ProductDetail = {
          ...productData,
          rfid: rfidData.rfid,
        } as ProductDetail;

        const index = tempDetail.findIndex(
          (item) => item.rfid === newDetail.rfid
        );
        if (index > -1) {
          tempDetail[index] = newDetail;
        } else {
          tempDetail.push(newDetail);
        }
        console.log(tempDetail);
        const productDetail = tempDetail.find(
          (item) => item.sku == rfidData.sku
        );

        const countData = tempDetail.filter((item) => {
          return item.sku === newDetail?.sku;
        }).length;
        if (productDetail) {
          productDetail.qty = countData;

          const index = ProductDetailList.value.findIndex(
            (i) => i.sku === productDetail?.sku
          );
          if (index > -1) {
            ProductDetailList.value[index] = productDetail;
          } else {
            ProductDetailList.value.push(productDetail);
          }
        }

        // const GROUP = new Set();
      }
      console.log(ProductDetailList.value);
      isConnected.value = true;
      listData.value.push(message);
      listData.value = [...new Set(listData.value)];
      TOTAL_QUANTITY.value = ProductDetailList.value.reduce(
        (ac, cur) => ac + cur.qty,
        0
      );
      TOTAL_PRICE.value = ProductDetailList.value.reduce(
        (ac, cur) => ac + cur.qty * cur.price,
        0
      );
      TOTAL_PRODUCTS.value = ProductDetailList.value.length;
      // bufferTimeout = setTimeout(() => {
      //   // ประมวลผลข้อมูลใน buffer
      //   messageBuffer.forEach(async (msg: any) => {
      //     const res = await GetProductRFID(msg);
      //     console.log(res);
      //     isConnected.value = true;
      //     listData.value.push(msg);
      //     // ลบ duplicate
      //     listData.value = [...new Set(listData.value)];
      //     messageBuffer.clear();
      //   }, 200);
      // }); // รอ 500ms
    });
    try {
      await connection.value.start();
      console.log("SignalR Connected.");
    } catch (err) {
      console.error("SignalR Connection Error: ", err);
    }
  } else {
  }
});
watch(ProductDetailList, () => {
  TOTAL_QUANTITY.value = ProductDetailList.value.reduce(
    (ac, cur) => ac + cur.qty,
    0
  );
  TOTAL_PRICE.value = ProductDetailList.value.reduce(
    (ac, cur) => ac + cur.qty * cur.price,
    0
  );
  TOTAL_PRODUCTS.value = ProductDetailList.value.length;
});
onMounted(async () => {
  console.log(ProductRfidData.value);
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

<style scoped></style>
