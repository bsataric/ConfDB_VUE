/* eslint-disable no-unused-vars */
export default {
  buildRecursiveVPSetParameter(parameters, innerParameterText, level) {
    let vPSetParameterText = ''
    let cmsType = ''
    let tab = '\t'

    //innerParameterText += '\n' + tab.repeat(level)
    vPSetParameterText += '\n' + tab.repeat(level)
    //console.log('VPSET parameters:' + JSON.stringify(parameters))
    for (const [key, value] of Object.entries(parameters)) {
      //console.log('KEY: ' + key)
      //console.log('VALUE: ' + value)
      let entriesCounter = 0

      for (const [key1, value1] of Object.entries(value)) {
        //console.log('KEY1: ' + key1)
        //console.log('VALUE1: ' + value1)
        //innerParameterText += key1 + ' = ' //name
        entriesCounter++
        vPSetParameterText += key1 + ' = '
        //console.log(innerParameterText)
        //console.log(vPSetParameterText)
        for (const [key2, value2] of Object.entries(value1)) {
          console.log(
            'Object.entries(value1).length: ' + Object.entries(value).length
          )
          console.log('KEY2: ' + key2)
          console.log('VALUE2: ' + value2)
          if (key2 == 'type') {
            cmsType = value2 //remember cms type for sets
            //innerParameterText += value2 + '( '
            vPSetParameterText += value2 + '( '
            //console.log(innerParameterText)
          } else {
            //console.log('cmsType ' + cmsType)
            if (cmsType != 'cms.PSet' && cmsType != 'cms.VPSet') {
              //innerParameterText += value2 + ' ),\n' + tab.repeat(level)
              if (entriesCounter < Object.entries(value).length)
                vPSetParameterText += value2 + ' ),\n' + tab.repeat(level)
              else vPSetParameterText += value2 + ' )\n' + tab.repeat(level - 1)
              //console.log(innerParameterText)
            } else {
              //complicated set type needs deconstructing
              console.log('innerParameterText BEFORE: ' + innerParameterText)
              vPSetParameterText += this.buildRecursiveVPSetParameter(
                value2,
                vPSetParameterText,
                level + 1
              )
              console.log('innerParameterText AFTER: ' + innerParameterText)
            }
          }
        }
      }
    }
    /*  if (cmsType != 'cms.PSet' && cmsType != 'cms.VPSet') {
      return innerParameterText + vPSetParameterText + ' )\n'
    } */
    //console.log(vPSetParameterText)
    console.log('LEVEL: ' + level)
    if (level > 2) vPSetParameterText += ')\n' + tab.repeat(level - 1)
    //TODO: zakucao sam :)
    else {
      vPSetParameterText += ' )\n'
      console.log('USAO OVDE GOVNAR ' + vPSetParameterText)
    }
    return vPSetParameterText
  },
  getModuleSnippet(moduleName, moduleParams) {
    //console.log(moduleName)
    //console.log(moduleParams)
    //console.log('getModuleSnippet CALLED!')
    let moduleSnippet = moduleName + ' = '
    let innerParameterText = ''
    let cmsType = ''
    let cType = ''

    for (const [key, value] of Object.entries(moduleParams)) {
      //console.log('KEY: ' + key)
      //console.log('VALUE: ' + value)
      //if (key == name) {
      //console.log('VALUE: ' + JSON.stringify(value))
      //return value
      //}
      let entriesCounter = 0

      if (key == 'pytype') {
        moduleSnippet += 'cms.' + value + '( '
      } else if (key == 'params') {
        for (const [key1, value1] of Object.entries(value)) {
          //console.log('KEY1: ' + key1)
          //console.log('VALUE1: ' + value1)
          innerParameterText += '\t' + key1 + ' = ' //parameter name
          //parse inner parameter values
          entriesCounter++
          for (const [key2, value2] of Object.entries(value1)) {
            //console.log('KEY2: ' + key2)
            //console.log('VALUE2: ' + value2)
            if (key2 == 'type') {
              cmsType = value2 //remember cms type for sets
              innerParameterText += value2 + '( '
            } else if (key2 == 'value') {
              if (cmsType != 'cms.PSet' && cmsType != 'cms.VPSet') {
                if (entriesCounter < Object.entries(value).length)
                  innerParameterText += value2 + ' ),\n'
                else innerParameterText += value2 + ' )\n'
              } else {
                //complicated set type needs deconstructing
                innerParameterText += this.buildRecursiveVPSetParameter(
                  value2,
                  '',
                  2
                )
              }
            }
          }
        }
      } else if (key == 'ctype') cType = '"' + value + '",\n'
    }
    moduleSnippet = moduleSnippet + cType + innerParameterText
    moduleSnippet += ' )'

    /*     moduleParams.forEach((val, key, moduleParams) => {
      console.log('KEY: ' + key)
      console.log('VAL: ' + val)
      /*       if (Object.is(pathParams.length - 1, key)) {
        moduleSnippet += ' ' + val[1] + ' )'
      } else {
        moduleSnippet += ' ' + val[1] + ' + '
      } */

    //})
    return moduleSnippet
  },
  getPathSnippet(pathName, pathParams) {
    //console.log(path)
    //console.log(pathParams)
    //console.log('getPathSnippet CALLED!')
    let pathSnippet = pathName + ' = cms.Path('
    pathParams.forEach((val, key, pathParams) => {
      if (Object.is(pathParams.length - 1, key)) {
        pathSnippet += ' ' + val[1] + ' )'
      } else {
        pathSnippet += ' ' + val[1] + ' + '
      }
    })
    //console.log(pathSnippet)
    return pathSnippet
    //return JSON.stringify(pathParams)
  },
  getSequenceSnippet(sequenceName, sequenceParams) {
    //console.log(sequence)
    //console.log(sequenceParams)
    //console.log('getSequenceSnippet CALLED!')
    let sequenceSnippet = sequenceName + ' = cms.Sequence('
    sequenceParams.forEach((val, key, sequenceParams) => {
      if (Object.is(sequenceParams.length - 1, key)) {
        sequenceSnippet += ' ' + val[1] + ' )'
      } else {
        sequenceSnippet += ' ' + val[1] + ' + '
      }
    })
    return sequenceSnippet
    //return JSON.stringify(sequenceParams)
  },
  getPSetSnippet(pset) {
    //console.log(sequence)
    //console.log(sequenceParams)
    console.log('getPSetSnippet CALLED!')
    return JSON.stringify(pset)
  },
}
