import { ref } from "vue";
import { defineStore } from "pinia";
import { toReadonly } from "@/utils/toReadonly";

export const enum TMessageType {
  success = "success",
  error = "error",
  warning = "warning",
  info = "info",
}

export const useAlertStore = defineStore("alert", () => {
  const currentMessage = ref("");
  const currentMessageType = ref<TMessageType>();
  const currentMessageDate = ref<Date>();

  const send = (message: string, type: TMessageType = TMessageType.info) => {
    currentMessage.value = message;
    currentMessageType.value = type;
    currentMessageDate.value = new Date();
  };

  return toReadonly({
    currentMessage,
    currentMessageType,
    currentMessageDate,
    send,
  });
});
