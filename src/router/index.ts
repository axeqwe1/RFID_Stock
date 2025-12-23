import { AuthEntity } from "@/features/Login/domain/entity/AuthEntity";
import { AuthStore } from "@/features/Login/ui/store/AuthStore";
import { me } from "@/lib/api/auth";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("../components/layout/DashboardLayout.vue"),
      children: [
        {
          path: "",
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
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../features/Login/ui/view/page.vue"),
    },
  ],
});

router.beforeEach(async (to) => {
  try {
    const AUTH_STORE = AuthStore();

    const res = await me();
    // console.log(res);
    if (res?.data) {
      // console.warn("trigger");
      AUTH_STORE.Auth = new AuthEntity(res.data);
    }
    if (!AUTH_STORE.Auth && to.name !== "login") {
      return { name: "login" };
    }

    if (AUTH_STORE.Auth && to.name === "login") {
      return { name: "home" };
    }

    // ✅ สำคัญ: ถ้าไม่มีเงื่อนไขใด ๆ ให้ redirect
    return true;
  } catch (err: any) {
    return { name: "login" };
  }
});

export default router;
