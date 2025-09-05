<template>
  <div class="card">
    <DataTable :value="products" tableStyle="min-width: 50rem">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xl font-bold">Products</span>
          <Button
            :label="isScan ? 'STOP SCAN' : 'START SCAN'"
            :icon="isScan ? 'pi pi-stop-circle' : 'pi pi-play-circle'"
            @click="isScan = !isScan"
            :class="isScan ? 'p-button-danger' : 'p-button-secondary'"
          />
        </div>
      </template>

      <Column header="Image">
        <template #body="slotProps">
          <img
            :src="slotProps.data.image"
            :alt="slotProps.data.name"
            class="w-24 rounded"
          />
        </template>
      </Column>
      <Column field="id" header="ID" />

      <Column field="name" header="Name" />

      <Column field="style" header="Style" />

      <Column field="color" header="Color" />

      <Column field="size" header="Size" />

      <Column field="quantity" header="Quantity" />
      <Column field="targetQuantity" header="TargetQuantity" />
      <template #footer>
        In total there are {{ products ? products.length : 0 }} products.
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
// import { ProductService } from "@/service/ProductService";

const isScan = ref<boolean>(false);
onMounted(() => {
  products.value = [
    {
      id: "14800348086636",
      name: "HOME - PLAYER",
      style: "P2SACW10",
      color: "54 ORANGE/BLUE , BLUE",
      size: "XS",
      image:
        "https://cdn.shopify.com/s/files/1/0928/5635/3132/files/Mizuno-PortJuly25-3.jpg?v=1756890603",

      quantity: 1,
      targetQuantity: 50,
    },
  ];
});

const products = ref();
const formatCurrency = (value: any) => {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
};
const getSeverity = (product: any) => {
  switch (product.inventoryStatus) {
    case "INSTOCK":
      return "success";

    case "LOWSTOCK":
      return "warn";

    case "OUTOFSTOCK":
      return "danger";

    default:
      return undefined;
  }
};
</script>
