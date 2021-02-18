/* eslint-disable no-unused-vars */
export default {
  buildRecursiveVPSetParameter(parameters, level) {
    let vPSetParameterText = ''
    let firstRow = true
    let cmsType = ''
    let tab = '&emsp;'

    if (JSON.stringify(parameters) != '[{}]' && firstRow) {
      vPSetParameterText += '</br>' + tab.repeat(level)
    }
    let paramCounter = 0

    for (const [key, value] of Object.entries(parameters)) {
      if (Object.entries(parameters).length > 1) {
        if (paramCounter == 0) {
          vPSetParameterText += 'cms.PSet(</br>' //nested no named PSet
          level++
          vPSetParameterText += tab.repeat(level)
        } else {
          vPSetParameterText += tab.repeat(level) + 'cms.PSet(</br>' //nested no named PSet
          level++
        }
      }
      paramCounter++

      for (const [key1, value1] of Object.entries(value)) {
        if (!firstRow) vPSetParameterText += tab.repeat(level)
        else firstRow = false

        vPSetParameterText += key1 + ' = '

        for (const [key2, value2] of Object.entries(value1)) {
          if (key2 == 'type') {
            cmsType = value2 //remember cms type for sets
            vPSetParameterText += value2 + '( '
          } else {
            if (cmsType != 'cms.PSet' && cmsType != 'cms.VPSet') {
              if (cmsType == 'cms.string' || cmsType == 'cms.InputTag')
                vPSetParameterText += '"' + value2 + '" )</br>'
              else vPSetParameterText += value2 + ' )</br>'
            } else {
              //complicated set type needs deconstructing
              vPSetParameterText += this.buildRecursiveVPSetParameter(
                value2,
                level + 1
              )
            }
          }
        }
      }
      if (Object.entries(parameters).length > 1) {
        level--
        vPSetParameterText += tab.repeat(level) + ')</br>'
      }
    }

    vPSetParameterText += tab.repeat(level - 1) + ')' + '</br>'
    return vPSetParameterText
  },
  getModuleSnippet(moduleName, moduleChildren) {
    let moduleSnippet = moduleName + ' = '
    let innerParameterText = ''
    let cmsType = ''
    let cType = ''

    for (const [key, value] of Object.entries(moduleChildren)) {
      console.log('KEY: ' + key)
      console.log('VALUE: ' + value) //TODO: parse object
      if (key == 'pytype') {
        moduleSnippet += 'cms.' + value + '( '
      } else if (key == 'params') {
        for (const [key1, value1] of Object.entries(value)) {
          innerParameterText += '&emsp;' + key1 + ' = ' //parameter name

          for (const [key2, value2] of Object.entries(value1)) {
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
                innerParameterText += this.buildRecursiveVPSetParameter(
                  value2,
                  2
                )
              }
            }
          }
        }
      } else if (key == 'ctype') cType = '"' + value + '",</br>'
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

      for (const [key2, value2] of Object.entries(value1)) {
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
      }
      /*         }
      } else if (key == 'ctype') cType = '"' + value + '",</br>' */
    }
    psetSnippet = psetSnippet + cType + innerParameterText
    psetSnippet += ' )'

    return psetSnippet
  },
}
