import type { DeepReadonly } from "vue";

export const toReadonly = <Type>(value: Type) => {
  return value as DeepReadonly<Type>;
};
