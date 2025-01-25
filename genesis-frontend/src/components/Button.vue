<template>
  <button class="button" :disabled="props.disabled || props.loading">
    <Spinner v-if="props.loading" class="spinner" />
    <slot v-else></slot>
  </button>
</template>

<script setup lang="ts">
import Spinner from "./Spinner.vue";

const props = defineProps<{
  loading?: boolean;
  disabled?: boolean;
}>();

</script>

<style scoped>
.button {
  height: 36px;
  vertical-align: middle;
  margin: 0 4px;
  border: 1px solid var(--color-border-special);
  background-color: var(--color-background-special);
  color: var(--color-text-special);
  font-size: 14px;
  font-weight: bold;
  padding: 0 14px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.button:disabled:not(:has(.spinner)) {
  border-color: var(--color-border-normal-mute);
  background-color: var(--color-background-normal-mute);
  color: var(--color-text);
}

.button:has(.spinner) {
  padding: 0;
}

.button:hover:not(:disabled), .button:active:not(:disabled) {
  background-color: var(--color-background-special-mute);
}

.button:active:not(:disabled) {
  transform: translateY(1px);
}

.spinner {
  width: 22px;
  height: 22px;
}

</style>
