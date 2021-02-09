import { NodeObject } from '@/types'
//const stringifyObject = require('stringify-object')

/*
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
*/
export default {
  parseMapToJSON(nodeIDToNodeObjectMap: Map<number, NodeObject>): string {
    let savedFileContentObject: Object = { seqs: {} }
    let sequencesObject: Object = {}
    //parse the map here
    for (const [key, value] of Object.entries(
      nodeIDToNodeObjectMap as Map<number, NodeObject>
    )) {
      if (nodeIDToNodeObjectMap[value.id].type == 'sequences') {
        console.log('SEQUENCE: ' + nodeIDToNodeObjectMap[value.id].name)
        /*  savedFileContent =  JSON.stringify(
          //try to parse sequence object from sequences to see what's the difference in JSON
          nodeIDToNodeObjectMap[value.id],
          ['type', 'name'],
          '\t'
        )  */
        // break
        sequencesObject[nodeIDToNodeObjectMap[value.id].name] = []
        //now go through all sequence children and add them to array
        for (const [key1, value1] of Object.entries(
          nodeIDToNodeObjectMap[value.id].children
        )) {
          let childrenObject = Array() //TODO: fix this
          childrenObject.push(
            nodeIDToNodeObjectMap[value.id].children[key1].type
          )
          childrenObject.push(
            nodeIDToNodeObjectMap[value.id].children[key1].name
          )
          sequencesObject[nodeIDToNodeObjectMap[value.id].name].push(
            childrenObject
          )
        }
      }
    }
    savedFileContentObject['seqs'] = sequencesObject
    let savedFileContent = JSON.stringify(savedFileContentObject, undefined, 2)
    /*   const pretty = stringifyObject(savedFileContentObject, {
      indent: '  ',
      singleQuotes: false,
    })
    console.log('pretty: ' + pretty) */
    return savedFileContent
  },
}
