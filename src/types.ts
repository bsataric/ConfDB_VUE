export interface MainVuexState {
  selectedNodeType: string
  selectedNodeName: string
  selectedNodeId: number
  selectedNodeParamLength: number
  selectedNodeParentId: number
  nodeIDToObjectMap: Object
  openNodeIds: Array<number>
  forcedOpenNodeIds: Array<number>
  forcedActiveNodeId: number
  openFileContent: string
  darkMode: boolean
}
