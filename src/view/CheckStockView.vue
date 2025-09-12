<template>
  <div class="card flex justify-center">
    <Toast />
    <DataTableCheckStock :product-details="productList" />
  </div>
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
import DataTableCheckStock from "@/components/DataTableCheckStock.vue";
// 🎯 วิธีที่ 1: ใช้ type ที่ PrimeVue คาดหวัง (ง่ายที่สุด)
const toast = useToast() as any;
const productList = ref<Product[]>([]);

onMounted(async () => {
  const fetchData = async () => {
    const res = await GetProductData();

    console.log(res.data);
    productList.value = res.data;
  };

  await fetchData();
});
</script>
<!-- 
💡 ทำไมต้องใช้ any?

PrimeVue Form component ยังไม่มี TypeScript support ที่สมบูรณ์
มันคาดหวัง:
- Record<string, any> แทนที่จะเป็น interface ที่เราสร้าง
- FormResolverOptions แทนที่จะเป็น { values: FormData }
- FormSubmitEvent แทนที่จะเป็น { valid: boolean, values?: FormData }

🚀 ทางเลือก:
1. ใช้ any (ง่ายสุด - แนะนำสำหรับเริ่มต้น)
2. สร้าง type definitions เอง (ซับซ้อน)
3. รอ PrimeVue อัพเดท TypeScript support

✅ ข้อดีของ any ในกรณีนี้:
- เขียนได้เร็ว ไม่ติด type error
- ยังคงได้ประโยชน์จาก Vue 3 TypeScript
- สามารถ type-check ส่วนอื่นได้ตามปกติ
-->
