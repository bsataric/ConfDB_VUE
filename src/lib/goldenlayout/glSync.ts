import { createDecorator } from 'vue-class-component'
import { GenericVueInstance } from './types'

// per vue instance: glproperty -> vueproperty
const glSyncTable = new Map<GenericVueInstance, Record<string, string>>()

export function GLSet(
  instance: GenericVueInstance,
  payload: Record<string, unknown>
) {
  const instancemap = glSyncTable.get(instance)

  if (payload && instancemap) {
    Object.keys(payload).forEach((glproperty) => {
      const vueproperty = instancemap[glproperty]
      if (vueproperty) {
        instance[vueproperty] = payload[glproperty]
      }
    })
  }
}

export function GLSync(glProperty?: string) {
  const f = createDecorator(function(componentOptions, vueProperty) {
    if (typeof componentOptions.watch !== 'object') {
      componentOptions.watch = Object.create(null)
    }
    // the watch object is typed incorrectly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const watch = componentOptions.watch as Record<string, any>
    if (
      typeof watch[vueProperty] === 'object' &&
      !Array.isArray(watch[vueProperty])
    ) {
      watch[vueProperty] = [watch[vueProperty]]
    } else if (typeof watch[vueProperty] === 'undefined') {
      watch[vueProperty] = []
    }

    watch[vueProperty].push({
      handler: '__glstate_' + vueProperty,
      deep: false,
      immediate: false,
    })
    const mountfunc = componentOptions.created as () => never
    componentOptions.created = function() {
      glSyncTable.set(this as GenericVueInstance, {
        [glProperty || vueProperty]: vueProperty,
      })
      mountfunc && mountfunc.call(this)
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function(options: any, vueProperty: string) {
    options['__glstate_' + vueProperty] = function(value: unknown) {
      this.__pushGLConfig(glProperty || vueProperty, value)
    }

    f(options, vueProperty)
  }
}
