<template>
  <div class="spinner"></div>
</template>

<script setup lang="ts"></script>

<style scoped>
.spinner {
  margin: 6px;
  display: inline-block;
  border: 2px solid;
  border-color: var(--color-text-special);
  border-radius: 50%;
  border-left-color: transparent;
  border-bottom-color: transparent;
  animation: spin 0.75s infinite linear;
}
</style>
