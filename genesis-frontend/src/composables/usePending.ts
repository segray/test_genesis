import { ref } from 'vue'

export const usePending = () => {
  const status = ref(false)
  const wrap = <T>(promise: Promise<T>): Promise<T> => {
    status.value = true
    return promise.finally(() => {
      status.value = false
    })
  }

  type TFn = (...args: unknown[]) => unknown
  const wrapCallback = <T extends TFn>(fn: T): TFn => {
    status.value = true
    return (...args: unknown[]): unknown => {
      status.value = false
      return fn(...args);
    }
  }

  return { status, wrap, wrapCallback } as const
}
