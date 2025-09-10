<template>
  <div
    class="flex justify-center fixed h-full overflow-hidden"
    :class="['sidebar-container', { active: isOpen }]"
  >
    <div
      class="max-h-[85vh] bg-white h-full ml-3 w-64 shadow-md rounded-2xl flex flex-col justify-between"
    >
      <!-- Start -->
      <div class="p-4">LOGO</div>
      <hr />
      <!-- Content -->
      <div class="flex-1 p-4">
        <div class="mb-5" v-for="item in items" :key="item.label">
          <!-- Head -->
          <div class="border-b-1 border-gray-300 px-2 pb-1">
            <label class="text-xl text-neutral-500"> {{ item.label }} </label>
          </div>
          <!-- items -->
          <div class="my-2 flex flex-col gap-1">
            <ul class="flex flex-col gap-1">
              <li class="" v-for="subitem in item.items">
                <button
                  @click="
                    subitem.items
                      ? (subitem.active = !subitem.active)
                      : router.push(subitem.route)
                  "
                  :class="[
                    {
                      'bg-green-400 hover:bg-green-300':
                        route.path == subitem.route && !subitem.active,
                    },
                    { 'bg-base-200 hover:bg-base-300': subitem.active },
                    {
                      'bg-transparent hover:bg-gray-200':
                        route.path != subitem.route && !subitem.active,
                    },
                  ]"
                  class="rounded-lg p-2 w-full flex flex-row justify-between items-center cursor-pointer transition-all duration-100 ease-in"
                >
                  <span
                    >{{ subitem.label }} <span :class="subitem.icon"></span
                  ></span>
                  <span
                    v-if="subitem.items"
                    :class="[
                      { 'rotate-180': subitem.active },
                      'transition-transform',
                    ]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m4.5 15.75 7.5-7.5 7.5 7.5"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  v-if="subitem.items"
                  class="mt-1 flex flex-col overflow-hidden max-h-96"
                  :class="['submenu-container', { active: subitem.active }]"
                >
                  <button
                    v-for="child in subitem.items"
                    @click="router.push(child.route)"
                    :class="
                      route.path == child.route
                        ? 'border-l-black bg-base-200'
                        : 'border-l-gray-300'
                    "
                    class="p-2 ml-4 border-l-1 w-full text-left hover:border-l-black cursor-pointer transition-all duration-200 ease-in-out"
                  >
                    {{ child.label }}
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- End -->
      </div>
      <hr />
      <div class="p-4">
        <button class="btn btn-primary w-full">Logout</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { label } from "@primeuix/themes/aura/metergroup";
import type { MenuItem } from "primevue/menuitem";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const props = defineProps<{
  isSidebarOpen: boolean;
}>();

watch(
  () => props.isSidebarOpen,
  (newVal) => {
    isOpen.value = newVal;
    console.log(isOpen.value);
  }
);
const isOpen = ref<boolean>(props.isSidebarOpen);

const items = ref<MenuItem>([
  {
    label: "RFID Menu",
    items: [
      {
        label: "RFID Management",
        icon: "pi pi-plus",
        items: [
          {
            label: "Register",
            icon: "pi pi-fw pi-folder",
            route: "/rfidregister",
          },
        ],
      },
      {
        label: "SCAN Stock",
        icon: "pi pi-search",
        route: "/scan",
      },
      {
        label: "SignalR Test",
        icon: "pi pi-search",
        route: "/test",
      },
    ],
  },
  watch(route, () => {
    console.log(route.path);
  }),
  // {
  //   label: "Profile",
  //   items: [
  //     {
  //       label: "Settings",
  //       icon: "pi pi-cog",
  //     },
  //     {
  //       label: "Messages",
  //       icon: "pi pi-inbox",
  //       badge: 2,
  //     },
  //     {
  //       label: "Logout",
  //       icon: "pi pi-sign-out",
  //     },
  //   ],
  // },
]);
</script>

<style scoped>
/* Alternative: Pure CSS Animation */
.submenu-container {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.submenu-container.active {
  max-height: 500px; /* Set reasonable max height */
  opacity: 1;
  transform: translateY(0);
}

/* Staggered animation for child items */
.submenu-container.active button {
  animation: slideInFromLeft 0.3s ease-out forwards;
}

.submenu-container.active button:nth-child(1) {
  animation-delay: 0.1s;
}
.submenu-container.active button:nth-child(2) {
  animation-delay: 0.15s;
}
.submenu-container.active button:nth-child(3) {
  animation-delay: 0.2s;
}
.submenu-container.active button:nth-child(4) {
  animation-delay: 0.25s;
}
.submenu-container.active button:nth-child(5) {
  animation-delay: 0.3s;
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Smooth height transition */
/* .height-transition {
  transition: height 0.3s ease-in-out, opacity 0.2s ease-in-out;
  overflow: hidden;
} */
.sidebar-container {
  max-width: 0;
  opacity: 1;
  transform: translateX(-10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.sidebar-container.active {
  max-width: 18rem;
  opacity: 1;
  transform: translateX(0);
}
</style>
