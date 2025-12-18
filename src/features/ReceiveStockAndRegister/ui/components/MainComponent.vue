<template>
  <Form
    ref="formRef"
    v-slot="$form"
    :initialValues
    :resolver
    @submit="onFormSubmit"
    class="grid lg:grid-cols-1 gap-4 w-full shadow-md"
  >
    <div class="flex flex-col gap-1">
      <div
        class="bg-gradient-to-r from-amber-400 to-amber-500 rounded-t-2xl px-6 py-4 mb-4 font-semibold text-lg text-amber-900"
      >
        RFID MAIN SCREEN
      </div>
      <div class="grid grid-cols-2 gap-3 p-3">
        <div class="col-span-2">
          <h2 class="text-2xl text-center font-semibold">Menu</h2>
        </div>
        <Button
          label="Receive from purchase"
          @click="
            () => {
              router.push('/receivetostockandregister/register');
            }
          "
        />
        <Button
          label="Receive from return"
          @click="
            () => {
              router.push('/receivetostockandregister/receive');
            }
          "
        />
      </div>
    </div>
  </Form>

  <div class="card mt-4">
    <RFIDMainScreenTable />
  </div>
</template>

<script setup lang="ts">
import { useToast } from "primevue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import DatePicker from "primevue/datepicker";
import FormField from "primevue/datepicker";
import Select from "primevue/select";
import RFIDMainScreenTable from "./table/RFIDMainScreenTable.vue";
import { useFPSWarehouseCompos } from "../composables/useFPSWarehouseCompos";
import { useFPSProductTransCompose } from "../composables/useFPSProductTransCompose";
import { receiveStockStore } from "../../store/receiveStockStore";

const router = useRouter();
const toast = useToast();
const { GetAllFPSWarehouseData } = useFPSWarehouseCompos();
const { getTrans } = useFPSProductTransCompose();
const formRef = ref<any>();

const initialValues = ref({
  startReceiveDate: "",
  endReceiveDate: "",
  city: { name: "" },
  warehouse: { name: "" },
  productCode: { name: "" },
  receiveType: { name: "" },
});
const resolver = ({ values }: any) => {
  const errors: any = { username: [] };

  if (!values.username) {
    errors.username.push({
      type: "required",
      message: "Username is required.",
    });
  }

  if (values.username?.length < 3) {
    errors.username.push({
      type: "minimum",
      message: "Username must be at least 3 characters long.",
    });
  }

  return {
    values,
    errors,
  };
};

const onFormSubmit = ({ valid }: any) => {
  if (valid) {
    toast.add({
      severity: "success",
      summary: "Form is submitted.",
      life: 3000,
    });
  }
};
// const cities = ref([
//   { name: "New York", code: "NY" },
//   { name: "Rome", code: "RM" },
//   { name: "London", code: "LDN" },
//   { name: "Istanbul", code: "IST" },
//   { name: "Paris", code: "PRS" },
// ]);

// const subTest = () => {
//   formRef.value.submit();
// };
onMounted(async () => {
  console.log(await getTrans());
});
</script>

<style scoped></style>
