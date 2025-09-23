import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../view/DashboardView.vue"),
    },
    {
      path: "/scan",
      name: "scan",
      component: () => import("../view/DashboardView.vue"),
    },
    {
      path: "/rfidregister",
      name: "rfidregister",
      component: () => import("../view/RFIDRegister.vue"),
    },
    {
      path: "/test",
      name: "test",
      component: () => import("../components/SignalR.vue"),
    },
    {
      path: "/checkstock",
      name: "checkstock",
      component: () => import("../view/CheckStockView.vue"),
    },
    {
      path: "/shopifysale",
      name: "shopifysale",
      component: () => import("../view/ShopifySaleView.vue"),
    },
  ],
});

export default router;
