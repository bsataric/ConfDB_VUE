import { VueConstructor } from 'vue/types/umd'

//////////
// Add panel names here
//////////
type PanelName = 'I am' | 'Editor' | 'Table' | 'Manual Editor' | 'Fancy Table'
const items: PanelsConf = {
  'I am': 'IAm',
  Editor: 'Edit',
  Table: 'Table',
  'Fancy Table': 'TableEditor',
  'Manual Editor': 'Code',
}

//////////
// Creates lazy loaders from previous panel configs
//////////
type PanelsConf = {
  [t in PanelName]: string
}
type Loader = () => Promise<VueConstructor<Vue>>
type PanelsLoader = {
  [t in PanelName]: Loader
}

function panelsList(items: PanelsConf): PanelsLoader {
  // string instead of PanelName so the compiler doesn't complain before we
  // get a chance to initialize
  const panels: { [name: string]: Loader } = {}
  Object.keys(items).forEach(
    (title) =>
      (panels[title as PanelName] = () =>
        import(
          /* webpackChunkName: "panels/[request]" */ './' +
            items[title as PanelName] +
            '.vue'
        ).then((s) => s.default))
  )
  return panels as PanelsLoader
}
export const panels = panelsList(items)

//////////
// Types
//////////
export type panelTitle = keyof typeof panels
export interface PanelState {
  title: panelTitle
  vueConfig: Record<string, unknown>
}
