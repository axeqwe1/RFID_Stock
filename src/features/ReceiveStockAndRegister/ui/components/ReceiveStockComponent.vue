<template>
  <Form
    ref="formRef"
    v-slot="$form"
    :initialValues
    :resolver
    @submit="onFormSubmit"
    class="grid lg:grid-cols-1 gap-4 w-full card shadow-2xl rounded-2xl"
  >
    <!-- Header -->
    <div
      class="flex justify-between items-center bg-gradient-to-r from-sky-900 to-purple-500 px-6 py-4 mb-4 rounded-t-lg text-white font-bold text-lg"
    >
      RECEIVE SCREEN
      <Button
        v-if="RECEIVE_STORE.editReceiveId"
        severity="danger"
        label="Delete"
        @click="onDelete"
      />
    </div>

    <!-- Body -->
    <div class="grid grid-cols-2 gap-3 p-3">
      <!-- Receive No -->
      <div class="space-y-1">
        <label for="receiveNo" class="font-semibold">
          Receive No <span class="text-red-500 font-semibold">*</span>
        </label>
        <div class="flex flex-col gap-1">
          <div class="flex gap-2">
            <InputText
              class="flex-1 mt-1"
              name="receiveNo"
              placeholder="Auto-generated"
              fluid
              size="small"
              readonly
              disabled
            />
            <Button
              @click="autorunReceiveNo"
              size="small"
              label="Auto run"
              :disabled="RECEIVE_STORE.editReceiveId != null"
            ></Button>
          </div>

          <Message
            v-if="$form.receiveNo?.invalid"
            severity="error"
            size="small"
            variant="simple"
            class="!mt-0"
          >
            {{ $form.receiveNo.error?.message }}
          </Message>
        </div>
      </div>

      <!-- Receive Date -->
      <div class="space-y-1">
        <label class="font-semibold"
          >Receive Date<span class="text-red-500 font-semibold">*</span></label
        >
        <DatePicker
          class="mt-1"
          name="receiveDate"
          size="small"
          dateFormat="dd/mm/yy"
          fluid
        />
        <Message
          v-if="$form.receiveDate?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.receiveDate.error?.message }}
        </Message>
      </div>

      <!-- Delivery No -->
      <div class="space-y-1">
        <label class="font-semibold"
          >Delivery No<span class="text-red-500 font-semibold">*</span></label
        >
        <InputText class="mt-1" name="deliveryNo" size="small" fluid />
        <Message
          v-if="$form.deliveryNo?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.deliveryNo.error?.message }}
        </Message>
      </div>

      <!-- Receive Type -->
      <div class="space-y-1">
        <label class="font-semibold"
          >Receive Type<span class="text-red-500 font-semibold">*</span></label
        >
        <InputText
          class="mt-1"
          name="receiveType"
          size="small"
          fluid
          disabled
          readonly
        />
        <Message
          v-if="$form.receiveType?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.receiveType.error?.message }}
        </Message>
      </div>

      <!-- Warehouse -->
      <div class="col-span-2 space-y-1">
        <label class="font-semibold"
          >Warehouse<span class="text-red-500 font-semibold">*</span></label
        >
        <Select
          class="mt-1"
          name="warehouse"
          :options="optionsWarehouse"
          size="small"
          fluid
        />
        <Message
          v-if="$form.warehouse?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.warehouse.error?.message }}
        </Message>
      </div>

      <!-- Submit -->
      <div class="col-span-2 mt-4">
        <Button
          :disabled="
            RECEIVE_STORE.listDataRFIDPO.length < 1 ||
            RECEIVE_STORE.listDataRFIDPO.filter((t) => t.Status == false)
              .length > 0
          "
          type="submit"
          :severity="RECEIVE_STORE.editReceiveId ? 'warn' : 'success'"
          :label="
            RECEIVE_STORE.editReceiveId ? 'Submit to edit' : 'Submit to save'
          "
          fluid
        />
      </div>
    </div>
  </Form>

  <div class="card mt-4 shadow-xl">
    <RFIDReceiveTable />
  </div>
  <ConfirmDialog></ConfirmDialog>
</template>

<script setup lang="ts">
import { useConfirm, useToast } from "primevue";
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import DatePicker from "primevue/datepicker";
import FormField from "primevue/datepicker";
import Select from "primevue/select";
import RFIDReceiveTable from "./table/Receive/RFIDReceiveTable.vue";
import { useFPSWarehouseCompos } from "../composables/useFPSWarehouseCompos";
import { useMaster } from "@/stores/MasterStore";
import { receiveStockStore } from "../../store/receiveStockStore";
import ConfirmDialog from "primevue/confirmdialog";
import type {
  CreateWarehouseReceiveRequest,
  WarehouseRFIdItem,
} from "../../dto/CreateWarehouseReceiveDTO";
import type { RFIDPOBody } from "../../types/rfidtype";
import { AuthStore } from "@/features/Login/ui/store/AuthStore";

const router = useRouter();
const toast = useToast();
const confirm = useConfirm();
const optionsWarehouse = ref<string[]>([]);
const {
  GetWarehouseOptions,
  GetAutorunReceiveInNo,
  DeleteWarehouseReceive,
  GetWarehouseRfids,
  CreateWarehouseReceive,
  UpdateWarehouseReceive,
  GetReceiveIn,
} = useFPSWarehouseCompos();
const MASTER_STORE = useMaster();
const RECEIVE_STORE = receiveStockStore();
const formRef = ref<any>();
const AUTH_STORE = AuthStore();
const initialValues = ref({
  startReceiveDate: "",
  endReceiveDate: "",
  city: "",
  warehouse: "",
  productCode: "",
  receiveType: "Return",
});

const resolver = ({ values }: any) => {
  const errors: any = {};
  console.log(values);
  // Receive No
  if (!values.receiveNo) {
    errors.receiveNo = [
      {
        type: "required",
        message: "Receive No is required.",
      },
    ];
  }

  // Receive Date
  if (!values.receiveDate) {
    errors.receiveDate = [
      {
        type: "required",
        message: "Receive Date is required.",
      },
    ];
  }

  // Receive Type
  if (!values.receiveType) {
    errors.receiveType = [
      {
        type: "required",
        message: "Receive Type is required.",
      },
    ];
  }

  // Delivery No
  if (!values.deliveryNo) {
    errors.deliveryNo = [
      {
        type: "required",
        message: "Delivery No is required.",
      },
    ];
  }

  // Warehouse
  // NOTE: name="warehouse.name" → ค่าใน values จะเป็นแบบ: { warehouse: { name: "..."} }
  // warehouse validation
  if (!values.warehouse || !values.warehouse) {
    errors.warehouse = [
      {
        type: "required",
        message: "Warehouse select is required.",
      },
    ];
  }

  return {
    values,
    errors,
  };
};

const onFormSubmit = ({ valid, values }: any) => {
  console.log(values, valid);
  if (valid) {
    const request: CreateWarehouseReceiveRequest = {
      receiveNo: values.receiveNo ?? null,
      receiveDate: values.receiveDate ?? null,
      receiveType: values.receiveType ?? null,
      deliveryNo: values.deliveryNo,
      invoiceNo: values.invoiceNo ?? null,
      invoiceDate: values.invoiceDate ?? null,
      warehouse: values.warehouse ?? null,
      remark: values.remark ?? null,
      companyCode: AUTH_STORE.Auth?.GetUserData().companyCode ?? "",
      createdBy: AUTH_STORE.Auth?.GetUserData().fullName ?? "admin",
      rfidlist: RECEIVE_STORE.listDataRFIDPO.map((item) => {
        return {
          rfid: item.rfid ?? null,
          itemCode: item.ProductCode ?? null,
          poNo: item.POno ?? null,
          colorCode: item.Color ?? null,
          size: item.Size ?? null,
          uom: item.Unit ?? null,
          poNoItem: item.POItemNo ?? null,
        } as WarehouseRFIdItem;
      }),
    };
    console.log(request);
    confirm.require({
      message: "Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      rejectProps: {
        label: "Cancel",
        severity: "secondary",
        outlined: true,
      },
      acceptProps: {
        label: "Save",
      },
      accept: () => {
        if (RECEIVE_STORE.editReceiveId) {
          UpdateWarehouseReceive(RECEIVE_STORE.editReceiveId, request)
            .then(() => {
              toast.add({
                severity: "success",
                summary: "Confirmed",
                detail: "Update data success",
                life: 3000,
              });
              resetForm();
              router.push("/receivetostockandregister");
            })
            .catch((error) => {
              toast.add({
                severity: "error",
                summary: "Error",
                detail: error.response.data.message || "An error occurred",
                life: 5000,
              });
            });
        } else {
          CreateWarehouseReceive(request)
            .then(() => {
              toast.add({
                severity: "success",
                summary: "Confirmed",
                detail: "Receive and register rfid success",
                life: 3000,
              });
              resetForm();
            })
            .catch((error) => {
              toast.add({
                severity: "error",
                summary: "Error",
                detail: error.response.data.message || "An error occurred",
                life: 5000,
              });
            });
        }
      },
      reject: () => {},
    });
  }
};

const autorunReceiveNo = async () => {
  // Logic to auto-generate Receive No
  const res = await GetAutorunReceiveInNo(MASTER_STORE.COMPANY);
  formRef.value.setValues({
    receiveNo: res.data,
  });
};
const resetForm = async () => {
  // reset form ทั้งหมด
  formRef.value.reset();

  // set ค่า default หลัง reset
  formRef.value.setValues({
    receiveType: "Purchase",
  });

  // reset RFID list
  RECEIVE_STORE.listDataRFIDPO = [];
  await nextTick();
};
const onDelete = () => {
  confirm.require({
    message: "Are you sure you want to delete?",
    header: "Confirmation",
    icon: "pi pi-trash",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Save",
    },
    accept: async () => {
      if (RECEIVE_STORE.editReceiveId) {
        const res = await DeleteWarehouseReceive(RECEIVE_STORE.editReceiveId);
        if (res.isSuccess) {
          toast.add({
            severity: "success",
            summary: "Confirmed",
            detail: "Delete data success",
            life: 3000,
          });
          router.push("/receivetostockandregister");
        }
      } else {
        alert("Not found Receive Id");
      }
    },
    reject: () => {},
  });
};
onMounted(async () => {
  const res = await GetWarehouseOptions();

  optionsWarehouse.value = res
    .GetAllFPSWarehouseData()
    .map((item) => item.warehouse);
});
watch(
  () => RECEIVE_STORE.editReceiveId,
  async (newVal) => {
    await nextTick();
    console.log(newVal);
    if (newVal) {
      // Populate form with edit data
      const res = await GetReceiveIn(newVal);
      console.log(res.data);
      const data = res.data[0];
      formRef.value.setValues({
        receiveNo: data.receiveNo,
        receiveDate: data.receiveDate ? new Date(data.receiveDate) : null,
        receiveType: "Return",
        deliveryNo: data.deliveryNo,
        invoiceNo: data.invoiceNo ?? null,
        invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : null,
        remark: data.remark ?? null,
        warehouse: data.warehouse,
      });
      if (data.rfidlist) {
        RECEIVE_STORE.listDataRFIDPO = data.rfidlist.map((item) => {
          return {
            rfid: item.rfid,
            POno: item.poNo,
            ProductCode: item.itemCode,
            Color: item.colorCode,
            Size: item.size,
            SKU: item.sku,
            // Status: item.status,
            Unit: item.uom,
            POItemNo: item.poNoItem,
          } as RFIDPOBody;
        });
      }
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  RECEIVE_STORE.editReceiveId = null;
});
</script>

<style scoped></style>
