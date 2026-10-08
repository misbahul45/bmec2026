import { createStart } from "@tanstack/react-start"
import { appErrorAdapter } from "~/lib/utils/app-error-adapter"

export const startInstance = createStart(() => ({
  serializationAdapters: [appErrorAdapter],
}))
