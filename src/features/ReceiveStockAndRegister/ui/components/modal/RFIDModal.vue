<template>
  <Dialog
    v-model:visible="Internalvisible"
    modal
    :header="Internaltitle"
    :style="{ width: '90vw', height: '90vh' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    @hide="close"
    :draggable="false"
  >
    <slot />
  </Dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const props = defineProps<{
  visible: boolean;
  title: string;
}>();

const Internalvisible = ref<boolean>(false);
const Internaltitle = ref<string>("");
const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
}>();

const close = () => {
  emit("update:visible", false);
};

watch(
  () => props.visible,
  (newVal) => {
    Internalvisible.value = newVal;
  }
);

onMounted(() => {
  Internaltitle.value = props.title;
});
</script>

<style scoped></style>
