import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import App from "./App.vue";
import router from "./router";
import Aura from "@primeuix/themes/aura";
import Button from "primevue/button";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import "./Global.css";
import "primeicons/primeicons.css";
import { Form } from "@primevue/forms";
const app = createApp(App);

app.use(createPinia());
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.use(ToastService);
app.component("Toast", Toast);
app.component("Form", Form);
app.use(router);

app.mount("#app");
