import {
  default as GoldenLayout,
  ItemConfigType,
  Container,
  BrowserWindow,
} from 'golden-layout'
import 'jquery'

import { panels, PanelState, panelTitle } from '../../panels'
import WaitingPanel from '../../components/waiting.vue'
import UnknownPanel from '../../components/unknownPanel.vue'
import ErrorPanel from '../../components/errorPanel.vue'
import { GenericVueInstance } from './types'
import { VueConstructor } from 'vue/types/vue'
import goStyle from '../../lib/to'

class UnknownPanelError extends Error {
  constructor(panelTitle: string) {
    super('unknown panel ' + panelTitle)
    // this makes 'instanceof UnknownPanelError' work
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

// Wrapper class for golden-layout to make life easier and deal with golden-layout specifics
export class Layout {
  private lsKey: string
  private goldenLayout: GoldenLayout

  // we keep a list of active 'popout' windows.
  // we need this to close these windows if the user wishes to switch to another workspace
  private popouts: BrowserWindow[] = []

  private defaultLayout: ItemConfigType[]

  constructor(
    public readonly id: string,
    public readonly mountpoint = document.body,
    defaultLayout: ItemConfigType[],
    layout?: ItemConfigType[]
  ) {
    this.id = id
    this.lsKey = 'layout ' + id
    this.defaultLayout = defaultLayout
    this.goldenLayout = this.makeGoldenLayout(mountpoint, layout)
  }

  public resetLayout(layout: ItemConfigType[]) {
    if (!layout) {
      return console.error('no layout given')
    }
    this.goldenLayout.destroy()
    this.goldenLayout = this.makeGoldenLayout(this.mountpoint, layout)
    this.writeConfig()
  }

  public addPanel(title: panelTitle) {
    const newItemConfig = makePanelConfig(title)
    if (this.goldenLayout.selectedItem === null) {
      this.goldenLayout.root.contentItems[0].addChild(newItemConfig)
    } else {
      this.goldenLayout.selectedItem.addChild(newItemConfig)
    }
  }

  public addDragger(el: HTMLElement, panel: panelTitle) {
    this.goldenLayout.createDragSource(el, makePanelConfig(panel))
  }

  private makeGoldenLayout(
    mountpoint: HTMLElement, //counter parameter type on the right side Typescript
    layout?: ItemConfigType[]
  ): GoldenLayout {
    const config = layout // make our config either from
      ? this.makeConfigFromLayout(layout) // the layout parameter if given
      : this.readConfig() // any previous config, or the default layout
    const gl = new GoldenLayout(config, mountpoint)
    registerPanelMounter(gl)

    // a new window does not share the initial state
    // so, when a new window opens, we fire an event that
    // triggers the function below *on the Layout instance in the new window*.
    // any alterations after the new window opens is synced with vuex-shared-mutations
    /*     gl.on('windowOpened', (popout: GoldenLayout.BrowserWindow) => {
      this.popouts.push(popout)
      popout.getGlInstance().emit('stateTransfer', stores.root.state)
      this.writeConfig()
    })
    gl.on('stateTransfer', (state: Record<string, unknown>) => {
      stores.root.commit('brainTransfer', state)
    }) */

    window.addEventListener('resize', () => gl.updateSize())
    gl.init()

    return gl
  }

  private makeConfigFromLayout(layout: ItemConfigType[]): GoldenLayout.Config {
    return {
      settings: {
        selectionEnabled: true, //enable selection of panels for custom adding
      },
      content: layout,
    }
  }
  // defaultLayout = layouts["layout A"];
  // returns either default config or config from localStorage
  private readConfig(
    layout: ItemConfigType[] = this.defaultLayout
  ): GoldenLayout.Config {
    const defaultConfig = this.makeConfigFromLayout(layout)
    const savedState = localStorage.getItem(this.lsKey)
    if (savedState) {
      try {
        const restoredConf = JSON.parse(savedState) as GoldenLayout.Config
        return restoredConf
      } catch (e) {
        console.error('cannot restore saved layout', {
          id: this.id,
          content: savedState,
        })
        return defaultConfig
      }
    } else {
      return defaultConfig
    }
  }

  private writeConfig() {
    try {
      const conf = this.goldenLayout.toConfig() // this fails when a popout is opened
      localStorage.setItem(this.lsKey, JSON.stringify(conf))
    } catch (e) {
      // when opening a popout, we get into race conditions for which
      // we do not have the means to solve here
      // solved a bit further down (1)
      if (e.message.indexOf('layout not yet initialised') !== -1) {
        return

        // bug in goldenlayout
      } else if (e.message.indexOf('call stack size exceeded')) {
        return
      } else {
        console.error('error saving workspace config', e)
      }
    }
  }
}

// to be able to add vue components as panels to a GL instance
// we register a GL component called vueComponent
// this will take a 'title' as argument, load the associated vue component
// and mount it in the container given to the vueComponent instance
function registerPanelMounter(instance: GoldenLayout) {
  instance.registerComponent(
    'vueComponent',
    async (container: Container, panelState: PanelState) => {
      // golden-layout expects us to work in the 'root element' in the container
      const rootEl = container.getElement()[0]

      // vueInstance.$mount() will delete this element and let its root element take its place
      const mountEl = document.createElement('div')
      rootEl.appendChild(mountEl)

      insertWaitingComponent(mountEl)

      // panel name is given in the vueComponent constructor
      const [err, vueEl] = await goStyle(getPanel(panelState.title))
      let vueElInstance: any //BSATARIC: changed to any because of typing mismatch from Glenn's code for some reason
      if (err && err instanceof UnknownPanelError) {
        vueElInstance = new UnknownPanel()
      } else if (err || !vueEl) {
        console.error('error while loading panel', {
          panel: panelState.title,
          err,
        })
        vueElInstance = new ErrorPanel()
      } else {
        // the constructor creates a new Vue instance
        // normally this would be invisible, except that you'd lose your link to the store
        // therefore add the store in the Vue constructor
        vueElInstance = new vueEl({ store: stores.root, vuetify })
      }

      attachContainer(container, vueElInstance)
      attachResizeEvent(container, vueElInstance)

      vueElInstance.__pushGLConfig = (key: string, value: unknown) => {
        const s = container.getState() as PanelState
        s.vueConfig[key] = value
        container.setState(s)
      }
      GLSet(vueElInstance, panelState.vueConfig)

      container.on('destroy', () => {
        vueElInstance.$destroy()
      })

      vueElInstance.$mount(mountEl) // this destroys the waiting component
    }
  )
}

function insertWaitingComponent(container: HTMLElement) {
  const el = new WaitingPanel()
  const div = document.createElement('div')
  container.appendChild(div)
  el.$mount(div)
}
