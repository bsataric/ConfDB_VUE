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
    for (const [key, value] of Object.entries(
      nodeIDToNodeObjectMap as Map<number, NodeObject>
    )) {
      //console.log('OUTER KEY: ' + key)
      if (
        nodeIDToNodeObjectMap[value.id].globalType == 'sequenceNode' //main sequence node
      ) {
        /*     console.log('SEQUENCE NAME: ' + nodeIDToNodeObjectMap[value.id].name)
        console.log('KEY: ' + key)
        console.log('SEQUENCE ID: ' + nodeIDToNodeObjectMap[value.id].id) */

        sequencesObject[nodeIDToNodeObjectMap[value.id].name] = []
        //now go through all sequence children and add them to array
        for (const [key1, value1] of Object.entries(
          nodeIDToNodeObjectMap[value.id].children
        )) {
          let childrenObject = Array()
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
      } else if (
        nodeIDToNodeObjectMap[value.id].globalType == 'pathNode' //main path node
      ) {
        /*       console.log('PATH NAME: ' + nodeIDToNodeObjectMap[value.id].name)
        console.log('KEY: ' + key)
        console.log('PATH ID: ' + nodeIDToNodeObjectMap[value.id].id) */

        pathsObject[nodeIDToNodeObjectMap[value.id].name] = []
        //now go through all sequence children and add them to array
        for (const [key1, value1] of Object.entries(
          nodeIDToNodeObjectMap[value.id].children
        )) {
          let childrenObject = Array()
          childrenObject.push(
            nodeIDToNodeObjectMap[value.id].children[key1].type
          )
          childrenObject.push(
            nodeIDToNodeObjectMap[value.id].children[key1].name
          )
          pathsObject[nodeIDToNodeObjectMap[value.id].name].push(childrenObject)
        }
      } else if (
        nodeIDToNodeObjectMap[value.id].globalType == 'moduleNode' //main path node
      ) {
        /*         console.log('MODULE NAME: ' + nodeIDToNodeObjectMap[value.id].name)
        console.log('KEY: ' + key)
        console.log('MODULE ID: ' + nodeIDToNodeObjectMap[value.id].id) */
        let moduleObject: Object = { params: {}, ctype: '', pytype: '' }

        /*   console.log('MODULE NAME' + nodeIDToNodeObjectMap[value.id].name)
        console.log(
          'MODULE CHILDREN' +
            JSON.stringify(nodeIDToNodeObjectMap[value.id].children)
        ) */

        //now go through all sequence children and add them to array
        for (const [key1, value1] of Object.entries(
          nodeIDToNodeObjectMap[value.id].children
        )) {
          let paramObject: Object = {}
          paramObject['type'] =
            nodeIDToNodeObjectMap[value.id].children[key1].type
          if (
            paramObject['type'] == 'cms.VPSet' ||
            paramObject['type'] == 'cms.PSet'
          ) {
            paramObject['value'] = 'VPESET' //TODO
          } else if (paramObject['type'] == 'cms.bool') {
            console.log(
              'BOOL VALUE: ' +
                nodeIDToNodeObjectMap[value.id].children[key1].value
            )
            paramObject['value'] =
              nodeIDToNodeObjectMap[value.id].children[key1].value == 'true'
          } else if (
            paramObject['type'] == 'cms.int32' ||
            paramObject['type'] == 'cms.double'
          )
            paramObject['value'] = Number.parseFloat(
              nodeIDToNodeObjectMap[value.id].children[key1].value
            )
          else {
            paramObject['value'] = nodeIDToNodeObjectMap[value.id].children[
              key1
            ].value as string
            //console.log('PARAM OBECT VALUE: ' + paramObject['value'])

            /*       if (
                nodeIDToNodeObjectMap[value.id].children[key1].name ==
                'oldClusterRemovalInfo = '
              ) {
                console.log(
                  'oldClusterRemovalInfo value on SAVE: ' + paramObject['value']
                )
              } */
            if (
              paramObject['value'] != undefined &&
              paramObject['value'] != '""' &&
              paramObject['type'] != 'cms.bool' &&
              paramObject['type'] != 'cms.untracked.bool'
            )
              paramObject['value'] = paramObject['value'].slice(1, -1)
            //
            /*      if (
                nodeIDToNodeObjectMap[value.id].children[key1].name ==
                'oldClusterRemovalInfo = '
              ) {
                console.log(
                  'oldClusterRemovalInfo value on SAVE after SLICE: ' +
                    paramObject['value']
                )
              } */
          }

          /*   let childrenObject = Array() //TODO: fix module parameter parsing
          childrenObject.push(
            nodeIDToNodeObjectMap[value.id].children[key1].type
          )
          childrenObject.push(
            nodeIDToNodeObjectMap[value.id].children[key1].name
          )
          modulesObject[nodeIDToNodeObjectMap[value.id].name].push(
            childrenObject
          ) */
          let nameLength =
            nodeIDToNodeObjectMap[value.id].children[key1].name.length
          moduleObject['params'][
            nodeIDToNodeObjectMap[value.id].children[key1].name.substring(
              0,
              nameLength - 3
            )
          ] = paramObject
        }
        moduleObject['ctype'] = nodeIDToNodeObjectMap[value.id].ctype
        moduleObject['pytype'] = nodeIDToNodeObjectMap[value.id].pytype
        modulesObject[nodeIDToNodeObjectMap[value.id].name] = moduleObject
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
}
