import { ref } from "vue";
import { defineStore } from "pinia";
import { usePending } from "@/composables/usePending";
import { TMessageType, useAlertStore } from "./useAlert";
import { toReadonly } from "@/utils/toReadonly";

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

export const useEntitiesStore = defineStore("entities", () => {
  const entites = ref<TEntityItem[]>([]);
  const pending = usePending();
  const alertStore = useAlertStore();

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

  return toReadonly({
    entites,
    create,
    pending: pending.status,
  });
});
