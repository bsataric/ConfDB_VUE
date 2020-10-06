import { Layout } from './layout'
import { workspaces } from './workspaces'

export let layout: Layout

export const init = (mount: HTMLElement) => {
  if (layout) {
    console.error('cannot mount main layout twice')
    return
  }
  const firstgroup = Object.keys(workspaces)[0]
  const firstLayout = Object.keys(workspaces[firstgroup])[0]
  layout = new Layout('pstools', mount, workspaces[firstgroup][firstLayout])
}
