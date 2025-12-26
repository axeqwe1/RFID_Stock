<template>
  <div class="fixed left-0 z-50">
    <!-- Mobile Overlay -->
    <div
      v-if="isOpen && isMobile"
      class="fixed inset-0 bg-gray/50 opacity-50 z-40 lg:hidden"
      @click="closeSidebar"
    ></div>

    <!-- Sidebar Container -->
    <div
      class="flex justify-center fixed h-full overflow-hidden z-50"
      :class="[
        'sidebar-container',
        { active: isOpen },
        { 'lg:relative lg:z-auto': !isMobile },
      ]"
    >
      <div
        :class="[
          'bg-white h-full shadow-md flex flex-col justify-between transition-all duration-300',
          {
            // Desktop styles
            'max-h-[85vh] ml-3 w-64 rounded-2xl': !isMobile,
            // Mobile styles
            'w-80 max-w-[85vw] rounded-r-2xl': isMobile,
          },
        ]"
      >
        <!-- Header with Mobile Close Button -->
        <div class="p-4 flex justify-between items-center">
          <div class="text-lg font-bold">LOGO</div>
          <!-- Mobile Close Button -->
          <button
            v-if="isMobile"
            @click="closeSidebar"
            class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <hr />

        <!-- Content -->
        <div class="flex-1 p-4 overflow-y-auto">
          <div class="mb-5" v-for="item in items" :key="item.label">
            <!-- Head -->
            <div class="border-b-1 border-gray-300 px-2 pb-1">
              <label class="text-lg lg:text-xl text-neutral-500 font-medium">
                {{ item.label }}
              </label>
            </div>

            <!-- items -->
            <div class="my-2 flex flex-col gap-1">
              <ul class="flex flex-col gap-1">
                <li v-for="subitem in item.items" :key="subitem.label">
                  <button
                    @click="handleItemClick(subitem)"
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
                    :class-mobile="isMobile ? 'text-base py-3' : 'text-sm py-2'"
                    class="rounded-lg p-2 w-full flex flex-row justify-between items-center cursor-pointer transition-all duration-100 ease-in touch-manipulation"
                  >
                    <span class="flex items-center gap-2">
                      <span :class="subitem.icon" class="text-sm"></span>
                      <span :class="isMobile ? 'text-base' : 'text-sm'">
                        {{ subitem.label }}
                      </span>
                    </span>
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
                        :class="isMobile ? 'w-5 h-5' : 'w-4 h-4'"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m4.5 15.75 7.5-7.5 7.5 7.5"
                        />
                      </svg>
                    </span>
                  </button>

                  <!-- Submenu -->
                  <div
                    v-if="subitem.items"
                    class="mt-1 flex flex-col overflow-hidden"
                    :class="['submenu-container', { active: subitem.active }]"
                  >
                    <button
                      v-for="child in subitem.items"
                      :key="child.label"
                      @click="handleChildClick(child)"
                      :class="[
                        route.path == child.route
                          ? 'border-l-black bg-base-200'
                          : 'border-l-gray-300',
                        isMobile ? 'py-3 text-base' : 'py-2 text-sm',
                      ]"
                      class="p-2 ml-4 border-l-2 w-full text-left hover:border-l-black cursor-pointer transition-all duration-200 ease-in-out touch-manipulation"
                    >
                      {{ child.label }}
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr />

        <!-- Footer -->
        <div class="p-4">
          <div class="text-xs text-gray-500 text-center">
            {{ isMobile ? "Mobile View" : "Desktop View" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// Props
const props = defineProps<{
  isSidebarOpen: boolean;
}>();

// Emits
const emit = defineEmits<{
  "update:isSidebarOpen": [value: boolean];
}>();

// Reactive variables
const isOpen = ref<boolean>(props.isSidebarOpen);
const windowWidth = ref<number>(0);

// Computed
const isMobile = computed(() => windowWidth.value < 1024); // lg breakpoint

// Methods
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

const closeSidebar = () => {
  isOpen.value = false;
  emit("update:isSidebarOpen", false);
};

const handleItemClick = (subitem: any) => {
  if (subitem.items) {
    subitem.active = !subitem.active;
  } else {
    router.push(subitem.route);
    // Close sidebar on mobile after navigation
    if (isMobile.value) {
      closeSidebar();
    }
  }
};

const handleChildClick = (child: any) => {
  router.push(child.route);
  // Close sidebar on mobile after navigation
  if (isMobile.value) {
    closeSidebar();
  }
};

// Watchers
watch(
  () => props.isSidebarOpen,
  (newVal) => {
    isOpen.value = newVal;
  }
);

// Auto-close sidebar on mobile when route changes
watch(
  () => route.path,
  () => {
    if (isMobile.value && isOpen.value) {
      closeSidebar();
    }
  }
);

// Lifecycle
onMounted(() => {
  windowWidth.value = window.innerWidth;
  window.addEventListener("resize", updateWindowWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWindowWidth);
});

// Menu items
const items = ref([
  {
    label: "RFID Menu",
    items: [
      {
        label: "RFID Management",
        icon: "pi pi-plus",
        active: false,
        items: [
          {
            label: "Register",
            icon: "pi pi-fw pi-folder",
            route: "/rfidregister",
          },
          {
            label: "RegisterBySKU",
            icon: "pi pi-fw pi-folder",
            route: "/rfidregisterBySKU",
          },
          {
            label: "Delete RFID",
            icon: "pi pi-fw pi-folder",
            route: "/deleterfid",
          },
        ],
      },
      {
        label: "Stock Management",
        icon: "pi pi-box",
        active: false,
        items: [
          {
            label: "Receive and Register",
            icon: "pi pi-fw pi-folder",
            route: "/receivetostockandregister",
          },
        ],
      },
      {
        label: "SCAN Stock",
        icon: "pi pi-search",
        route: "/scan",
      },
    ],
  },
  {
    label: "Stock",
    items: [
      {
        label: "Check Stock",
        icon: "pi pi-box",
        route: "/checkstock",
      },
      {
        label: "Warehouse Stock",
        icon: "pi pi-warehouse",
        route: "/warehousestock",
      },
    ],
  },
  {
    label: "Sale",
    items: [
      {
        label: "Shopify Sale Daily",
        icon: "pi pi-shopping-bag",
        route: "/shopifysale",
      },
    ],
  },
]);
</script>

<style scoped>
/* Submenu animations */
.submenu-container {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.submenu-container.active {
  max-height: 500px;
  opacity: 1;
  transform: translateY(0);
}

/* Staggered animation for child items */
.submenu-container.active button {
  animation: slideInFromLeft 0.5s ease-out forwards;
}

.submenu-container.active button:nth-child(1) {
  animation-delay: 0.1s;
}
.submenu-container.active button:nth-child(2) {
  animation-delay: 0.2s;
}
.submenu-container.active button:nth-child(3) {
  animation-delay: 0.3s;
}
.submenu-container.active button:nth-child(4) {
  animation-delay: 0.4s;
}
.submenu-container.active button:nth-child(5) {
  animation-delay: 0.5s;
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

/* Desktop sidebar animation */
@media (min-width: 1024px) {
  .sidebar-container {
    max-width: 0;
    opacity: 0;
    transform: translateX(-20px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: visible;
  }

  .sidebar-container.active {
    max-width: 18rem;
    opacity: 1;
    transform: translateX(0);
  }
}

/* Mobile sidebar animation */
@media (max-width: 1023px) {
  .sidebar-container {
    left: 0;
    top: 0;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: none;
    width: auto;
  }

  .sidebar-container.active {
    transform: translateX(0);
  }
}

/* Touch optimization */
.touch-manipulation {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Better mobile scrolling */
@media (max-width: 1023px) {
  .overflow-y-auto {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }
}

/* Focus states for better accessibility */
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Smooth transitions for better UX */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
