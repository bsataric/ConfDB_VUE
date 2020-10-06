import { panels, panelTitle, PanelState } from '../../panels'
import { ComponentConfig } from 'golden-layout'

export interface PanelConfig extends ComponentConfig {
  componentState: PanelState
}

export function makePanelConfig(title: panelTitle): PanelConfig {
  return {
    title,
    type: 'component',
    componentName: 'vueComponent',
    componentState: { title, vueConfig: {} },
  }
}

export function getPanelTitle(title: string): panelTitle | void {
  if (!panels[title as panelTitle]) {
    console.error(
      'no panel exists with this name',
      title,
      'valid options are',
      Object.keys(panels)
    )
    return
  }
  return title as panelTitle
}
