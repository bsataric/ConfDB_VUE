export interface MainVuexState {
  selectedNodeType: string
  selectedNodeName: string
  selectedNodeId: number
  selectedNodeParamLength: number
  selectedNodeParentId: number
  nodeIDToVuexObjectMap: Object
  nodeIDToNodeObjectMap: Object
  openNodeIds: Array<number>
  forcedOpenNodeIds: Array<number>
  forcedActiveNodeId: number
  openFileContent: string
  savedFileContent: string
  darkMode: boolean
  idCounter: number
  snackBarOpen: boolean
  snackBarText: string
  snackBarColor: string
}

export interface NodeObject {
  id: number
  name: string
  type: string
  globalType: string
  children: Array<Object>
  parentNodeId: number //parent node ID of current node
  rootNodeId: number //ID of the root node that references this node
  referencedByIds: Array<number>
  iconType: string
  iconColor: string
  value: string
  intrinsicValue: any
  ctype: string
  ptype: string
}
