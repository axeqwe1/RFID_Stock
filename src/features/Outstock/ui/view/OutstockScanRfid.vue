<template>
  <div class="space-y-6">
    <Form
      ref="formRef"
      v-slot="$form"
      :initialValues="initialValues"
      :resolver="resolver"
      @submit="onFormSubmit"
      class="space-y-6"
    >
      <!-- ===== Header Card ===== -->
      <div class="card rounded-2xl p-4 border">
        <div class="font-semibold text-lg mb-4 text-blue-700">
          Request Information
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Request No -->
          <div class="space-y-1">
            <label class="font-semibold"
              >Request Out No <span class="text-red-500">*</span></label
            >
            <InputText
              v-model="request.requestOutNo"
              name="requestOutNo"
              size="small"
              disabled
              fluid
            />
            <Message
              v-if="$form.requestOutNo?.invalid"
              severity="error"
              size="small"
            >
              {{ $form.requestOutNo.error?.message }}
            </Message>
          </div>

          <!-- Out Type -->
          <div class="space-y-1">
            <label class="font-semibold"
              >Out Type <span class="text-red-500">*</span></label
            >
            <InputText
              v-model="request.outType"
              name="outType"
              size="small"
              disabled
              fluid
            />
          </div>

          <!-- Out Date -->
          <div class="space-y-1">
            <label class="font-semibold"
              >Out Date <span class="text-red-500">*</span></label
            >
            <DatePicker
              name="outDate"
              size="small"
              placeholder="Select date"
              dateFormat="dd/mm/yy"
              fluid
              v-model="request.outDate"
            />
            <Message
              v-if="$form.outDate?.invalid"
              severity="error"
              size="small"
            >
              {{ $form.outDate.error?.message }}
            </Message>
          </div>
        </div>
      </div>

      <!-- ===== Product Detail Card ===== -->
      <div class="card rounded-2xl p-4 border">
        <div class="font-semibold text-lg mb-4 text-blue-700">
          Product Detail
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Product Code -->
          <div class="space-y-1">
            <label class="font-semibold"
              >Product Code <span class="text-red-500">*</span></label
            >
            <InputText
              v-model="request.productCode"
              name="productCode"
              size="small"
              fluid
              readonly
              disabled
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
            <label class="font-semibold"
              >Color <span class="text-red-500">*</span></label
            >
            <InputText
              v-model="request.color"
              name="color"
              size="small"
              fluid
              readonly
              disabled
            />
            <Message v-if="$form.color?.invalid" severity="error" size="small">
              {{ $form.color.error?.message }}
            </Message>
          </div>

          <!-- Size -->
          <div class="space-y-1">
            <label class="font-semibold"
              >Size <span class="text-red-500">*</span></label
            >
            <InputText
              v-model="request.size"
              name="size"
              size="small"
              fluid
              readonly
              disabled
            />
            <Message v-if="$form.size?.invalid" severity="error" size="small">
              {{ $form.size.error?.message }}
            </Message>
          </div>

          <!-- Out Qty -->
          <div class="space-y-1">
            <label class="font-semibold"
              >Out Qty <span class="text-red-500">*</span></label
            >
            <InputNumber
              v-model="request.outQty"
              name="outQty"
              size="small"
              :min="1"
              readonly
              disabled
              fluid
            />
            <Message v-if="$form.outQty?.invalid" severity="error" size="small">
              {{ $form.outQty.error?.message }}
            </Message>
          </div>
        </div>

        <!-- Action
        <div class="flex justify-end mt-6">
          <Button
            type="submit"
            label="Add Item"
            severity="success"
            icon="pi pi-plus"
          />
        </div> -->
      </div>
    </Form>

    <!-- ===== RFID Table ===== -->
    <div class="card rounded-2xl p-4 border">
      <RFIDOutTable
        @addrfid="addRFID"
        :receiveQty="qtyOut"
        :buttonName="'Submit'"
        :request="request"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { z } from "zod";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import type { FormSubmitEvent } from "@primevue/forms";
import type { ScanOutStockRequest } from "@/features/Outstock/outstock.model";
import RFIDOutTable from "../components/table/RFIDOutTable.vue";
import RFIDTable from "@/features/ReceiveStockAndRegister/ui/components/table/RFIDTable.vue";
import type { RFIDType } from "@/features/ReceiveStockAndRegister/types/rfidtype";
import DatePicker from "primevue/datepicker";
import { outstockStore } from "../../outstock.store";
import {
  fetchRequestOutstockByOutNo,
  getDetailRequest,
} from "../../outstock.api";
// === store ===
const OUTSTOCK_STORE = outstockStore();
// ===== form ref =====
const formRef = ref();
const qtyOut = ref(0);
const request = ref<ScanOutStockRequest>({
  requestOutNo: "AUTO-GEN",
  outType: "Adjust",
  outDate: new Date(),

  productCode: "",
  color: "",
  size: "",
  outQty: 0,
});
// ===== initial values =====
const initialValues = {
  requestOutNo: "AUTO-GEN",
  outType: "Adjust",
  outDate: new Date(),

  productCode: "",
  color: "",
  size: "",
  outQty: null,
};

// ===== validation =====
const schema = z.object({
  requestOutNo: z.string().min(1),
  outType: z.string().min(1),
  outDate: z.date(),

  productCode: z.string().min(1, "Product Code is required"),
  color: z.string().min(1, "Color is required"),
  size: z.string().min(1, "Size is required"),
  outQty: z.number().min(1, "Qty must be greater than 0"),
});

const resolver = zodResolver(schema);

// ===== submit =====
const onFormSubmit = (e: FormSubmitEvent) => {
  if (!e.valid) return;

  const payload: ScanOutStockRequest = {
    requestOutNo: e.values.requestOutNo,
    outType: e.values.outType,
    outDate: e.values.outDate,

    productCode: e.values.productCode,
    color: e.values.color,
    size: e.values.size,
    outQty: e.values.outQty,
  };

  console.log("SCAN OUTSTOCK PAYLOAD", payload);

  // TODO:
  // - push to store
  // - call API
};

const addRFID = (rfid: RFIDType[]) => {
  console.log("ADD RFID:", rfid);
  //   qtyOut.value += 1;
};
watch(
  () => request.value.outQty,
  (newVal) => {
    formRef.value.setValues({
      outQty: newVal,
    });
    console.log(request.value);
    qtyOut.value = newVal;
  }
);

watch(
  () => request.value,
  (newVal) => {
    console.log("Request changed:", newVal);
    OUTSTOCK_STORE.requestScanOutstock = newVal;
  },
  { deep: true }
);

watch(
  () => OUTSTOCK_STORE.OUT_EDITID,
  async (newVal) => {
    // request.value = newVal;
    console.log(newVal);
    if (newVal == "" || newVal == null) {
      return;
    }

    const res = await fetchRequestOutstockByOutNo(newVal);
    console.log(res.data[0]);
    formRef.value.setValues({
      requestOutNo: res.data[0].outNo,
      outType: res.data[0].outType,

      productCode: res.data[0].itemCode,
      color: res.data[0].colorCode,
      size: res.data[0].size,
      outQty: res.data[0].outQty,
    });
    qtyOut.value = res.data[0].outQty;
    const details = await getDetailRequest(newVal);
    console.log(details);
  },
  { immediate: true }
);
</script>

<style scoped></style>
