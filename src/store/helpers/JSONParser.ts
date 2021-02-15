import { NodeObject } from '@/types'
//const stringifyObject = require('stringify-object')

/*
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
*/
export default {
  parseMapToJSON(nodeIDToNodeObjectMap: Map<number, NodeObject>): string {
    let savedFileContentObject: Object = {
      seqs: {},
      paths: {},
      mods: {},
      psets: {},
    }
    let sequencesObject: Object = {}
    let pathsObject: Object = {}
    let modulesObject: Object = {}
    let psetsObject: Object = {}

    //parse the map here
    for (const [nodeId, nodeObject] of Object.entries(
      nodeIDToNodeObjectMap as Map<number, NodeObject>
    )) {
      /*      console.log('OUTER KEY: ' + nodeId)
      console.log('VALUE ID: ' + value.id) */
      if (
        nodeIDToNodeObjectMap[nodeId].globalType == 'sequenceNode' //main sequence node
      ) {
        /*     console.log('SEQUENCE NAME: ' + nodeIDToNodeObjectMap[nodeId].name)
        console.log('KEY: ' + key)
        console.log('SEQUENCE ID: ' + nodeIDToNodeObjectMap[nodeId].id) */

        sequencesObject[nodeIDToNodeObjectMap[nodeId].name] = []
        //now go through all sequence children and add them to array
        for (const [key1, value1] of Object.entries(
          nodeIDToNodeObjectMap[nodeId].children
        )) {
          let childrenObject = Array()
          childrenObject.push(nodeIDToNodeObjectMap[nodeId].children[key1].type)
          childrenObject.push(nodeIDToNodeObjectMap[nodeId].children[key1].name)
          sequencesObject[nodeIDToNodeObjectMap[nodeId].name].push(
            childrenObject
          )
        }
      } else if (
        nodeIDToNodeObjectMap[nodeId].globalType == 'pathNode' //main path node
      ) {
        /*       console.log('PATH NAME: ' + nodeIDToNodeObjectMap[nodeId].name)
        console.log('KEY: ' + key)
        console.log('PATH ID: ' + nodeIDToNodeObjectMap[nodeId].id) */

        pathsObject[nodeIDToNodeObjectMap[nodeId].name] = []
        //now go through all sequence children and add them to array
        for (const [key1, value1] of Object.entries(
          nodeIDToNodeObjectMap[nodeId].children
        )) {
          let childrenObject = Array()
          childrenObject.push(nodeIDToNodeObjectMap[nodeId].children[key1].type)
          childrenObject.push(nodeIDToNodeObjectMap[nodeId].children[key1].name)
          pathsObject[nodeIDToNodeObjectMap[nodeId].name].push(childrenObject)
        }
      } else if (
        nodeIDToNodeObjectMap[nodeId].globalType == 'moduleNode' //main path node
      ) {
        /*         console.log('MODULE NAME: ' + nodeIDToNodeObjectMap[nodeId].name)
        console.log('KEY: ' + key)
        console.log('MODULE ID: ' + nodeIDToNodeObjectMap[nodeId].id) */
        let moduleObject: Object = { params: {}, ctype: '', pytype: '' }

        /*   console.log('MODULE NAME' + nodeIDToNodeObjectMap[nodeId].name)
        console.log(
          'MODULE CHILDREN' +
            JSON.stringify(nodeIDToNodeObjectMap[nodeId].children)
        ) */

        //now go through all sequence children and add them to array
        for (const [key1, value1] of Object.entries(
          nodeIDToNodeObjectMap[nodeId].children
        )) {
          let paramObject: Object = {}
          paramObject['type'] =
            nodeIDToNodeObjectMap[nodeId].children[key1].type

          if (
            paramObject['type'] == 'cms.VPSet' ||
            paramObject['type'] == 'cms.PSet'
          ) {
            //parse children here recursivly to elementary parameter objects
            this.parseRecursiveVPSetObject(
              paramObject,
              nodeIDToNodeObjectMap[nodeId].children[key1].children
            )
            moduleObject['params'][
              nodeIDToNodeObjectMap[nodeId].children[key1].name
            ] = paramObject
          } else {
            paramObject['value'] =
              nodeIDToNodeObjectMap[nodeId].children[key1].paremeterJSONValue

            moduleObject['params'][
              nodeIDToNodeObjectMap[nodeId].children[key1].name.substring(
                0,
                nodeIDToNodeObjectMap[nodeId].children[key1].name.length - 3
              )
            ] = paramObject
          }
        }
        moduleObject['ctype'] = nodeIDToNodeObjectMap[nodeId].ctype
        moduleObject['pytype'] = nodeIDToNodeObjectMap[nodeId].pytype
        modulesObject[nodeIDToNodeObjectMap[nodeId].name] = moduleObject
      }
    }

    savedFileContentObject['seqs'] = sequencesObject
    savedFileContentObject['paths'] = pathsObject
    savedFileContentObject['mods'] = modulesObject
    let savedFileContent = JSON.stringify(savedFileContentObject, undefined, 2)
    /*   const pretty = stringifyObject(savedFileContentObject, {
      indent: '  ',
      singleQuotes: false,
    })
    console.log('pretty: ' + pretty) */
    return savedFileContent
  },
  parseRecursiveVPSetObject(
    parameterObject: Object,
    children: Array<NodeObject>
  ) {
    let vpSetObjectArray: Array<Object> = []

    let vpSetObject: Object = {}
    //console.log('children.length' + children.length)
    for (const [key, childObject] of Object.entries(children)) {
      //console.log('KEY:' + key)
      //console.log('VALUE : ' + JSON.stringify(childObject))
      let vPSetParamObject: Object = {}
      vPSetParamObject['type'] = childObject.type
      if (
        vPSetParamObject['type'] == 'cms.VPSet' ||
        vPSetParamObject['type'] == 'cms.PSet'
      ) {
        //TODO: VPSet has to be parsed differently
        //vPSetParamObject['value'] = 'DUMMY'
        this.parseRecursiveVPSetObject(vPSetParamObject, childObject.children)
        vpSetObject[childObject.name] = vPSetParamObject
      } else {
        //basic types
        vPSetParamObject['value'] = childObject.paremeterJSONValue
        vpSetObject[
          childObject.name.substring(0, childObject.name.length - 3)
        ] = vPSetParamObject
      }
    }
    vpSetObjectArray.push(vpSetObject)
    parameterObject['value'] = vpSetObjectArray
  },
}
