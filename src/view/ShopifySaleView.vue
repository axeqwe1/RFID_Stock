<template>
  <div class="card flex justify-center">
    <Toast />

    <div class="bg-surface-50 dark:bg-surface-950 px-3 mb-6">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
        <div class="bg-surface-0 dark:bg-surface-900 shadow-sm p-5 rounded-2xl">
          <div class="flex justify-between gap-4">
            <div class="flex flex-col gap-2">
              <span
                class="text-surface-700 dark:text-surface-300 font-normal leading-tight"
                >Total Quantity</span
              >
              <div
                class="text-surface-900 dark:text-surface-0 font-semibold text-2xl! leading-tight!"
              >
                {{
                  new Intl.NumberFormat("th-TH", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }).format(totalqty ? totalqty : 0)
                }}
                PC.
              </div>
            </div>
            <div
              class="flex items-center justify-center bg-linear-to-b from-cyan-400 dark:from-cyan-300 to-cyan-600 dark:to-cyan-500 rounded-lg w-10 h-10"
            >
              <i
                class="pi pi-verified text-surface-0 dark:text-surface-900 text-xl! leading-none!"
              />
            </div>
          </div>
          <div class="mt-4">
            <!-- <span
              class="text-surface-600 dark:text-surface-300 font-medium leading-tight"
              >24 new</span
            > -->
            <span class="text-surface-500 dark:text-surface-300 leading-tight">
              from filter data</span
            >
          </div>
        </div>

        <div class="bg-surface-0 dark:bg-surface-900 shadow-sm p-5 rounded-2xl">
          <div class="flex justify-between gap-4">
            <div class="flex flex-col gap-2">
              <span
                class="text-surface-700 dark:text-surface-300 font-normal leading-tight"
                >Total Net Sales</span
              >
              <div
                class="text-surface-900 dark:text-surface-0 font-semibold text-2xl! leading-tight!"
              >
                {{
                  new Intl.NumberFormat("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(netsales ? netsales : 0)
                }}
                THB
              </div>
            </div>
            <div
              class="flex items-center justify-center bg-linear-to-b from-orange-400 dark:from-orange-300 to-orange-600 dark:to-orange-500 rounded-lg w-10 h-10"
            >
              <i
                class="pi pi-money-bill text-surface-0 dark:text-surface-900 text-xl! leading-none!"
              />
            </div>
          </div>
          <div class="mt-4">
            <!-- <span
              class="text-surface-600 dark:text-surface-300 font-medium leading-tight"
              >48 new</span
            > -->
            <span class="text-surface-500 dark:text-surface-300 leading-tight">
              from filter data</span
            >
          </div>
        </div>
      </div>
    </div>

    <DataTableShopifySale
      @on-filter="onFilter"
      :product-details="productList"
    />
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
import type { Product, SalesDaily } from "@/types/type";
import { item } from "@primeuix/themes/aura/breadcrumb";
import type { AxiosResponse } from "axios";
import DataTableShopifySale from "@/components/DataTableShopifySale.vue";
import { GetSalesDaily } from "@/lib/api/Sales";
// 🎯 วิธีที่ 1: ใช้ type ที่ PrimeVue คาดหวัง (ง่ายที่สุด)
const toast = useToast() as any;
const productList = ref<SalesDaily[]>([]);

const netsales = ref<number>(0);
const totalqty = ref<number>(0);
function onFilter(totalQty: number, totalNetSale: number) {
  netsales.value = totalNetSale;
  totalqty.value = totalQty;
  console.log("parent", netsales.value, netsales.value);
}

onMounted(async () => {
  const fetchData = async () => {
    const res = await GetSalesDaily();

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
