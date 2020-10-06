import { CombinedVueInstance } from 'vue/types/vue'

// unfortunately, this is how vue type definitions expose things
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GenericVueInstance = CombinedVueInstance<
  Vue,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Record<string, any>
>
