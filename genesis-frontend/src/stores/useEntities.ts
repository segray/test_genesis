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
  const data = ref<TEntityItem[]>([]);
  const pending = usePending();
  const alertStore = useAlertStore();

  const create = (type: TEntity) => {
    return pending
      .wrap(
        fetch(new URL("/entity/" + type, import.meta.env.VITE_API_URL), {
          method: "POST",
        }).then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            return response.json().then((data) => Promise.reject(data));
          }
        })
      )
      .then((response) => {
        data.value.push(response);
      })
      .catch((error) => {
        let message = error?.message || error?.status || "";
        if (message) {
          message = ` (${message})`;
        }
        message = "Сервис не доступен" + message;

        alertStore.send(message, TMessageType.warning);
      });
  };

  return toReadonly({
    data,
    create,
    pending: pending.status,
  });
});
