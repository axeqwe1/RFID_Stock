<template>
  <div class="flex flex-col gap-1">
    <div
      class="bg-gradient-to-r from-amber-400 to-amber-500 rounded-t-2xl px-6 py-4 mb-4 font-semibold text-lg text-amber-900"
    >
      Out Stock SCREEN
    </div>
    <div class="grid grid-cols-2 gap-6 p-3">
      <div class="col-span-2">
        <!-- Out Stock Table -->
        <div class="w-full h-full space-y-2 rounded-xl shadow-xl border-1 p-3">
          <div class="flex flex-row space-x-2 mb-2">
            <Button
              label="Create Request"
              @click="
                () => {
                  router.push('/queueoutstock/create');
                }
              "
            />
            <Button
              label="Scan"
              @click="
                () => {
                  router.push('/queueoutstock/scanoutstock');
                }
              "
            />
          </div>

          <OutStockTable />
        </div>
      </div>

      <div class="col-span-2">
        <!-- Out Stock Details Table -->
        <div class="w-full h-full space-y-2 rounded-xl shadow-xl border-1 p-3">
          <OutMainTable />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import OutStockTable from "./table/OutStockTable.vue";
import OutMainTable from "./table/OutMainTable.vue";
</script>

<style scoped></style>
