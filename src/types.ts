export interface MainVuexState {
  JSONconfiguration: any
  selectedNodeType: string
  selectedNodeName: string
  selectedNodeCType: string
  selectedNodeId: number
  selectedNodeParamLength: number
  selectedNodeParentId: number
  selectedNodeParentParentId: number
  nodeIDToNodeObjectMap: Object
  topLevelNodeTypeIds: Object
  nonTopLevelNodeNameIdMap: Object
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
  configLoaded: boolean
}

export interface NodeObject {
  id: number
  name: string
  type: string
  globalType: string
  children: Array<NodeObject>
  parentNodeId: number //parent node ID of current node
  rootNodeId: number //ID of the root node that references this node
  referencedByIds: Array<number>
  iconType: string
  iconColor: string
  paremeterJSONValue: any //valid only for parameter nodes
  ctype: string
  ptype: string
}

export interface NodeBasicInfo {
  id: number
  name: string
  type: string
  text: string
}

export interface NodeInsertInfo {
  id: number
  name: string
  type: string
  text: string
  clone: boolean
  cloneName: string
}
