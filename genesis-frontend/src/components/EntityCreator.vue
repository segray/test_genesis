<template>
  <div class="container">
    <div>
      <Select :options="entityNames" label="Сущность" v-model="entityModel" />
      <Button
        :disabled="entityModel === undefined"
        :loading="entityStore.pending"
        @click="handleClickCreate"
        >Создать</Button
      >
    </div>
    <ul class="entity-list">
      <li
        v-for="entity in entityStore.entites"
        class="entity-list-item"
        :key="entity.id"
        :data-type="entity.entity"
      >
        <div class="entity-list-item__name">{{ entityNames[entity.entity] }}</div>
        <div class="entity-list-item__data">
          <a :href="entity.href">{{ entity.id }}</a>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Select from "./Select.vue";
import Button from "./Button.vue";
import { useEntityStore, entityNames } from "@/stores/entities";
import type { TEntity } from "@/stores/entities";

const entityModel = ref<TEntity | undefined>();
const entityStore = useEntityStore();

const handleClickCreate = () => {
  if (entityModel.value !== undefined && !entityStore.pending) {
    entityStore.create(entityModel.value);
  }
};
</script>

<style scoped>
.entity-list {
  margin-top: 16px;
  list-style: none;
  padding: 0;
}

.entity-list {
  display: flex;
  flex-direction: column-reverse;
}

.entity-list-item {
  margin: 5px 0;
  width: 300px;
  border: 1px solid var(--color-border-normal-mute);
}

.entity-list-item__name {
  padding: 0.2em;
  padding-inline-start: 0.5em;
  font-weight: bold;
  font-size: 12px;
}

.entity-list-item__data {
  padding: 0.2em;
  padding-inline-start: 0.5em;
  font-size: 14px;
}

.entity-list-item[data-type="leads"] .entity-list-item__name {
  background-color: #b7cff8;
}
.entity-list-item[data-type="contacts"] .entity-list-item__name {
  background-color: #f8efa0;
}
.entity-list-item[data-type="companies"] .entity-list-item__name {
  background-color: #97fad4;
}
</style>
