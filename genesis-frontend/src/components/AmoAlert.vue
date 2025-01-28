<template>
  <div
    class="alert"
    v-show="isShow"
    role="alert"
  >
    {{ alertStore.currentMessage }}
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useAlertStore } from "../stores/useAlert";

const isShow = ref(false);
const alertStore = useAlertStore();

let timeout: number = 0;

watch(alertStore, () => {
  clearTimeout(timeout);
  isShow.value = true;
  timeout = setTimeout(() => {
    isShow.value = false;
  }, 3000);
});
</script>

<style scoped>
.alert {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  width: 100vw;
  z-index: 1000;

  font-size: 14px;
  background-color: chocolate;
  padding-inline-start: 0.5em;
}
</style>
