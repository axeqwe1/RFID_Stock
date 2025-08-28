import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import App from "./App.vue";
import router from "./router";
import Aura from "@primeuix/themes/aura";
import Button from "primevue/button";
import "./Global.css";
import "primeicons/primeicons.css";
const app = createApp(App);

app.use(createPinia());
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.component("Button", Button);
app.use(router);

app.mount("#app");
