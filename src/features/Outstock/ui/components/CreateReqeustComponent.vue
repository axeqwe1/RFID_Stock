<template>
  <div class="space-y-3">
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
        CREATE REQUEST OUTSTOCK SCREEN
        <Button
          v-if="RECEIVE_STORE.editRequestId"
          severity="danger"
          label="Delete"
          @click="onDelete"
        />
      </div>

      <div class="grid grid-cols-2 gap-3 p-3">
        <!-- Request No -->
        <div class="space-y-1">
          <label class="font-semibold">
            Request No <span class="text-red-500">*</span>
          </label>

          <div class="flex gap-2">
            <InputText
              class="flex-1 mt-1"
              name="requestNo"
              placeholder="Auto-generated"
              size="small"
              disabled
            />
            <Button
              @click="autorunRequestNo"
              size="small"
              label="Auto run"
              :disabled="RECEIVE_STORE.editRequestId != null"
            />
          </div>

          <Message
            v-if="$form.requestNo?.invalid"
            severity="error"
            size="small"
          >
            {{ $form.requestNo.error?.message }}
          </Message>
        </div>

        <!-- Request Date -->
        <div class="space-y-2">
          <label class="font-semibold">
            Request Date <span class="text-red-500">*</span>
          </label>
          <div>
            <DatePicker
              class="mt-1"
              name="requestDate"
              size="small"
              placeholder="Select request date"
              fluid
            />

            <Message
              v-if="$form.requestDate?.invalid"
              severity="error"
              size="small"
            >
              {{ $form.requestDate.error?.message }}
            </Message>
          </div>
        </div>

        <!-- Request Type -->
        <div class="space-y-2 col-span-2">
          <label class="font-semibold">
            Out Type <span class="text-red-500">*</span>
          </label>

          <div>
            <Select
              :options="optionInOutType"
              class="mt-1"
              size="small"
              name="outType"
              placeholder="Select Out Type"
              fluid
            />

            <Message
              v-if="$form.outType?.invalid"
              severity="error"
              size="small"
            >
              {{ $form.outType.error?.message }}
            </Message>
          </div>
        </div>

        <!-- Delivery No -->
        <div class="space-y-2">
          <label class="font-semibold">
            Request By <span class="text-red-500">*</span>
          </label>
          <div>
            <InputText
              class="mt-1"
              size="small"
              name="requestBy"
              placeholder="Enter Request By"
              fluid
            />
          </div>
        </div>

        <!-- Warehouse -->
        <div class="space-y-2">
          <label class="font-semibold">
            Outsource PO No, <span class="text-red-500">*</span>
          </label>
          <div>
            <Select
              class="mt-1"
              size="small"
              name="poNo"
              :loading="loading"
              :options="optionPO"
              placeholder="Select PO No"
              fluid
            />
          </div>
        </div>

        <!-- Submit -->
        <div class="col-span-2 mt-4">
          <Button
            :severity="RECEIVE_STORE.editRequestId ? 'warn' : 'success'"
            :label="
              RECEIVE_STORE.editRequestId ? 'Submit to edit' : 'Submit to save'
            "
            type="submit"
            fluid
            :disabled="RECEIVE_STORE.listDataRFIDPO.length < 1"
          />
        </div>
      </div>
    </Form>
    <CreateRequestTable :showBtn="true" />
  </div>
</template>

<script setup lang="ts">
import { AuthStore } from "@/features/Login/ui/store/AuthStore";
import { receiveStockStore } from "@/features/ReceiveStockAndRegister/store/receiveStockStore";
import { useFPSWarehouseCompos } from "@/features/ReceiveStockAndRegister/ui/composables/useFPSWarehouseCompos";
import { useMaster } from "@/stores/MasterStore";
import { useConfirm, useToast } from "primevue";
import { nextTick, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import DatePicker from "primevue/datepicker";
import FormField from "primevue/datepicker";
import Select from "primevue/select";
import CreateRequestTable from "./table/CreateRequestTable.vue";
import RFIDModal from "@/features/ReceiveStockAndRegister/ui/components/modal/RFIDModal.vue";
import AddProductForm from "../view/AddProductForm.vue";
import { PODescApi, warehouseInOutType } from "../../outstock.api";
import { outstockStore } from "../../outstock.store";
const {
  GetWarehouseOptions,
  GetAutorunReceiveInNo,
  CreateWarehouseReceive,
  UpdateWarehouseReceive,
  GetReceiveIn,
  DeleteWarehouseReceive,
} = useFPSWarehouseCompos();

const router = useRouter();
const toast = useToast();
const confirm = useConfirm();

// STORE
const RECEIVE_STORE = receiveStockStore();
const MASTER_STORE = useMaster();
const AUTH_STORE = AuthStore();
const OUTSTOCK_STORE = outstockStore();
const formRef = ref<any>();

const optionsWarehouse = ref<string[]>([]);
const initialValues = ref({
  outType: "Outstock",
});
const optionPO = ref<string[]>([]);
const optionInOutType = ref<string[]>([]);
const loading = ref<boolean>(false);
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

const resolver = ({ values }: any) => {
  const errors: any = {};

  if (!values.requestNo) {
    errors.requestNo = [{ message: "Request No is required." }];
  }

  if (!values.requestDate) {
    errors.requestDate = [{ message: "Request Date is required." }];
  }

  if (!values.outType) {
    errors.outType = [{ message: "Out Type is required." }];
  }

  if (!values.requestBy) {
    errors.requestBy = [{ message: "Request By is required." }];
  }

  if (!values.outsourcePONo) {
    errors.outsourcePONo = [{ message: "Outsource PO No is required." }];
  }

  return { values, errors };
};

const onFormSubmit = ({ valid, values }: any) => {
  if (!valid) return;

  const request = {
    header: {
      requestNo: values.requestNo,
      requestDate: values.requestDate,
      outType: values.outType,
      requestBy: values.requestBy,
      outsourcePONo: values.outsourcePONo,
    },
    items: OUTSTOCK_STORE.itemListRequest,
  };

  console.log("REQUEST PAYLOAD", request);

  // แล้วค่อย call API
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
const autorunRequestNo = async () => {
  const res = await GetAutorunReceiveInNo(MASTER_STORE.COMPANY);
  formRef.value.setValues({
    requestNo: res.data,
  });
};

onMounted(async () => {
  loading.value = true;
  const resPO = await PODescApi().fetchPODescOption();
  const inoutType = await warehouseInOutType().fetchInOutType();
  optionPO.value = resPO.data.map((item: any) => item.poNo);
  optionInOutType.value = inoutType.data.map((item: any) => item.inoutType);
  loading.value = false;
});
</script>

<style scoped></style>
