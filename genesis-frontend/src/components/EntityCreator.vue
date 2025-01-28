<template>
  <div class="container">
    <div>
      <AmoSelect :options="entityNames" label="Сущность" v-model="entityModel" />
      <AmoButton
        :disabled="entityModel === undefined"
        :loading="entitiesStore.pending"
        @click="handleClickCreate"
        >Создать</AmoButton
      >
    </div>
    <ul class="entity-list">
      <li
        v-for="item in entitiesStore.data"
        class="entity-list-item"
        :key="item.id"
        :data-type="item.entity"
      >
        <div class="entity-list-item__name">{{ entityNames[item.entity] }}</div>
        <div class="entity-list-item__data">
          <a :href="item.href">{{ item.id }}</a>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AmoSelect from "./AmoSelect.vue";
import AmoButton from "./AmoButton.vue";
import { useEntitiesStore, entityNames } from "@/stores/useEntities";
import type { TEntity } from "@/stores/useEntities";

const entityModel = ref<TEntity | undefined>();
const entitiesStore = useEntitiesStore();

const handleClickCreate = () => {
  if (entityModel.value !== undefined && !entitiesStore.pending) {
    entitiesStore.create(entityModel.value);
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
