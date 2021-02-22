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
          if (
            vpSetChildObject.type == 'cms.string' ||
            vpSetChildObject.type == 'cms.InputTag'
          )
            vPSetParameterText +=
              '"' + vpSetChildObject.paremeterJSONValue + '" )</br>'
          else
            vPSetParameterText +=
              vpSetChildObject.paremeterJSONValue + ' )</br>'
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
        if (
          childObject.type == 'cms.string' ||
          childObject.type == 'cms.InputTag'
        )
          innerParameterText +=
            '"' + childObject.paremeterJSONValue + '" )</br>'
        else innerParameterText += childObject.paremeterJSONValue + ' )</br>'
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
    //console.log(sequence)
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
        if (
          childObject.type == 'cms.string' ||
          childObject.type == 'cms.InputTag'
        )
          innerParameterText +=
            '"' + childObject.paremeterJSONValue + '" )</br>'
        else innerParameterText += childObject.paremeterJSONValue + ' )</br>'
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
