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
      path: "/rfidregisterBySKU",
      name: "rfidregisterBySKU",
      component: () => import("../view/RFIDRegisterBySKU.vue"),
    },
    {
      path: "/receivetostockandregister",
      name: "receivetostockandregister",
      component: () =>
        import("@/features/ReceiveStockAndRegister/ui/page/page.vue"),
      children: [
        {
          path: "",
          name: "MainComponent",
          component: () =>
            import(
              "../features/ReceiveStockAndRegister/ui/components/MainComponent.vue"
            ),
        },
        {
          path: "receive",
          name: "ReceiveComponent",
          component: () =>
            import(
              "../features/ReceiveStockAndRegister/ui/components/ReceiveStockComponent.vue"
            ),
        },
        {
          path: "register",
          name: "RegisterComponent",
          component: () =>
            import(
              "@/features/ReceiveStockAndRegister/ui/components/RegisterRFIDComponent.vue"
            ),
        },
      ],
    },
    {
      path: "/deleterfid",
      name: "deleterfid",
      component: () => import("../view/RFIDDeleteView.vue"),
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
      path: "/warehousestock",
      name: "warehousestock",
      component: () => import("../view/WarehouseStockView.vue"),
    },
    {
      path: "/shopifysale",
      name: "shopifysale",
      component: () => import("../view/ShopifySaleView.vue"),
    },
  ],
});

export default router;
