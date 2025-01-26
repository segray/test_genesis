<template>
  <div
    class="custom-select"
    tabindex="0"
    @blur="isShow = false"
    @keydown="handleKeyDown($event)"
    :style="width === undefined ? {} : { width }"
  >
    <div
      class="custom-select__button"
      role="combobox"
      :aria-expanded="isShow"
      :aria-controls="`custom-select__options-${id}`"
      @click="isShow = !isShow"
    >
      {{ props.label ? `${props.label}:` : "" }} {{ selectedTitle ?? "Не выбрано" }}
    </div>
    <ul :id="`custom-select__options-${id}`" class="custom-select__options" role="listbox">
      <li
        v-for="([id, title], index) in options"
        :key="id"
        @click="selectOption(index)"
        @mouseover="focusOption(index)"
        role="option"
        :class="{
          'custom-select__option--selected': index === selectedIndex,
          'custom-select__option--focused': index === focusedIndex % options.length,
        }"
      >
        {{ title }}
      </li>
    </ul>
    <input type="hidden" :name="props.name || ''" :value="model" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from "vue";

const props = defineProps<{
  options: Record<string, string> | Array<string | [string, string]>;
  name?: string;
  label?: string;
  width?: number | string;
}>();
const model = defineModel<string | undefined>();

// преобразовать пропсы в массив кортежей [ключ, значение]
// у массивов более строгий порядок и проще узнавать длину и получать элемент по индексу
const options = computed(() => {
  if (Array.isArray(props.options)) {
    return props.options.map((option): [string, string] => {
      if (Array.isArray(option)) {
        return option;
      } else {
        return [option, option];
      }
    });
  } else {
    return Object.entries(props.options);
  }
});

const selectedIndex = ref(-1);
const focusedIndex = ref(-1);
const isShow = ref(false);
const id = useId();

// сбрасывать выбор элемента и фокус при изменении массива элементов выпадающего списка
watch(options, () => {
  selectedIndex.value = -1;
  focusedIndex.value = -1;
});

// обновление модели при выборе элемента
watch(selectedIndex, (next) => {
  if (next < 0 || next >= options.value.length) {
    model.value = undefined;
  } else {
    model.value = options.value[selectedIndex.value][0];
  }
});

// выбор элемента при изменении модели снаружи
watch(
  model,
  (next) => {
    nextTick(() => {
      // findIndex вернет -1 при отсутствии элемента
      selectedIndex.value = options.value.findIndex(([id]) => id === next);
    });
  },
  { immediate: true }
);

const selectOption = (index: number) => {
  selectedIndex.value = index;
  isShow.value = false;
};

const focusOption = (index: number) => {
  focusedIndex.value = index;
};

const selectedOption = computed(() =>
  selectedIndex.value >= 0 ? options.value[selectedIndex.value] : undefined
);

const selectedTitle = computed(() => selectedOption.value?.[1]);

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    isShow.value = false;
  } else if (event.key === "Enter") {
    if (isShow.value) {
      selectOption(focusedIndex.value);
    } else {
      isShow.value = true;
    }
  } else if (event.key === "ArrowDown") {
    focusedIndex.value = (focusedIndex.value + 1) % options.value.length;
  } else if (event.key === "ArrowUp") {
    focusedIndex.value = (focusedIndex.value - 1) % options.value.length;
    if (focusedIndex.value < 0) {
      focusedIndex.value += options.value.length;
    }
  }
};
</script>

<style scoped>
.custom-select {
  position: relative;
  display: inline-block;
  width: 300px;
  user-select: none;
  vertical-align: middle;
}

.custom-select:focus {
  outline: none;
}

.custom-select:focus .custom-select__button {
  border-color: var(--color-border-normal);
}

.custom-select__button {
  height: 36px;
  align-content: center;
  width: 100%;
  border: 1px solid var(--color-border-normal-mute);
  border-radius: 4px;
  background-color: var(--color-background-normal-mute);

  padding-inline-start: 0.5em;
  display: inline-block;
}

.custom-select__button::after {
  content: "";
  position: absolute;

  top: 50%;
  transform: translateY(-50%) rotate(45deg);

  margin-top: -2px;
  right: 1em;
  width: 8px;
  height: 8px;
  border-color: var(--color-text-normal-mute);
  border-right: 2px solid;
  border-bottom: 2px solid;

  transition: transform 0.1s linear;
}

.custom-select__button[aria-expanded="true"]::after {
  transform: translateY(-50%) rotate(-135deg);
  margin-top: 2px;
}

.custom-select__options {
  list-style: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  border: 1px solid var(--color-border-normal-mute);
  border-radius: 4px;
  z-index: 1;
  padding: 0;
  display: none;
  background-color: var(--color-background-normal);
}

.custom-select__button[aria-expanded="true"] + .custom-select__options {
  display: block;
}

.custom-select__options li {
  padding-left: 1.5em;
  line-height: 2.5em;
  cursor: pointer;
}

.custom-select__options li.custom-select__option--selected::before {
  content: "\2714";
  position: absolute;
  margin-left: -1em;
}

.custom-select__options li.custom-select__option--focused {
  background-color: var(--color-background-normal-mute);
}
</style>
