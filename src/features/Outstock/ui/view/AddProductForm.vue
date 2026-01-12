<template>
  <div class="space-y-6">
    <Form
      ref="formRef"
      v-slot="$form"
      :initialValues
      :resolver
      @submit="onFormSubmit"
      class="grid lg:grid-cols-1 gap-4 w-full card rounded-2xl"
    >
      <!-- <div
        class="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 mb-4 rounded-t-lg text-white font-bold text-lg"
      >
        CREATE REQUEST OUTSTOCK SCREEN
        <Button
          v-if="RECEIVE_STORE.editRequestId"
          severity="danger"
          label="Delete"
          @click="onDelete"
        />
      </div> -->

      <!-- Product Detail -->
      <div class="col-span-2 mt-4 border-t pt-4">
        <!-- <div class="font-bold text-lg mb-3 text-blue-700">Product Detail</div> -->

        <div class="grid grid-cols-4 gap-3">
          <!-- Product Code -->
          <div class="space-y-1">
            <label class="font-semibold">
              Product Code <span class="text-red-500">*</span>
            </label>
            <InputText
              name="productCode"
              size="small"
              placeholder="Enter Product Code"
              fluid
            />
            <Message
              v-if="$form.productCode?.invalid"
              severity="error"
              size="small"
            >
              {{ $form.productCode.error?.message }}
            </Message>
          </div>

          <!-- Color -->
          <div class="space-y-1">
            <label class="font-semibold">
              Color <span class="text-red-500">*</span>
            </label>
            <InputText
              name="color"
              size="small"
              placeholder="Enter Color"
              fluid
            />
            <Message v-if="$form.color?.invalid" severity="error" size="small">
              {{ $form.color.error?.message }}
            </Message>
          </div>

          <!-- Size -->
          <div class="space-y-1">
            <label class="font-semibold">
              Size <span class="text-red-500">*</span>
            </label>
            <InputText
              name="size"
              size="small"
              placeholder="Enter Size"
              fluid
            />
            <Message v-if="$form.size?.invalid" severity="error" size="small">
              {{ $form.size.error?.message }}
            </Message>
          </div>

          <!-- Qty -->
          <div class="space-y-1">
            <label class="font-semibold">
              Qty <span class="text-red-500">*</span>
            </label>
            <InputNumber
              name="qty"
              size="small"
              placeholder="Qty"
              :min="1"
              fluid
            />
            <Message v-if="$form.qty?.invalid" severity="error" size="small">
              {{ $form.qty.error?.message }}
            </Message>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            label="Add Product"
            class="mt-4"
            severity="success"
            fluid
          />
        </div>
      </div>
    </Form>
    <CreateRequestTable :showBtn="false" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { z } from "zod";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import type { FormSubmitEvent } from "@primevue/forms";
import { receiveStockStore } from "@/features/ReceiveStockAndRegister/store/receiveStockStore";
import type { RequestOutItem } from "../../outstock.model";
import { checkDetail, getUOM } from "../../outstock.api";
import { outstockStore } from "../../outstock.store";
import CreateRequestTable from "../components/table/CreateRequestTable.vue";
// ===== form ref =====
const formRef = ref();

const itemListRequest = ref<RequestOutItem[]>([]);
const OUTSTOCK_STORE = outstockStore();
const emit = defineEmits<{
  (e: "update:itemListRequest", value: RequestOutItem): void;
}>();
// ===== initial values =====
const initialValues = {
  productCode: "",
  color: "",
  size: "",
  qty: null,
};

// ===== validation schema =====
const schema = z.object({
  productCode: z.string().min(1, "Product Code is required"),

  color: z.string().min(1, "Color is required"),

  size: z.string().min(1, "Size is required"),

  qty: z
    .number({
      error: (issue) => {
        if (issue.code === "invalid_type") return "Qty must be a number";
        return "Invalid qty provided";
      },
    })
    .min(1, "Qty must be greater than 0"),
});

// ===== resolver =====
const resolver = zodResolver(schema);

// ===== submit =====
const onFormSubmit = (e: FormSubmitEvent) => {
  if (!e.valid) return;

  const payload = {
    productCode: e.values.productCode,
    color: e.values.color,
    size: e.values.size,
    qty: e.values.qty,
  };

  getUOM(payload.productCode, payload.color, payload.size)
    .then((resUom) => {
      checkDetail(payload.productCode, payload.color, payload.size)
        .then((res) => {
          console.warn(res);
          console.warn(resUom);
          if (resUom.data === null || resUom.data === undefined) {
            alert("ไม่พบข้อมูลสินค้า");
            return;
          }
          const existData = OUTSTOCK_STORE.itemListRequest.find(
            (item) =>
              item.productCode === payload.productCode &&
              item.color === payload.color &&
              item.size === payload.size
          );
          const newItem: RequestOutItem = {
            productCode: payload.productCode,
            color: payload.color,
            size: payload.size,
            qty: payload.qty,
            uom: resUom.data || "N/A",
          };

          if (res.data.length < 1) {
            itemListRequest.value.push(newItem);

            emit("update:itemListRequest", newItem);
            return;
          } else {
            alert("สินค้ามีการเบิกออกไปแล้ว");
            return;
          }
          //   if (res.data[0].balanceQty < payload.qty) {
          //     alert(
          //       `จำนวนสินค้าที่ต้องการเบิก (${payload.qty}) มากกว่าจำนวนคงเหลือในคลัง (${res.data[0].balanceQty}) กรุณาตรวจสอบอีกครั้ง`
          //     );
          //     return;
          //   }
          //   if (
          //     existData &&
          //     existData.qty + payload.qty > res.data[0].balanceQty
          //   ) {
          //     alert(
          //       `จำนวนสินค้าที่ต้องการเบิก (${
          //         existData.qty + payload.qty
          //       }) มากกว่าจำนวนคงเหลือในคลัง (${
          //         res.data[0].balanceQty
          //       }) กรุณาตรวจสอบอีกครั้ง`
          //     );
          //     return;
          //   }
        })
        .catch((err) => {
          alert(`เกิดข้อผิดพลาด ${err}`);
          console.error("Error checking detail:", err);
        });
    })
    .catch((err) => {
      alert(`เกิดข้อผิดพลาด ${err}`);
      console.error("Error fetching UOM:", err);
    });

  //   console.log("SUBMIT PAYLOAD", payload);

  // TODO:
  // - push เข้า items[]
  // - หรือส่ง API
};

// ===== delete =====
const onDelete = () => {};

watch(
  () => OUTSTOCK_STORE.itemListRequest,
  (newVal) => {
    itemListRequest.value = newVal;
  }
);
</script>

<style scoped></style>
