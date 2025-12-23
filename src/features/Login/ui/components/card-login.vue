<template>
  <Card style="width: 680px; overflow: hidden; padding: 24px">
    <template #header>
      <!-- <img alt="user header" src="/images/usercard.png" /> -->
      <div class="space-y-1 flex justify-center items-center">
        <!-- <i
          class="pi pi-clock p-6 rounded-xl bg-success"
          style="
            font-size: 2.5rem;
            background: linear-gradient(to left, #aaffa9, #11ffbd);
          "
        ></i> -->
        <img
          :src="loginIcon"
          alt=""
          style="height: auto; width: auto; max-height: 175px; max-width: 175px"
        />
      </div>
    </template>
    <template #title>
      <div>
        <h1 class="text-4xl font-bold text-center">FPS Stock Control System</h1>
      </div>
    </template>
    <template #subtitle
      ><h3 class="text-2xl font-semibold text-center text-gray-400">
        Login
      </h3></template
    >
    <template #content>
      <!-- Body Input Here -->
      <div
        v-if="loginError"
        class="p-6 w-full bg-red-300 h-[60px] rounded-xl my-3 flex justify-center items-center"
      >
        <span class="text-red-900"> {{ loginError }}</span>
      </div>
      <Form
        v-slot="$form"
        ref="formRef"
        :initialValues="initialValues"
        :resolver="resolver"
        @submit="onSubmit"
        class="space-y-2"
      >
        <!-- Company -->
        <div class="flex flex-col gap-1">
          <label>Company</label>
          <Select
            name="company"
            :options="(companies as Companies[]) ?? []"
            optionLabel="companyName"
            optionValue="companyCode"
            placeholder="Select company"
            empty-message="No avaliable option"
            :disabled="!!companiesError"
            class="w-full"
          />
          <small class="text-red-500">{{
            $form.company?.error?.message
          }}</small>
        </div>

        <!-- Username -->
        <div class="flex flex-col gap-1">
          <label>Username</label>
          <InputText name="username" class="w-full" fluid />
          <small class="text-red-500">{{
            $form.username?.error?.message
          }}</small>
        </div>

        <!-- Password -->
        <div class="flex flex-col gap-1">
          <label>Password</label>
          <Password
            name="password"
            toggleMask
            :feedback="false"
            class="w-full"
            fluid
          />
          <small class="text-red-500">{{
            $form.password?.error?.message
          }}</small>
        </div>

        <span class="text-sm text-gray-400 cursor-pointer hover:text-green-500"
          >forgot password?</span
        >
      </Form>
    </template>
    <template #footer>
      <div class="flex gap-4 mt-3">
        <Button
          @click="
            () => {
              formRef.submit();
            }
          "
          label="Login"
          class="w-full"
        />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Select from "primevue/select";
import { Form } from "@primevue/forms";
import { z } from "zod";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { onMounted, ref } from "vue";
import loginIcon from "@/asset/icon/rfid.gif";
import { useRouter } from "vue-router";
import { useCompany } from "../composables/CompanyComposables";
import type { Companies } from "../types/Companies";
import type { RepoErrorType } from "@/features/ReceiveStockAndRegister/types/RepoErrorType";
import type { LoginRequest } from "@/dto/request/Request";
import { useAuth } from "../composables/AuthComposables";
import { AuthStore } from "../store/AuthStore";

const formRef = ref<any>();
const router = useRouter();
const { GetCompanies } = useCompany();
const { login } = useAuth();
const AUTH_STORE = AuthStore();
const companies = ref<Companies[]>([]);
const companiesError = ref<RepoErrorType | null>(null);
const loginError = ref<string | null>(null);
const initialValues = {
  company: null,
  username: "",
  password: "",
};

const resolver = zodResolver(
  z.object({
    company: z.string().min(1, "Please select company"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  })
);

const onSubmit = (event: any) => {
  if (event.valid) {
    const request: LoginRequest = {
      companyCode: event.values.company,
      userName: event.values.username,
      password: event.values.password,
    };

    console.log(request);
    Login(request);
  }

  // call login api here
};
const Login = async (req: LoginRequest) => {
  const res = await login(req);
  console.log(res);
  if (res.Response().success) {
    loginError.value = null;
    AUTH_STORE.Auth = res;
    AUTH_STORE.Auth.SaveToken();
    router.push("/");
    return;
  }

  loginError.value = res.Response().message;
};

onMounted(async () => {
  let result = await GetCompanies();
  if (result.ok) {
    companies.value = result.value.GetCompanies();
  } else {
    companiesError.value = result.error;
  }
});
</script>

<style scoped></style>
