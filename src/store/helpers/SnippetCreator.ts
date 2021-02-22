import { MainVuexState, NodeObject } from '../../types'

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

        if (vpSetChildObject.type != 'cms.VPSet')
          vPSetParameterText += vpSetChildObject.name
        else vPSetParameterText += vpSetChildObject.name + ' = '

        vPSetParameterText += vpSetChildObject.type + '( '
        if (
          vpSetChildObject.type != 'cms.PSet' &&
          vpSetChildObject.type != 'cms.VPSet'
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
    /*   console.log('PTYPE: ' + pytype)
    console.log('CTYPE: ' + ctype) */
    moduleSnippet += 'cms.' + pytype + '( '
    cType = '"' + ctype + '",</br>'
    for (const [key, childObject] of Object.entries(moduleChildren)) {
      //console.log('KEY: ' + key)
      //console.log('VALUE: ' + JSON.stringify(childObject)) //TODO: parse object
      //for (const [key1, value1] of Object.entries(value)) {
      //console.log('KEY1: ' + key1)
      //console.log('VALUE1: ' + JSON.stringify(value1)) //TODO: parse object
      if (childObject.type == 'cms.PSet' || childObject.type == 'cms.VPSet') {
        innerParameterText += '&emsp;' + childObject.name + ' = ' //parameter name
      } else {
        innerParameterText += '&emsp;' + childObject.name
      }

      //for (const [key2, value2] of Object.entries(value1)) {
      //if (key2 == 'type') {
      innerParameterText += childObject.type + '( '
      //} else if (key2 == 'value') {
      if (childObject.type != 'cms.PSet' && childObject.type != 'cms.VPSet') {
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
      //}
      // }
      //}
    }
    moduleSnippet = moduleSnippet + cType + innerParameterText
    moduleSnippet += ' )'

    return moduleSnippet
  },
  getPathSnippet(pathName, pathChildren) {
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
  getSequenceSnippet(sequenceName, sequenceChildren) {
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
  getPSetSnippet(psetName, psetParams) {
    //console.log(psetName)
    //console.log(JSON.stringify(psetParams))
    //console.log('getPSetSnippet CALLED!')
    let psetSnippet = psetName + ' = '
    let innerParameterText = ''
    let cmsType = ''
    let cType = 'cms.PSet(</br>'

    /*     for (const [key, value] of Object.entries(psetParams)) {
      if (key == 'pytype') {
        psetSnippet += 'cms.' + value + '( '
      } else if (key == 'params') { */
    for (const [key1, value1] of Object.entries(psetParams)) {
      innerParameterText += '&emsp;' + key1 + ' = ' //parameter name

      /*  for (const [key2, value2] of Object.entries(value1)) {
        if (key2 == 'type') {
          cmsType = value2 //remember cms type for sets
          innerParameterText += value2 + '( '
        } else if (key2 == 'value') {
          if (cmsType != 'cms.PSet' && cmsType != 'cms.VPSet') {
            if (cmsType == 'cms.string' || cmsType == 'cms.InputTag')
              innerParameterText += '"' + value2 + '" )</br>'
            else innerParameterText += value2 + ' )</br>'
          } else {
            //complicated set type needs deconstructing
            innerParameterText += this.buildRecursiveVPSetParameter(value2, 2)
          }
        }
      } */
      /*         }
      } else if (key == 'ctype') cType = '"' + value + '",</br>' */
    }
    psetSnippet = psetSnippet + cType + innerParameterText
    psetSnippet += ' )'

    return psetSnippet
  },
}
