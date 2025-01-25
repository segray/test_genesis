import { readonly, ref, shallowRef } from "vue";
import { defineStore } from "pinia";
import { usePending } from "@/composables/usePending";
import { TMessageType, useAlert } from "./useAlert";

export type TEntity = "leads" | "contacts" | "companies";
export type TEntityItem = {
  entity: TEntity;
  id: string;
  href: string;
};

export const entityNames: Record<TEntity, string> = {
  leads: "Сделка",
  contacts: "Контакт",
  companies: "Компания",
} as const;

export const useEntityStore = defineStore("entities", () => {
  const entites = ref<TEntityItem[]>([]);
  const pending = usePending();
  const alertStore = useAlert();

  const create = (type: TEntity) => {
    return pending
      .wrap(
        fetch(new URL("/entity/" + type, import.meta.env.VITE_API_URL), {
          method: "POST",
        }).then((response) => response.json())
      )
      .then((data) => {
        entites.value.push(data);
      }).catch((error) => {
        alertStore.send(`Сервис не доступен (${error.message})`, TMessageType.warning);
      });
  };

  return {
    entites: readonly(entites),
    create,
    pending: pending.status,
  } as const;
});
