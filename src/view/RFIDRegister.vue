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
        <div class="flex flex-col gap-1 w-full">
          <AutoComplete
            name="productname.name"
            placeholder="Product Name"
            optionLabel="name"
            :suggestions="filteredProduct"
            @complete="searchProduct"
            fluid
          />
          <Message
            v-if="$form.username?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.username.error?.message }}</Message
          >
        </div>
        <div class="flex flex-col gap-1 w-full">
          <InputText name="style" type="text" placeholder="Style" fluid />
          <Message
            v-if="$form.username?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.username.error?.message }}</Message
          >
        </div>
        <div class="flex flex-col gap-1 w-full">
          <InputText name="color" type="text" placeholder="Color" fluid />
          <Message
            v-if="$form.username?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.username.error?.message }}</Message
          >
        </div>
        <div class="flex flex-col gap-1 w-full">
          <InputText name="size" type="text" placeholder="Size" fluid />
          <Message
            v-if="$form.username?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.username.error?.message }}</Message
          >
        </div>
      </div>
      <Button @click="visible = true" severity="primary" label="Submit" />

      <DataTableComponent />
    </Form>
  </div>
  <Dialog
    v-model:visible="visible"
    modal
    header="Edit Profile"
    :style="{ width: '25rem' }"
  >
    <span class="text-surface-500 dark:text-surface-400 block mb-8"
      >Update your information.</span
    >
    <div class="flex items-center gap-4 mb-4">
      <label for="username" class="font-semibold w-24">Username</label>
      <InputText id="username" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex items-center gap-4 mb-8">
      <label for="email" class="font-semibold w-24">Email</label>
      <InputText id="email" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex justify-end gap-2">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="visible = false"
      ></Button>
      <Button type="submit" label="Save" @click="submitForm"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useToast } from "primevue/usetoast";
import DataTableComponent from "@/components/DataTableComponent.vue";
import Dialog from "primevue/dialog";
// 🎯 วิธีที่ 1: ใช้ type ที่ PrimeVue คาดหวัง (ง่ายที่สุด)
const toast = useToast() as any;
const filteredProduct = ref<any[]>([]);
const datas = ref();
const visible = ref(false);
const formRef = ref();
// ใช้ any กับข้อมูลฟอร์ม เพราะ PrimeVue ต้องการ Record<string, any>
const initialValues = reactive({
  productname: { name: "" },
  style: "",
  color: "",
  size: "",
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
      filteredProduct.value = [...datas.value];
    } else {
      console.log(datas.value);
      filteredProduct.value = datas.value.filter((data: any) => {
        console.log(data.name);
        return data.name.toLowerCase().startsWith(event.query.toLowerCase());
      });
    }
  }, 250);
};

// ใช้ type ตาม PrimeVue คาดหวัง
const onFormSubmit = (event: any) => {
  const { valid, values } = event;

  if (valid) {
    console.log("Username:", values.username);

    toast.add({
      severity: "success",
      summary: "Form is submitted.",
      detail: `Welcome, ${values.username}!`,
      life: 3000,
    });
  }
};
const submitForm = () => {
  formRef.value.submit(); // เรียก submit ผ่าน ref
};
onMounted(() => {
  datas.value = [{ name: "test" }];
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
