import { NodeObject } from '../../types'

/* eslint-disable no-unused-vars */
export default {
  buildRecursiveVPSetParameter(
    vpSetChildren: Array<NodeObject>,
    level: number
  ) {
    let vPSetParameterText = ''
    let tab = '&emsp;'

    if (JSON.stringify(vpSetChildren) != '[{}]') {
      vPSetParameterText += '</br>'
    }

    for (const [key, vpSetChildObject] of Object.entries(vpSetChildren)) {
      /*   console.log('vpSetChildObject KEY: ' + key)
      console.log('vpSetChildObject VALUE: ' + JSON.stringify(vpSetChildObject))
      console.log('vpSetChildObject NAME: ' + vpSetChildObject.name) */
      if (vpSetChildObject.name == 'PSet') {
        //if (paramCounter == 0) {
        vPSetParameterText += tab.repeat(level) + 'cms.PSet(' //nested no named PSet
        level++
        vPSetParameterText += tab.repeat(level)

        vPSetParameterText += this.buildRecursiveVPSetParameter(
          vpSetChildObject.children,
          level
        )
        level--
      } else {
        vPSetParameterText += tab.repeat(level)

        if (
          vpSetChildObject.type != 'cms.VPSet' &&
          vpSetChildObject.type != 'cms.VPSet' &&
          vpSetChildObject.type != 'cms.untracked.PSet' &&
          vpSetChildObject.type != 'cms.untracked.VPSet'
        )
          vPSetParameterText += vpSetChildObject.name
        else vPSetParameterText += vpSetChildObject.name + ' = '

        vPSetParameterText += vpSetChildObject.type + '( '
        if (
          vpSetChildObject.type != 'cms.PSet' &&
          vpSetChildObject.type != 'cms.VPSet' &&
          vpSetChildObject.type != 'cms.untracked.PSet' &&
          vpSetChildObject.type != 'cms.untracked.VPSet'
        ) {
          vPSetParameterText +=
            JSON.stringify(vpSetChildObject.paremeterJSONValue, null, ' ') +
            ' )</br>'
        } else {
          //complicated set type needs deconstructing
          vPSetParameterText += this.buildRecursiveVPSetParameter(
            vpSetChildObject.children,
            level + 1
          )
        }
      }
    }

    vPSetParameterText += tab.repeat(level - 1) + ')' + '</br>'
    return vPSetParameterText
  },
  getModuleSnippet(
    moduleName: string,
    ctype: string,
    pytype: string,
    moduleChildren: Array<NodeObject>
  ) {
    let moduleSnippet = moduleName + ' = '
    let innerParameterText = ''
    let cType = ''

    moduleSnippet += 'cms.' + pytype + '( '
    cType = '"' + ctype + '",</br>'
    for (const [key, childObject] of Object.entries(moduleChildren)) {
      if (
        childObject.type == 'cms.PSet' ||
        childObject.type == 'cms.VPSet' ||
        childObject.type == 'cms.untracked.PSet' ||
        childObject.type == 'cms.untracked.VPSet'
      ) {
        innerParameterText += '&emsp;' + childObject.name + ' = ' //parameter name
      } else {
        innerParameterText += '&emsp;' + childObject.name
      }

      innerParameterText += childObject.type + '( '
      if (
        childObject.type != 'cms.PSet' &&
        childObject.type != 'cms.VPSet' &&
        childObject.type != 'cms.untracked.PSet' &&
        childObject.type != 'cms.untracked.VPSet'
      ) {
        innerParameterText +=
          JSON.stringify(childObject.paremeterJSONValue, null, ' ') + ' )</br>'
      } else {
        //complicated set type needs deconstructing
        innerParameterText += this.buildRecursiveVPSetParameter(
          childObject.children,
          2
        )
      }
    }
    moduleSnippet = moduleSnippet + cType + innerParameterText
    moduleSnippet += ' )'

    return moduleSnippet
  },
  getESProducerSnippet(
    esProducerName: string,
    ctype: string,
    pytype: string,
    esProducerChildren: Array<NodeObject>
  ) {
    let esProducerSnippet = esProducerName + ' = '
    let innerParameterText = ''
    let cType = ''

    esProducerSnippet += 'cms.' + pytype + '( '
    cType = '"' + ctype + '",</br>'
    for (const [key, childObject] of Object.entries(esProducerChildren)) {
      if (
        childObject.type == 'cms.PSet' ||
        childObject.type == 'cms.VPSet' ||
        childObject.type == 'cms.untracked.PSet' ||
        childObject.type == 'cms.untracked.VPSet'
      ) {
        innerParameterText += '&emsp;' + childObject.name + ' = ' //parameter name
      } else {
        innerParameterText += '&emsp;' + childObject.name
      }

      innerParameterText += childObject.type + '( '
      if (
        childObject.type != 'cms.PSet' &&
        childObject.type != 'cms.VPSet' &&
        childObject.type != 'cms.untracked.PSet' &&
        childObject.type != 'cms.untracked.VPSet'
      ) {
        innerParameterText +=
          JSON.stringify(childObject.paremeterJSONValue, null, ' ') + ' )</br>'
      } else {
        //complicated set type needs deconstructing
        innerParameterText += this.buildRecursiveVPSetParameter(
          childObject.children,
          2
        )
      }
    }
    esProducerSnippet = esProducerSnippet + cType + innerParameterText
    esProducerSnippet += ' )'

    return esProducerSnippet
  },
  getESSourceSnippet(
    esSourceName: string,
    ctype: string,
    pytype: string,
    esSourceChildren: Array<NodeObject>
  ) {
    let esSourceSnippet = esSourceName + ' = '
    let innerParameterText = ''
    let cType = ''

    esSourceSnippet += 'cms.' + pytype + '( '
    cType = '"' + ctype + '",</br>'
    for (const [key, childObject] of Object.entries(esSourceChildren)) {
      if (
        childObject.type == 'cms.PSet' ||
        childObject.type == 'cms.VPSet' ||
        childObject.type == 'cms.untracked.PSet' ||
        childObject.type == 'cms.untracked.VPSet'
      ) {
        innerParameterText += '&emsp;' + childObject.name + ' = ' //parameter name
      } else {
        innerParameterText += '&emsp;' + childObject.name
      }

      innerParameterText += childObject.type + '( '
      if (
        childObject.type != 'cms.PSet' &&
        childObject.type != 'cms.VPSet' &&
        childObject.type != 'cms.untracked.PSet' &&
        childObject.type != 'cms.untracked.VPSet'
      ) {
        innerParameterText +=
          JSON.stringify(childObject.paremeterJSONValue, null, ' ') + ' )</br>'
      } else {
        //complicated set type needs deconstructing
        innerParameterText += this.buildRecursiveVPSetParameter(
          childObject.children,
          2
        )
      }
    }
    esSourceSnippet = esSourceSnippet + cType + innerParameterText
    esSourceSnippet += ' )'

    return esSourceSnippet
  },
  getServiceSnippet(
    serviceName: string,
    ctype: string,
    pytype: string,
    serviceChildren: Array<NodeObject>
  ) {
    let servicceSnippet = serviceName + ' = '
    let innerParameterText = ''
    let cType = ''

    servicceSnippet += 'cms.' + pytype + '( '
    cType = '"' + ctype + '",</br>'
    for (const [key, childObject] of Object.entries(serviceChildren)) {
      if (
        childObject.type == 'cms.PSet' ||
        childObject.type == 'cms.VPSet' ||
        childObject.type == 'cms.untracked.PSet' ||
        childObject.type == 'cms.untracked.VPSet'
      ) {
        innerParameterText += '&emsp;' + childObject.name + ' = ' //parameter name
      } else {
        innerParameterText += '&emsp;' + childObject.name
      }

      innerParameterText += childObject.type + '( '
      if (
        childObject.type != 'cms.PSet' &&
        childObject.type != 'cms.VPSet' &&
        childObject.type != 'cms.untracked.PSet' &&
        childObject.type != 'cms.untracked.VPSet'
      ) {
        innerParameterText +=
          JSON.stringify(childObject.paremeterJSONValue, null, ' ') + ' )</br>'
      } else {
        //complicated set type needs deconstructing
        innerParameterText += this.buildRecursiveVPSetParameter(
          childObject.children,
          2
        )
      }
    }
    servicceSnippet = servicceSnippet + cType + innerParameterText
    servicceSnippet += ' )'

    return servicceSnippet
  },
  getPathSnippet(pathName: string, pathChildren: Array<NodeObject>) {
    //console.log(path)
    //console.log(pathChildren)
    //console.log('getPathSnippet CALLED!')
    let pathSnippet = pathName + ' = cms.Path('
    pathChildren.forEach((val, key, pathChildren) => {
      if (Object.is(pathChildren.length - 1, key)) {
        pathSnippet += ' ' + val.name + ' )'
      } else {
        pathSnippet += ' ' + val.name + ' + '
      }
    })
    //console.log(pathSnippet)
    return pathSnippet
    //return JSON.stringify(pathChildren)
  },
  getSequenceSnippet(
    sequenceName: string,
    sequenceChildren: Array<NodeObject>
  ) {
    //console.log(sequenceChildren)
    //console.log('getSequenceSnippet CALLED!')
    let sequenceSnippet = sequenceName + ' = cms.Sequence('
    if (sequenceChildren.length == 0) sequenceSnippet += ')'
    else
      sequenceChildren.forEach((val, key, sequenceChildren) => {
        /*   console.log('VAL: ' + JSON.stringify(val))
        console.log('KEY: ' + key) */
        if (Object.is(sequenceChildren.length - 1, key)) {
          sequenceSnippet += ' ' + val.name + ' )'
        } else {
          sequenceSnippet += ' ' + val.name + ' + '
        }
      })
    return sequenceSnippet
    //return JSON.stringify(sequenceChildren)
  },
  getTaskSnippet(taskName: string, taskChildren: Array<NodeObject>) {
    //console.log(taskChildren)
    //console.log('getTaskSnippet CALLED!')
    let taskSnippet = taskName + ' = cms.Task('
    if (taskChildren.length == 0) taskSnippet += ')'
    else
      taskChildren.forEach((val, key, taskChildren) => {
        /*   console.log('VAL: ' + JSON.stringify(val))
        console.log('KEY: ' + key) */
        if (Object.is(taskChildren.length - 1, key)) {
          taskSnippet += ' ' + val.name + ' )'
        } else {
          taskSnippet += ' ' + val.name + ' + '
        }
      })
    return taskSnippet
    //return JSON.stringify(taskChildren)
  },
  getPSetSnippet(psetName: string, psetChildren: Array<NodeObject>) {
    let psetSnippet = psetName + ' = '
    let innerParameterText = ''
    let cType = 'cms.PSet(</br>'

    for (const [key, childObject] of Object.entries(psetChildren)) {
      /*     console.log('KEY1: ' + key)
      console.log('VALUE1: ' + childObject) */
      //innerParameterText += '&emsp;' + key + ' = ' //parameter name

      if (
        childObject.type == 'cms.PSet' ||
        childObject.type == 'cms.VPSet' ||
        childObject.type == 'cms.untracked.PSet' ||
        childObject.type == 'cms.untracked.VPSet'
      ) {
        innerParameterText += '&emsp;' + childObject.name + ' = ' //parameter name
      } else {
        innerParameterText += '&emsp;' + childObject.name
      }

      innerParameterText += childObject.type + '( '
      if (
        childObject.type != 'cms.PSet' &&
        childObject.type != 'cms.VPSet' &&
        childObject.type != 'cms.untracked.PSet' &&
        childObject.type != 'cms.untracked.VPSet'
      ) {
        innerParameterText +=
          JSON.stringify(childObject.paremeterJSONValue, null, ' ') + ' )</br>'
      } else {
        //complicated set type needs deconstructing
        innerParameterText += this.buildRecursiveVPSetParameter(
          childObject.children,
          2
        )
      }
    }
    psetSnippet = psetSnippet + cType + innerParameterText
    psetSnippet += ' )'

    return psetSnippet
  },
}
