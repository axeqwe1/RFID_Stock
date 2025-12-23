import { defineStore } from "pinia";
import type { AuthEntity } from "../../domain/entity/AuthEntity";
import { ref } from "vue";

export const AuthStore = defineStore("Auth", () => {
  const Auth = ref<AuthEntity | null>(null);

  return { Auth };
});
