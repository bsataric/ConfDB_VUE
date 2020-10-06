import { ItemConfigType } from 'golden-layout'
import { makePanelConfig as panel } from './makePanelConfig'

export const workspaces: {
  [groupname: string]: { [key: string]: ItemConfigType[] }
} = {
  Generic: {
    'I am': [
      {
        type: 'row',
        content: [panel('I am')],
      },
    ],
    Editor: [
      {
        type: 'row',
        content: [panel('Editor')],
      },
    ],
  },
  // "example nested layout": [
  //   {
  //     type: "row",
  //     content: [
  //       panel("I am"),
  //       {
  //         type: "column",
  //         content: [panel("Table"), panel("Editor")],
  //       },
  //     ],
  //   },
  // ],
}

export const defaultWorkspace = workspaces['layout A']
