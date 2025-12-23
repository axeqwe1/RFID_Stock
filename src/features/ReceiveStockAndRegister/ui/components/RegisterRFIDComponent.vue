<template>
  <Form
    ref="formRef"
    v-slot="$form"
    :initialValues
    :resolver
    @submit="onFormSubmit"
    class="grid lg:grid-cols-1 gap-4 w-full card shadow-2xl rounded-2xl"
  >
    <div
      class="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 mb-4 rounded-t-lg text-white font-bold text-lg"
    >
      REGISTER SCREEN
      <Button
        v-if="RECEIVE_STORE.editReceiveId"
        severity="danger"
        label="Delete"
        @click="onDelete"
      />
    </div>

    <div class="grid grid-cols-3 gap-3 p-3">
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
      <div class="space-y-2">
        <label for="receiveDate" class="font-semibold">
          Receive Date <span class="text-red-500 font-semibold">*</span>
        </label>
        <div class="flex flex-col">
          <DatePicker
            class="mt-1"
            name="receiveDate"
            fluid
            size="small"
            placeholder="Select receive date"
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
      </div>

      <!-- Receive Type -->
      <div class="space-y-2">
        <label for="receiveType" class="font-semibold">
          Receive Type <span class="text-red-500 font-semibold">*</span>
        </label>
        <div class="flex flex-col">
          <InputText
            class="flex-1 mt-1"
            size="small"
            name="receiveType"
            placeholder="Auto-generated"
            disabled
            readonly
            fluid
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
      </div>

      <!-- Delivery No -->
      <div class="space-y-2">
        <label for="deliveryNo" class="font-semibold">
          Delivery No <span class="text-red-500 font-semibold">*</span>
        </label>
        <div class="flex flex-col">
          <InputText
            class="flex-1 mt-1"
            size="small"
            name="deliveryNo"
            placeholder="Enter delivery no"
            fluid
          />

          <Message
            v-if="$form.deliveryNo?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.deliveryNo.error?.message }}
          </Message>
        </div>
      </div>

      <!-- Invoice No -->
      <div class="space-y-2">
        <label for="invoiceNo" class="font-semibold">
          Invoice No <span class="text-red-500 font-semibold">*</span>
        </label>
        <div class="flex flex-col">
          <InputText
            class="flex-1 mt-1"
            size="small"
            name="invoiceNo"
            placeholder="Enter invoice no"
            fluid
          />

          <Message
            v-if="$form.invoiceNo?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.invoiceNo.error?.message }}
          </Message>
        </div>
      </div>

      <!-- Invoice Date -->
      <div class="space-y-2">
        <label for="invoiceDate" class="font-semibold">
          Invoice Date <span class="text-red-500 font-semibold">*</span>
        </label>
        <div class="flex flex-col">
          <DatePicker
            class="flex-1 mt-1"
            size="small"
            name="invoiceDate"
            placeholder="Select invoice date"
            fluid
          />

          <Message
            v-if="$form.invoiceDate?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.invoiceDate.error?.message }}
          </Message>
        </div>
      </div>

      <!-- Warehouse -->
      <div class="col-span-3 space-y-2">
        <label for="warehouse" class="font-semibold">
          Warehouse <span class="text-red-500 font-semibold">*</span>
        </label>
        <div class="flex flex-col">
          <Select
            class="flex-1 mt-1"
            size="small"
            name="warehouse"
            :options="optionsWarehouse"
            placeholder="Select warehouse"
            fluid
          />
          <!-- {{ $form }} -->
          <Message
            v-if="$form.warehouse?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.warehouse.error?.message }}
          </Message>
        </div>
      </div>

      <!-- Remark -->
      <div class="col-span-3 space-y-2">
        <label for="remark" class="font-semibold"> Remark </label>
        <div class="flex flex-col">
          <InputText
            class="flex-1 mt-1"
            size="small"
            name="remark"
            placeholder="Remark"
            fluid
          />

          <Message
            v-if="$form.remark?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.remark.error?.message }}
          </Message>
        </div>
      </div>

      <!-- Submit -->
      <div class="col-span-3 mt-4">
        <Button
          :severity="RECEIVE_STORE.editReceiveId ? 'warn' : 'success'"
          :label="
            RECEIVE_STORE.editReceiveId ? 'Submit to edit' : 'Submit to save'
          "
          type="submit"
          fluid
          :disabled="RECEIVE_STORE.listDataRFIDPO.length < 1"
        />
      </div>
    </div>
  </Form>

  <div class="card mt-4 shadow-xl">
    <RFIDPOTable />
  </div>
  <ConfirmDialog></ConfirmDialog>
</template>

<script setup lang="ts">
import { useToast } from "primevue";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import DatePicker from "primevue/datepicker";
import FormField from "primevue/datepicker";
import Select from "primevue/select";
import RFIDTable from "./table/RFIDTable.vue";
import RFIDPOTable from "./table/Purchase/RFIDPOTable.vue";
import { receiveStockStore } from "../../store/receiveStockStore";
import { nextTick } from "vue";
import { useFPSWarehouseCompos } from "../composables/useFPSWarehouseCompos";
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";
import type {
  CreateWarehouseReceiveRequest,
  WarehouseRFIdItem,
} from "../../dto/CreateWarehouseReceiveDTO";
import { useMaster } from "@/stores/MasterStore";
import type { RFIDPOBody } from "../../types/rfidtype";
import { formatDate } from "@/utils/format";
const router = useRouter();
const toast = useToast();
const confirm = useConfirm();
const {
  GetWarehouseOptions,
  GetAutorunReceiveInNo,
  CreateWarehouseReceive,
  UpdateWarehouseReceive,
  GetReceiveIn,
  DeleteWarehouseReceive,
} = useFPSWarehouseCompos();
const formRef = ref<any>();
const initialValues = ref({
  receiveType: "Purchase",
});
const optionsWarehouse = ref<string[]>([]);
const RECEIVE_STORE = receiveStockStore();
const MASTER_STORE = useMaster();
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

  // Invoice No
  if (!values.invoiceNo) {
    errors.invoiceNo = [
      {
        type: "required",
        message: "Invoice No is required.",
      },
    ];
  }

  // Invoice Date
  if (!values.invoiceDate) {
    errors.invoiceDate = [
      {
        type: "required",
        message: "Invoice Date is required.",
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
  console.log(errors);
  return {
    values,
    errors,
  };
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
          resetForm();
          router.push("/receivetostockandregister");
        } else {
          toast.add({
            severity: "error",
            summary: "Failed",
            detail: res.message,
            life: 3000,
          });
        }
      } else {
        alert("Not found Receive Id");
      }
    },
    reject: () => {},
  });
};
const onFormSubmit = ({ valid, values }: any) => {
  if (valid) {
    const request: CreateWarehouseReceiveRequest = {
      receiveNo: values.receiveNo,
      receiveDate: values.receiveDate,
      receiveType: values.receiveType,
      deliveryNo: values.deliveryNo,
      invoiceNo: values.invoiceNo,
      invoiceDate: values.invoiceDate,
      warehouse: values.warehouse,
      remark: values.remark,
      companyCode: "FPSTH",
      createdBy: "admin",
      rfidlist: RECEIVE_STORE.listDataRFIDPO.map((item) => {
        return {
          rfid: item.rfid,
          itemCode: item.ProductCode,
          poNo: item.POno,
          colorCode: item.Color,
          size: item.Size,
          uom: item.Unit,
          poNoItem: item.POItemNo,
        } as WarehouseRFIdItem;
      }),
    };
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
  console.log(res);
  formRef.value.setValues({
    receiveNo: res.data,
  });
};
const resetForm = async () => {
  // reset form ทั้งหมด
  // formRef.value.reset();

  // set ค่า default หลัง reset
  formRef.value.setValues({
    receiveType: "Purchase",
  });

  // reset RFID list
  RECEIVE_STORE.listDataRFIDPO = [];
  await nextTick();
};
onMounted(async () => {
  const res = await GetWarehouseOptions();

  optionsWarehouse.value = res
    .GetAllFPSWarehouseData()
    .map((item) => item.warehouse);

  console.log(optionsWarehouse.value);
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
        receiveType: "Purchase",
        deliveryNo: data.deliveryNo,
        invoiceNo: data.invoiceNo,
        invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : null,
        remark: data.remark,
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
