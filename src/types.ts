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
//TODO
export interface SequencesVuexState {
  sequences: Map<string, Map<string, string>>
  sequencesTotal: number
  sequenceParams: {} //TODO
  sequenceName: ''
  sequenceId: -1 //current selected module ID
  sequenceParamLength: 0
}
