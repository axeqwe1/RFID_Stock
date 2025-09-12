<script setup lang="ts">
import { Button, PanelMenu } from "primevue";
import { ref, computed, onMounted, onUnmounted } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import Topbar from "@/components/Topbar.vue";

// Reactive state
const isSidebarOpen = ref(false); // Start closed on mobile by default
const windowWidth = ref(0);

// Computed properties
const isMobile = computed(() => windowWidth.value < 1024); // lg breakpoint
const isDesktop = computed(() => windowWidth.value >= 1024);

// Methods
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

const handleToggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const handleSidebarUpdate = (value: boolean) => {
  isSidebarOpen.value = value;
};

// Auto-manage sidebar state based on screen size
const manageSidebarState = () => {
  if (isDesktop.value && !isSidebarOpen.value) {
    // Auto-open on desktop if closed
    isSidebarOpen.value = true;
  } else if (isMobile.value && isSidebarOpen.value) {
    // Auto-close on mobile if open (optional)
    isSidebarOpen.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  windowWidth.value = window.innerWidth;
  window.addEventListener("resize", updateWindowWidth);
  window.addEventListener("resize", manageSidebarState);

  // Initial state management
  manageSidebarState();
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWindowWidth);
  window.removeEventListener("resize", manageSidebarState);
});
</script>

<template>
  <div class="bg-base-200 min-h-screen">
    <!-- Topbar -->
    <Topbar @toggleSidebar="handleToggleSidebar" />

    <!-- Main Content Area -->
    <div class="pt-16 lg:pt-20 h-full pb-6">
      <!-- Sidebar -->
      <Sidebar
        :is-sidebar-open="isSidebarOpen"
        @update:is-sidebar-open="handleSidebarUpdate"
      />

      <!-- Main Content -->
      <div
        :class="[
          // Base classes
          'mx-3 lg:mx-6 rounded-xl h-full bg-white shadow-md transition-all duration-300 ease-in-out',
          // Desktop responsive margin
          {
            'lg:ml-[18rem]': isSidebarOpen && isDesktop,
            'lg:ml-6': !isSidebarOpen && isDesktop,
          },
          // Mobile margin (always full width with padding)
          'lg:mr-6',
        ]"
      >
        <div class="p-3 lg:p-5">
          <!-- Content container with proper mobile spacing -->
          <div class="w-full">
            <router-view />
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile-specific overlay when sidebar is open (backup) -->
    <div
      v-if="isSidebarOpen && isMobile"
      class="fixed inset-0 bg-black/50 opacity-50 z-30 lg:hidden"
      @click="isSidebarOpen = false"
    ></div>
  </div>
</template>

<style scoped>
/* Smooth transitions for all screen sizes */
.transition-all {
  transition-property: margin, padding, transform, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Ensure proper stacking context */
.main-content {
  position: relative;
  z-index: 10;
}

/* Mobile optimizations */
@media (max-width: 1023px) {
  /* Ensure content doesn't get cut off on mobile */
  .mx-3 {
    margin-left: 0.75rem;
    margin-right: 0.75rem;
  }

  /* Better mobile padding */
  .p-3 {
    padding: 0.75rem;
  }
}

/* Desktop optimizations */
@media (min-width: 1024px) {
  /* Smooth margin transitions on desktop */
  .lg\:ml-\[18rem\] {
    margin-left: 18rem;
  }

  .lg\:ml-6 {
    margin-left: 1.5rem;
  }
}

/* Performance optimizations */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Prevent content shift during transitions */
.transition-all {
  will-change: margin-left;
}

@media (prefers-reduced-motion: reduce) {
  .transition-all {
    transition-duration: 0.01ms !important;
  }
}
</style>
