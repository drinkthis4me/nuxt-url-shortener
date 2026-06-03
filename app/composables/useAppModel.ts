import type { Component } from 'vue'

export default function<T = unknown>(comp: Component) {
  const overlay = useOverlay()
  const model = overlay.create(comp)

  const open = async (
    onConfirm: (result: T) => void | Promise<void>,
    props?: Record<string, string>,
  ) => {
    const instance = model.open(props ?? {})
    const result = await instance.result

    if (result) {
      await onConfirm(result)
    }
  }

  return {
    open,
  }
}
