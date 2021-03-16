import { NodeObject } from '@/types'
//TODO: maybe reuse same function for modules, essources etc.
export default {
  parseSequences(
    sequenceData: any,
    nodeIDToNodeObjectMap: Object,
    topLevelNodeTypeIds: Object,
    nonTopLevelNodeNameIdMap: Object,
    idCounter: number
  ): Object {
    let sequencesObject: NodeObject = {
      id: 1,
      name: 'Sequences',
      type: 'seqs',
      globalType: 'rootNode',
      children: [],
      parentNodeId: 0,
      rootNodeId: 1,
      referencedByIds: [],
      iconType: '',
      iconColor: '',
      paremeterJSONValue: Infinity,
      ctype: '',
      ptype: '',
    }
    //console.log(sequencesObject)
    for (const [key, value] of Object.entries(sequenceData)) {
      //loop over sequnces - create new Sequence object and add it to children of the seqs
      let sequenceObject: NodeObject = {
        id: ++idCounter,
        name: key,
        type: 'sequences',
        globalType: 'sequenceNode',
        children: [],
        parentNodeId: 1,
        rootNodeId: idCounter, //for the root nodes, rootNodeId = itself
        referencedByIds: [],
        iconType: 'sequence',
        iconColor: 'red',
        paremeterJSONValue: Infinity,
        ctype: '',
        ptype: '',
      }

      if (topLevelNodeTypeIds['sequences'] == undefined) {
        topLevelNodeTypeIds['sequences'] = []
      }
      topLevelNodeTypeIds['sequences'].push(sequenceObject.id)

      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        //loop over sequence entries

        //console.log(`${key1}`)
        if (Object(value1)[0] === 'modules') {
          //console.log('MODULE')
          let nestedSequenceObject: NodeObject = {
            id: ++idCounter,
            name: Object(value1)[1],
            type: 'modules',
            globalType: 'nestedModuleNode',
            children: [],
            parentNodeId: sequenceObject['id'],
            rootNodeId: -1, //for the leaf nodes, rootNodeId will be calculated with references
            referencedByIds: [],
            iconType: 'module',
            iconColor: '',
            paremeterJSONValue: Infinity,
            ctype: '',
            ptype: '',
          }
          nodeIDToNodeObjectMap[idCounter] = nestedSequenceObject
          sequenceObject['children'].push(nestedSequenceObject)

          if (
            nonTopLevelNodeNameIdMap[nestedSequenceObject.name] == undefined
          ) {
            nonTopLevelNodeNameIdMap[nestedSequenceObject.name] = []
          }
          nonTopLevelNodeNameIdMap[nestedSequenceObject.name].push(
            nestedSequenceObject.id
          )
        } else if (Object(value1)[0] === 'sequences') {
          //console.log('SEQUENCE')
          let nestedSequenceObject: NodeObject = {
            id: ++idCounter,
            name: Object(value1)[1],
            type: 'sequences',
            globalType: 'nestedSequenceNode',
            children: [],
            parentNodeId: sequenceObject['id'],
            rootNodeId: -1, //for the leaf nodes, rootNodeId will be calculated with references
            referencedByIds: [],
            iconType: 'sequence',
            iconColor: 'red',
            paremeterJSONValue: Infinity,
            ctype: '',
            ptype: '',
          }

          nodeIDToNodeObjectMap[idCounter] = nestedSequenceObject
          sequenceObject['children'].push(nestedSequenceObject)

          if (
            nonTopLevelNodeNameIdMap[nestedSequenceObject.name] == undefined
          ) {
            nonTopLevelNodeNameIdMap[nestedSequenceObject.name] = []
          }
          nonTopLevelNodeNameIdMap[nestedSequenceObject.name].push(
            nestedSequenceObject.id
          )
        } else if (Object(value1)[0] === 'tasks') {
          //console.log('SEQUENCE')
          let nestedSequenceObject: NodeObject = {
            id: ++idCounter,
            name: Object(value1)[1],
            type: 'tasks',
            globalType: 'nestedTaskNode',
            children: [],
            parentNodeId: sequenceObject['id'],
            rootNodeId: -1, //for the leaf nodes, rootNodeId will be calculated with references
            referencedByIds: [],
            iconType: 'task',
            iconColor: 'blue',
            paremeterJSONValue: Infinity,
            ctype: '',
            ptype: '',
          }

          nodeIDToNodeObjectMap[idCounter] = nestedSequenceObject
          sequenceObject['children'].push(nestedSequenceObject)

          if (
            nonTopLevelNodeNameIdMap[nestedSequenceObject.name] == undefined
          ) {
            nonTopLevelNodeNameIdMap[nestedSequenceObject.name] = []
          }
          nonTopLevelNodeNameIdMap[nestedSequenceObject.name].push(
            nestedSequenceObject.id
          )
        }
      }
      nodeIDToNodeObjectMap[sequenceObject['id']] = sequenceObject

      sequencesObject['children'].push(sequenceObject)
    }
    nodeIDToNodeObjectMap[1] = sequencesObject
    /*     nodeIDToNodeObjectMap[1] = Object.assign(
      nodeIDToNodeObjectMap[1],
      sequencesObject
    ) */
    return { sequencesId: 1, idCounter: idCounter }
  },

  parsePaths(
    pathData: any,
    nodeIDToNodeObjectMap: Object,
    topLevelNodeTypeIds: Object,
    nonTopLevelNodeNameIdMap: Object,
    idCounter: number
  ): Object {
    let pathsObject: NodeObject = {
      id: ++idCounter,
      name: 'Paths',
      type: 'pts',
      globalType: 'rootNode',
      children: [],
      parentNodeId: 0,
      rootNodeId: idCounter,
      referencedByIds: [],
      iconType: '',
      iconColor: '',
      paremeterJSONValue: Infinity,
      ctype: '',
      ptype: '',
    }

    //console.log(pathsObject)
    for (const [key, value] of Object.entries(pathData)) {
      //loop over sequnces - create new Sequence object and add it to children of the seqs
      let pathObject: NodeObject = {
        id: ++idCounter,
        name: key,
        type: 'paths',
        globalType: 'pathNode',
        children: [],
        parentNodeId: pathsObject['id'],
        rootNodeId: idCounter, //for the root nodes, rootNodeId = itself
        referencedByIds: [],
        iconType: 'path',
        iconColor: 'green',
        paremeterJSONValue: Infinity,
        ctype: '',
        ptype: '',
      }

      if (topLevelNodeTypeIds['paths'] == undefined) {
        topLevelNodeTypeIds['paths'] = []
      }
      topLevelNodeTypeIds['paths'].push(pathObject.id)

      //console.log(`${key}`)
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        //loop over path entries

        //console.log(`${key1}`)
        if (Object(value1)[0] === 'modules') {
          //console.log('MODULE')
          let nestedPathObject: NodeObject = {
            id: ++idCounter,
            name: Object(value1)[1],
            type: 'modules',
            globalType: 'nestedModuleNode',
            children: [],
            parentNodeId: pathObject['id'],
            rootNodeId: -1, //for the leaf nodes, rootNodeId will be calculated with references
            referencedByIds: [],
            iconType: 'module',
            iconColor: '',
            paremeterJSONValue: Infinity,
            ctype: '',
            ptype: '',
          }

          nodeIDToNodeObjectMap[idCounter] = nestedPathObject
          pathObject['children'].push(nestedPathObject)

          if (nonTopLevelNodeNameIdMap[nestedPathObject.name] == undefined) {
            nonTopLevelNodeNameIdMap[nestedPathObject.name] = []
          }
          nonTopLevelNodeNameIdMap[nestedPathObject.name].push(
            nestedPathObject.id
          )
        } else if (Object(value1)[0] === 'sequences') {
          //console.log('SEQUENCE')
          let nestedPathObject: NodeObject = {
            id: ++idCounter,
            name: Object(value1)[1],
            type: 'sequences',
            globalType: 'nestedSequenceNode',
            children: [],
            parentNodeId: pathObject['id'],
            rootNodeId: -1, //for the leaf nodes, rootNodeId will be calculated with references
            referencedByIds: [],
            iconType: 'sequence',
            iconColor: 'red',
            paremeterJSONValue: Infinity,
            ctype: '',
            ptype: '',
          }
          nodeIDToNodeObjectMap[idCounter] = nestedPathObject
          pathObject['children'].push(nestedPathObject)

          if (nonTopLevelNodeNameIdMap[nestedPathObject.name] == undefined) {
            nonTopLevelNodeNameIdMap[nestedPathObject.name] = []
          }
          nonTopLevelNodeNameIdMap[nestedPathObject.name].push(
            nestedPathObject.id
          )
        }
      }
      nodeIDToNodeObjectMap[pathObject['id']] = pathObject

      pathsObject['children'].push(pathObject)
    }
    nodeIDToNodeObjectMap[pathsObject['id']] = pathsObject

    return { pathsId: pathsObject.id, idCounter: idCounter }
  },

  buildRecursiveVPSetObject(
    vpSetObject: NodeObject,
    body: any,
    parentID: number,
    nodeIDToNodeObjectMap: Object,
    idCounter: number
  ): number {
    //console.log(JSON.stringify(vpSetObject))
    //console.log(body)
    //console.log('PARENT ID: ' + parentID)
    //if the body has more then 0 keys it is an unnamed nested PSet
    //if (Object.entries(Object(body)).length > 1) {
    //console.log('NESTED UNNAMED PSET')
    //}
    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of Object.entries(Object(body))) {
      //if (vpSetObject['name'] === 'qualityTests') {
      //console.log('LOOPING 1')
      //console.log('key: ' + key)
      //}
      //loop over VPSet entries
      //if (vpSetObject['name'] === 'regressionConfig') {
      //console.log(JSON.stringify(key))
      //console.log(JSON.stringify(value))
      //console.log('key: ' + key)
      //console.log('value: ' + value)
      //}
      let nestedNoNamePSetObject: NodeObject = {} as NodeObject //might or might not be used
      //let nestedNoNamePSetObjectId = 0
      if (Object.entries(Object(body)).length > 1) {
        nestedNoNamePSetObject['id'] = ++idCounter
        nestedNoNamePSetObject['name'] = 'PSet' //no name
        nestedNoNamePSetObject['type'] == 'PSet'
        nestedNoNamePSetObject['globalType'] = 'parameter'
        nestedNoNamePSetObject['children'] = []
        nestedNoNamePSetObject['parentNodeId'] = parentID
        nestedNoNamePSetObject['rootNodeId'] = -1 //TODO if this can be referenced at all?
        nestedNoNamePSetObject['referencedByIds'] = []
        nestedNoNamePSetObject['iconType'] = ''
        nestedNoNamePSetObject['iconColor'] = ''
        nestedNoNamePSetObject['paremeterJSONValue'] = Infinity
      }

      //console.log(JSON.stringify(key), JSON.stringify(value))
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        let nestedVPSetObject: NodeObject = {} as NodeObject
        nestedVPSetObject['id'] = ++idCounter
        nestedVPSetObject['globalType'] = 'parameter'

        //this is parameter loop
        //if (vpSetObject['name'] === 'regressionConfig') {
        //console.log(JSON.stringify(key1), JSON.stringify(value1))
        //}
        for (const [key2, value2] of Object.entries(Object(value1))) {
          //if (vpSetObject['name'] === 'regressionConfig') {
          //console.log(JSON.stringify(key2), JSON.stringify(value2))
          //}
          if (key2 === 'type') nestedVPSetObject['type'] = value2 as string
          else if (key2 === 'value') {
            if (
              nestedVPSetObject['type'] == 'cms.VPSet' ||
              nestedVPSetObject['type'] == 'cms.PSet' ||
              nestedVPSetObject['type'] == 'cms.untracked.PSet' ||
              nestedVPSetObject['type'] == 'cms.untracked.VPSet'
            ) {
              //if (vpSetObject['name'] === 'regressionConfig') {
              //console.log('type PSET')
              //}
              nestedVPSetObject['name'] = key1
              //if (key1 === 'qualityTests') {
              //console.log('AAAAA')
              //console.log('value2: ' + JSON.stringify(value2))
              //}

              /*     if (nestedVPSetObject['type'] == 'cms.VPSet')
                nestedVPSetObject['name'] = 'VPSet'
              else nestedVPSetObject['name'] = 'PSet' */

              nestedVPSetObject['children'] = []
              idCounter = this.buildRecursiveVPSetObject(
                nestedVPSetObject,
                value2,
                nestedVPSetObject['id'],
                nodeIDToNodeObjectMap,
                idCounter
              ) //TODO: is parent ID ok?
            } else {
              nestedVPSetObject['name'] = key1 + ' = '
              nestedVPSetObject['children'] = []

              //if (vpSetObject['name'] === 'regressionConfig') {
              //console.log('type ' + nestedVPSetObject['type'])
              //}
              nestedVPSetObject['paremeterJSONValue'] = value2
            }
          }
          //if (vpSetObject['name'] === 'regressionConfig') {
          //console.log(JSON.stringify(nestedVPSetObject))
          //}
        }
        if (nestedVPSetObject['type'] != undefined) {
          let cmsTypeLenght = nestedVPSetObject['type'].length
          let cmsType = nestedVPSetObject['type'].substring(
            //cmsType is necessary for printing out in tree
            nestedVPSetObject['type'].indexOf('.') + 1,
            cmsTypeLenght
          )
          nestedVPSetObject['cmsType'] = cmsType
        }
        /*    console.log(
          'NESTED MODULE OBJECT: ' + JSON.stringify(nestedModuleObject)
        ) */
        //console.log('NESTED MODULE TYPE ' + nestedModuleObject['type'])

        //if (vpSetObject['name'] === 'regressionConfig') {
        //console.log(nestedVPSetObject)
        //}

        //nestedVPSetObject['parentNodeId'] = 0 //TODO: who's parent?
        nestedVPSetObject['referencedByIds'] = []
        nestedVPSetObject['iconType'] = ''
        nestedVPSetObject['iconColor'] = ''

        nodeIDToNodeObjectMap[nestedVPSetObject['id']] = nestedVPSetObject

        if (Object.entries(Object(body)).length == 1) {
          nestedVPSetObject['rootNodeId'] = -1 //TODO: can this be referenced at all?
          nestedVPSetObject['parentNodeId'] = vpSetObject['id']
          vpSetObject['children'].push(nestedVPSetObject)
        } else {
          nestedVPSetObject['rootNodeId'] = -1 //TODO: can this be referenced at all?
          nestedVPSetObject['parentNodeId'] = nestedNoNamePSetObject['id']
          nestedNoNamePSetObject['children'].push(nestedVPSetObject)
        }
      }

      nodeIDToNodeObjectMap[
        nestedNoNamePSetObject['id']
      ] = nestedNoNamePSetObject

      if (Object.entries(Object(body)).length > 1) {
        vpSetObject['children'].push(nestedNoNamePSetObject)
      }
    }

    return idCounter
  },

  parseModules(
    moduleData: any,
    nodeIDToNodeObjectMap: Object,
    topLevelNodeTypeIds: Object,
    nonTopLevelNodeNameIdMap: Object,
    idCounter: number
  ) {
    //TODO refractor this nesting goes deeper with multiple parameters now
    let modulesObject: NodeObject = {
      id: ++idCounter,
      name: 'Modules',
      type: 'mods',
      globalType: 'rootNode',
      children: [],
      parentNodeId: 0,
      rootNodeId: idCounter,
      referencedByIds: [],
      iconType: '',
      iconColor: '',
      paremeterJSONValue: Infinity,
      ctype: '',
      ptype: '',
    }

    for (const [key, value] of Object.entries(moduleData)) {
      //loop over sequnces - create new Sequence object and add it to children of the seqs
      //console.log('NAME: ' + key)
      let moduleObject: NodeObject = {
        id: ++idCounter,
        name: key,
        type: 'modules',
        globalType: 'moduleNode',
        children: [],
        parentNodeId: modulesObject['id'],
        rootNodeId: idCounter, //for the root nodes, rootNodeId = itself
        referencedByIds: [],
        iconType: 'module',
        iconColor: '',
        paremeterJSONValue: Infinity,
        ctype: '',
        ptype: '',
      }

      if (topLevelNodeTypeIds['modules'] == undefined) {
        topLevelNodeTypeIds['modules'] = []
      }
      topLevelNodeTypeIds['modules'].push(moduleObject.id)

      //console.log(`${key}`)
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        //loop over module entries
        //console.log(`${key1}`)
        if (key1 === 'params') {
          // eslint-disable-next-line no-unused-vars
          for (const [key2, value2] of Object.entries(Object(value1))) {
            //console.log(key2)

            let nestedParameterObject: NodeObject = {} as NodeObject
            nestedParameterObject['id'] = ++idCounter
            nestedParameterObject['children'] = []
            nestedParameterObject['globalType'] = 'parameter'

            for (const [key3, value3] of Object.entries(Object(value2))) {
              if (key3 === 'type')
                nestedParameterObject['type'] = value3 as string
              else if (key3 === 'value') {
                if (
                  nestedParameterObject['type'] == 'cms.VPSet' ||
                  nestedParameterObject['type'] == 'cms.PSet' ||
                  nestedParameterObject['type'] == 'cms.untracked.PSet' ||
                  nestedParameterObject['type'] == 'cms.untracked.VPSet'
                ) {
                  nestedParameterObject['children'] = []
                  nestedParameterObject['name'] = key2

                  idCounter = this.buildRecursiveVPSetObject(
                    nestedParameterObject,
                    value3,
                    moduleObject['id'],
                    nodeIDToNodeObjectMap,
                    idCounter
                  )
                } else {
                  nestedParameterObject['name'] = key2 + ' = '
                  //simple type
                  nestedParameterObject['paremeterJSONValue'] = value3
                }
              }
              //console.log(key3)
            }
            nestedParameterObject['globalType'] = 'parameter'
            if (nestedParameterObject['type'] != undefined) {
              let cmsTypeLenght = nestedParameterObject['type'].length
              let cmsType = nestedParameterObject['type'].substring(
                //cmsType is necessary for printing out in tree
                nestedParameterObject['type'].indexOf('.') + 1,
                cmsTypeLenght
              )
              nestedParameterObject['cmsType'] = cmsType
              //console.log(nestedParameterObject)
            }
            nestedParameterObject['parentNodeId'] = moduleObject['id']
            nestedParameterObject['rootNodeId'] = -1 //TODO: can this be referenced at all?
            nestedParameterObject['referencedByIds'] = []
            nestedParameterObject['iconType'] = ''
            nestedParameterObject['iconColor'] = ''

            nodeIDToNodeObjectMap[
              nestedParameterObject['id']
            ] = nestedParameterObject

            //push parameter into module children
            moduleObject['children'].push(nestedParameterObject)
          }
        } else if (key1 === 'ctype') {
          moduleObject['ctype'] = value1 as string
        } else if (key1 === 'pytype') {
          moduleObject['pytype'] = value1
        }
      }
      modulesObject['children'].push(moduleObject)

      nodeIDToNodeObjectMap[moduleObject['id']] = moduleObject
    }

    nodeIDToNodeObjectMap[modulesObject['id']] = modulesObject

    return { modulesId: modulesObject.id, idCounter: idCounter }
  },

  parsePSets(
    psetData: any,
    nodeIDToNodeObjectMap: Object,
    topLevelNodeTypeIds: Object,
    nonTopLevelNodeNameIdMap: Object,
    idCounter: number
  ) {
    //console.log(psetData)
    let psetsObject: NodeObject = {
      id: ++idCounter,
      name: 'PSets',
      type: 'psets',
      globalType: 'rootNode',
      children: [],
      parentNodeId: 0,
      rootNodeId: idCounter,
      referencedByIds: [],
      iconType: '',
      iconColor: '',
      paremeterJSONValue: Infinity,
      ctype: '',
      ptype: '',
    }

    //let psetsIdCounter = this.idCounter

    for (const [key, value] of Object.entries(psetData)) {
      //loop over sequnces - create new Sequence object and add it to children of the seqs
      //console.log('NAME: ' + key)
      let psetObject: NodeObject = {
        id: ++idCounter,
        name: key,
        type: 'pset',
        globalType: 'psetNode',
        children: [],
        parentNodeId: psetsObject['id'],
        rootNodeId: idCounter,
        referencedByIds: [],
        iconType: 'pset',
        iconColor: 'orange',
        paremeterJSONValue: Infinity,
        ctype: '',
        ptype: '',
      }

      if (topLevelNodeTypeIds['psets'] == undefined)
        topLevelNodeTypeIds['psets'] = []
      topLevelNodeTypeIds['psets'].push(psetObject.id)
      //let psetIdCounter = this.idCounter

      //console.log(`${key}`)
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        //loop over pset entries
        //if (key == 'HLTPSetPixelLessStepTrajectoryFilter') {
        //console.log(`${key1}, ${value1}`)
        //}
        let nestedPSetObject: NodeObject = {} as NodeObject
        nestedPSetObject['id'] = ++idCounter
        //console.log(`${key1}, ${value1}`)
        //if (key1 === 'para_name') {
        // eslint-disable-next-line no-unused-vars
        for (const [key2, value2] of Object.entries(Object(value1))) {
          //aviod para_name level
          //console.log('ANYTHING')
          //console.log(`${key2}, ${value2}`)
          if (key2 === 'type') nestedPSetObject['type'] = value2 as string
          else if (key2 === 'value') {
            if (
              nestedPSetObject['type'] == 'cms.VPSet' ||
              nestedPSetObject['type'] == 'cms.PSet' ||
              nestedPSetObject['type'] == 'cms.untracked.PSet' ||
              nestedPSetObject['type'] == 'cms.untracked.VPSet'
            ) {
              nestedPSetObject['name'] = key1
              nestedPSetObject['globalType'] = 'parameter'
              nestedPSetObject['children'] = []

              idCounter = this.buildRecursiveVPSetObject(
                nestedPSetObject,
                value2,
                psetObject['id'],
                nodeIDToNodeObjectMap,
                idCounter
              )
            } else {
              nestedPSetObject['paremeterJSONValue'] = value2
              nestedPSetObject['children'] = []
              nestedPSetObject['name'] = key1 + ' = '
            }
          }
          //console.log(key3)
        }
        //}
        nestedPSetObject['globalType'] = 'parameter'
        /*    console.log(
          'NESTED MODULE OBJECT: ' + JSON.stringify(nestedModuleObject)
        ) */
        //console.log('NESTED MODULE TYPE ' + nestedModuleObject['type'])
        if (nestedPSetObject['type'] != undefined) {
          let cmsTypeLenght = nestedPSetObject['type'].length
          let cmsType = nestedPSetObject['type'].substring(
            //cmsType is necessary for printing out in tree
            nestedPSetObject['type'].indexOf('.') + 1,
            cmsTypeLenght
          )
          nestedPSetObject['cmsType'] = cmsType
          nestedPSetObject['parentNodeId'] = psetObject['id'] //TODO: who's parent?
          nestedPSetObject['referencedByIds'] = []
          nestedPSetObject['iconType'] = ''
          nestedPSetObject['iconColor'] = ''

          nodeIDToNodeObjectMap[nestedPSetObject['id']] = nestedPSetObject
          psetObject['children'].push(nestedPSetObject)
        }
      }
      psetsObject['children'].push(psetObject)

      nodeIDToNodeObjectMap[psetObject['id']] = psetObject
    }
    nodeIDToNodeObjectMap[psetsObject['id']] = psetsObject

    return { psetsId: psetsObject.id, idCounter: idCounter }
  },

  parseTasks(
    taskData: any,
    nodeIDToNodeObjectMap: Object,
    topLevelNodeTypeIds: Object,
    nonTopLevelNodeNameIdMap: Object,
    idCounter: number
  ) {
    let tasksObject: NodeObject = {
      id: ++idCounter,
      name: 'Tasks',
      type: 'tsks',
      globalType: 'rootNode',
      children: [],
      parentNodeId: 0,
      rootNodeId: idCounter,
      referencedByIds: [],
      iconType: '',
      iconColor: '',
      paremeterJSONValue: Infinity,
      ctype: '',
      ptype: '',
    }
    //console.log(tasksObject)
    for (const [key, value] of Object.entries(taskData)) {
      //loop over tasks - create new Task object and add it to children of the tasks
      let taskObject: NodeObject = {
        id: ++idCounter,
        name: key,
        type: 'tasks',
        globalType: 'taskNode',
        children: [],
        parentNodeId: tasksObject['id'],
        rootNodeId: idCounter, //for the root nodes, rootNodeId = itself
        referencedByIds: [],
        iconType: 'task',
        iconColor: 'blue',
        paremeterJSONValue: Infinity,
        ctype: '',
        ptype: '',
      }

      if (topLevelNodeTypeIds['tasks'] == undefined)
        topLevelNodeTypeIds['tasks'] = []
      topLevelNodeTypeIds['tasks'].push(taskObject.id)

      //let sequenceObjectId = this.idCounter //remember counter to use it after children are populated

      //console.log(`${key}`)
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        //loop over task entries

        //console.log(`${key1}`)
        if (Object(value1)[0] === 'modules') {
          //console.log('MODULE')
          let nestedTaskObject: NodeObject = {
            id: ++idCounter,
            name: Object(value1)[1],
            type: 'modules',
            globalType: 'nestedModuleNode',
            children: [],
            parentNodeId: taskObject['id'],
            rootNodeId: -1, //for the leaf nodes, rootNodeId will be calculated with references
            referencedByIds: [],
            iconType: 'module',
            iconColor: '',
            paremeterJSONValue: Infinity,
            ctype: '',
            ptype: '',
          }
          nodeIDToNodeObjectMap[idCounter] = nestedTaskObject
          taskObject['children'].push(nestedTaskObject)

          if (nonTopLevelNodeNameIdMap[nestedTaskObject.name] == undefined) {
            nonTopLevelNodeNameIdMap[nestedTaskObject.name] = []
          }
          nonTopLevelNodeNameIdMap[nestedTaskObject.name].push(
            nestedTaskObject.id
          )
        } else if (Object(value1)[0] === 'tasks') {
          //console.log('SEQUENCE')
          let nestedTaskObject: NodeObject = {
            id: ++idCounter,
            name: Object(value1)[1],
            type: 'tasks',
            globalType: 'nestedTaskNode',
            children: [],
            parentNodeId: taskObject['id'],
            rootNodeId: -1, //for the leaf nodes, rootNodeId will be calculated with references
            referencedByIds: [],
            iconType: 'task',
            iconColor: 'blue',
            paremeterJSONValue: Infinity,
            ctype: '',
            ptype: '',
          }

          nodeIDToNodeObjectMap[idCounter] = nestedTaskObject
          taskObject['children'].push(nestedTaskObject)

          if (nonTopLevelNodeNameIdMap[nestedTaskObject.name] == undefined) {
            nonTopLevelNodeNameIdMap[nestedTaskObject.name] = []
          }
          nonTopLevelNodeNameIdMap[nestedTaskObject.name].push(
            nestedTaskObject.id
          )
        }
      }
      nodeIDToNodeObjectMap[taskObject['id']] = taskObject

      tasksObject['children'].push(taskObject)
    }
    nodeIDToNodeObjectMap[tasksObject['id']] = tasksObject

    return { tasksId: tasksObject.id, idCounter: idCounter }
  },

  parseESProducers(
    esProducerData: any,
    nodeIDToNodeObjectMap: Object,
    topLevelNodeTypeIds: Object,
    nonTopLevelNodeNameIdMap: Object,
    idCounter: number
  ) {
    //TODO refractor this nesting goes deeper with multiple parameters now
    let esProducersObject: NodeObject = {
      id: ++idCounter,
      name: 'ESProducers',
      type: 'esprods',
      globalType: 'rootNode',
      children: [],
      parentNodeId: 0,
      rootNodeId: idCounter,
      referencedByIds: [],
      iconType: '',
      iconColor: '',
      paremeterJSONValue: Infinity,
      ctype: '',
      ptype: '',
    }

    for (const [key, value] of Object.entries(esProducerData)) {
      //loop over sequnces - create new Sequence object and add it to children of the seqs
      //console.log('NAME: ' + key)
      let esProducerObject: NodeObject = {
        id: ++idCounter,
        name: key,
        type: 'esproducers',
        globalType: 'esproducerNode',
        children: [],
        parentNodeId: esProducersObject['id'],
        rootNodeId: idCounter, //for the root nodes, rootNodeId = itself
        referencedByIds: [],
        iconType: 'esproducer',
        iconColor: '#E91E63',
        paremeterJSONValue: Infinity,
        ctype: '',
        ptype: '',
      }

      if (topLevelNodeTypeIds['esproducers'] == undefined)
        topLevelNodeTypeIds['esproducers'] = []
      topLevelNodeTypeIds['esproducers'].push(esProducerObject.id)

      //console.log(`${key}`)
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        //loop over module entries
        //console.log(`${key1}`)
        if (key1 === 'params') {
          // eslint-disable-next-line no-unused-vars
          for (const [key2, value2] of Object.entries(Object(value1))) {
            //console.log(key2)

            let nestedParameterObject: NodeObject = {} as NodeObject
            nestedParameterObject['id'] = ++idCounter
            nestedParameterObject['children'] = []
            nestedParameterObject['globalType'] = 'parameter'

            for (const [key3, value3] of Object.entries(Object(value2))) {
              if (key3 === 'type')
                nestedParameterObject['type'] = value3 as string
              else if (key3 === 'value') {
                if (
                  nestedParameterObject['type'] == 'cms.VPSet' ||
                  nestedParameterObject['type'] == 'cms.PSet' ||
                  nestedParameterObject['type'] == 'cms.untracked.PSet' ||
                  nestedParameterObject['type'] == 'cms.untracked.VPSet'
                ) {
                  nestedParameterObject['children'] = []
                  nestedParameterObject['name'] = key2

                  idCounter = this.buildRecursiveVPSetObject(
                    nestedParameterObject,
                    value3,
                    esProducerObject['id'],
                    nodeIDToNodeObjectMap,
                    idCounter
                  )
                } else {
                  nestedParameterObject['name'] = key2 + ' = '
                  //simple type
                  nestedParameterObject['paremeterJSONValue'] = value3
                }
              }
              //console.log(key3)
            }
            nestedParameterObject['globalType'] = 'parameter'
            if (nestedParameterObject['type'] != undefined) {
              let cmsTypeLenght = nestedParameterObject['type'].length
              let cmsType = nestedParameterObject['type'].substring(
                //cmsType is necessary for printing out in tree
                nestedParameterObject['type'].indexOf('.') + 1,
                cmsTypeLenght
              )
              nestedParameterObject['cmsType'] = cmsType
              //console.log(nestedParameterObject)
            }
            nestedParameterObject['parentNodeId'] = esProducerObject['id']
            nestedParameterObject['rootNodeId'] = -1 //TODO: can this be referenced at all?
            nestedParameterObject['referencedByIds'] = []
            nestedParameterObject['iconType'] = ''
            nestedParameterObject['iconColor'] = ''

            nodeIDToNodeObjectMap[
              nestedParameterObject['id']
            ] = nestedParameterObject

            //push parameter into module children
            esProducerObject['children'].push(nestedParameterObject)
          }
        } else if (key1 === 'ctype') {
          esProducerObject['ctype'] = value1 as string
        } else if (key1 === 'pytype') {
          esProducerObject['pytype'] = value1
        }
      }
      esProducersObject['children'].push(esProducerObject)

      nodeIDToNodeObjectMap[esProducerObject['id']] = esProducerObject
    }

    nodeIDToNodeObjectMap[esProducersObject['id']] = esProducersObject

    return { esProducersId: esProducersObject.id, idCounter: idCounter }
  },

  parseESSources(
    esSourceData: any,
    nodeIDToNodeObjectMap: Object,
    topLevelNodeTypeIds: Object,
    nonTopLevelNodeNameIdMap: Object,
    idCounter: number
  ) {
    //TODO refractor this nesting goes deeper with multiple parameters now
    let esSourcesObject: NodeObject = {
      id: ++idCounter,
      name: 'ESSources',
      type: 'essour',
      globalType: 'rootNode',
      children: [],
      parentNodeId: 0,
      rootNodeId: idCounter,
      referencedByIds: [],
      iconType: '',
      iconColor: '',
      paremeterJSONValue: Infinity,
      ctype: '',
      ptype: '',
    }

    for (const [key, value] of Object.entries(esSourceData)) {
      //loop over sequnces - create new Sequence object and add it to children of the seqs
      //console.log('NAME: ' + key)
      let esSourceObject: NodeObject = {
        id: ++idCounter,
        name: key,
        type: 'essources',
        globalType: 'essourceNode',
        children: [],
        parentNodeId: esSourcesObject['id'],
        rootNodeId: idCounter, //for the root nodes, rootNodeId = itself
        referencedByIds: [],
        iconType: 'essource',
        iconColor: '#1DE9B6',
        paremeterJSONValue: Infinity,
        ctype: '',
        ptype: '',
      }

      if (topLevelNodeTypeIds['essources'] == undefined)
        topLevelNodeTypeIds['essources'] = []
      topLevelNodeTypeIds['essources'].push(esSourceObject.id)

      //console.log(`${key}`)
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        //loop over module entries
        //console.log(`${key1}`)
        if (key1 === 'params') {
          // eslint-disable-next-line no-unused-vars
          for (const [key2, value2] of Object.entries(Object(value1))) {
            //console.log(key2)

            let nestedParameterObject: NodeObject = {} as NodeObject
            nestedParameterObject['id'] = ++idCounter
            nestedParameterObject['children'] = []
            nestedParameterObject['globalType'] = 'parameter'

            for (const [key3, value3] of Object.entries(Object(value2))) {
              if (key3 === 'type')
                nestedParameterObject['type'] = value3 as string
              else if (key3 === 'value') {
                if (
                  nestedParameterObject['type'] == 'cms.VPSet' ||
                  nestedParameterObject['type'] == 'cms.PSet' ||
                  nestedParameterObject['type'] == 'cms.untracked.PSet' ||
                  nestedParameterObject['type'] == 'cms.untracked.VPSet'
                ) {
                  nestedParameterObject['children'] = []
                  nestedParameterObject['name'] = key2

                  idCounter = this.buildRecursiveVPSetObject(
                    nestedParameterObject,
                    value3,
                    esSourceObject['id'],
                    nodeIDToNodeObjectMap,
                    idCounter
                  )
                } else {
                  nestedParameterObject['name'] = key2 + ' = '
                  //simple type
                  nestedParameterObject['paremeterJSONValue'] = value3
                }
              }
              //console.log(key3)
            }
            nestedParameterObject['globalType'] = 'parameter'
            if (nestedParameterObject['type'] != undefined) {
              let cmsTypeLenght = nestedParameterObject['type'].length
              let cmsType = nestedParameterObject['type'].substring(
                //cmsType is necessary for printing out in tree
                nestedParameterObject['type'].indexOf('.') + 1,
                cmsTypeLenght
              )
              nestedParameterObject['cmsType'] = cmsType
              //console.log(nestedParameterObject)
            }
            nestedParameterObject['parentNodeId'] = esSourceObject['id']
            nestedParameterObject['rootNodeId'] = -1 //TODO: can this be referenced at all?
            nestedParameterObject['referencedByIds'] = []
            nestedParameterObject['iconType'] = ''
            nestedParameterObject['iconColor'] = ''

            nodeIDToNodeObjectMap[
              nestedParameterObject['id']
            ] = nestedParameterObject

            //push parameter into module children
            esSourceObject['children'].push(nestedParameterObject)
          }
        } else if (key1 === 'ctype') {
          esSourceObject['ctype'] = value1 as string
        } else if (key1 === 'pytype') {
          esSourceObject['pytype'] = value1
        }
      }
      esSourcesObject['children'].push(esSourceObject)

      nodeIDToNodeObjectMap[esSourceObject['id']] = esSourceObject
    }

    nodeIDToNodeObjectMap[esSourcesObject['id']] = esSourcesObject

    return { esSourcesId: esSourcesObject.id, idCounter: idCounter }
  },

  parseServices(
    serviceData: any,
    nodeIDToNodeObjectMap: Object,
    topLevelNodeTypeIds: Object,
    nonTopLevelNodeNameIdMap: Object,
    idCounter: number
  ) {
    //TODO refractor this nesting goes deeper with multiple parameters now
    let servicesObject: NodeObject = {
      id: ++idCounter,
      name: 'Services',
      type: 'serv', //TODO: fix JSON -> node type naming conventions
      globalType: 'rootNode',
      children: [],
      parentNodeId: 0,
      rootNodeId: idCounter,
      referencedByIds: [],
      iconType: '',
      iconColor: '',
      paremeterJSONValue: Infinity,
      ctype: '',
      ptype: '',
    }

    for (const [key, value] of Object.entries(serviceData)) {
      //loop over sequnces - create new Sequence object and add it to children of the seqs
      //console.log('NAME: ' + key)
      let serviceObject: NodeObject = {
        id: ++idCounter,
        name: key,
        type: 'services',
        globalType: 'serviceNode',
        children: [],
        parentNodeId: servicesObject['id'],
        rootNodeId: idCounter, //for the root nodes, rootNodeId = itself
        referencedByIds: [],
        iconType: 'service',
        iconColor: '#D84315',
        paremeterJSONValue: Infinity,
        ctype: '',
        ptype: '',
      }

      if (topLevelNodeTypeIds['services'] == undefined)
        topLevelNodeTypeIds['services'] = []
      topLevelNodeTypeIds['services'].push(serviceObject.id)

      //console.log(`${key}`)
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        //loop over module entries
        //console.log(`${key1}`)
        if (key1 === 'params') {
          // eslint-disable-next-line no-unused-vars
          for (const [key2, value2] of Object.entries(Object(value1))) {
            //console.log(key2)

            let nestedParameterObject: NodeObject = {} as NodeObject
            nestedParameterObject['id'] = ++idCounter
            nestedParameterObject['children'] = []
            nestedParameterObject['globalType'] = 'parameter'

            for (const [key3, value3] of Object.entries(Object(value2))) {
              if (key3 === 'type')
                nestedParameterObject['type'] = value3 as string
              else if (key3 === 'value') {
                if (
                  nestedParameterObject['type'] == 'cms.VPSet' ||
                  nestedParameterObject['type'] == 'cms.PSet' ||
                  nestedParameterObject['type'] == 'cms.untracked.PSet' ||
                  nestedParameterObject['type'] == 'cms.untracked.VPSet'
                ) {
                  nestedParameterObject['children'] = []
                  nestedParameterObject['name'] = key2

                  idCounter = this.buildRecursiveVPSetObject(
                    nestedParameterObject,
                    value3,
                    serviceObject['id'],
                    nodeIDToNodeObjectMap,
                    idCounter
                  )
                } else {
                  nestedParameterObject['name'] = key2 + ' = '
                  //simple type
                  nestedParameterObject['paremeterJSONValue'] = value3
                }
              }
              //console.log(key3)
            }
            nestedParameterObject['globalType'] = 'parameter'
            if (nestedParameterObject['type'] != undefined) {
              let cmsTypeLenght = nestedParameterObject['type'].length
              let cmsType = nestedParameterObject['type'].substring(
                //cmsType is necessary for printing out in tree
                nestedParameterObject['type'].indexOf('.') + 1,
                cmsTypeLenght
              )
              nestedParameterObject['cmsType'] = cmsType
              //console.log(nestedParameterObject)
            }
            nestedParameterObject['parentNodeId'] = serviceObject['id']
            nestedParameterObject['rootNodeId'] = -1 //TODO: can this be referenced at all?
            nestedParameterObject['referencedByIds'] = []
            nestedParameterObject['iconType'] = ''
            nestedParameterObject['iconColor'] = ''

            nodeIDToNodeObjectMap[
              nestedParameterObject['id']
            ] = nestedParameterObject

            //push parameter into module children
            serviceObject['children'].push(nestedParameterObject)
          }
        } else if (key1 === 'ctype') {
          serviceObject['ctype'] = value1 as string
        } else if (key1 === 'pytype') {
          serviceObject['pytype'] = value1
        }
      }
      servicesObject['children'].push(serviceObject)

      nodeIDToNodeObjectMap[serviceObject['id']] = serviceObject
    }

    nodeIDToNodeObjectMap[servicesObject['id']] = servicesObject

    return { servicesId: servicesObject.id, idCounter: idCounter }
  },
}
