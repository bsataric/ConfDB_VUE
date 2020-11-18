/* eslint-disable no-unused-vars */
export default {
  buildRecursiveVPSetParameter(parameters) {
    let innerParameters = ''
    let cmsType = ''
    //console.log('VPSET parameters:' + JSON.stringify(parameters))
    for (const [key, value] of Object.entries(parameters)) {
      //console.log('KEY: ' + key)
      //console.log('VALUE: ' + value)
      for (const [key1, value1] of Object.entries(value)) {
        //console.log('KEY1: ' + key1)
        //console.log('VALUE1: ' + value1)
        innerParameters = key1 + ' = ' //name
        for (const [key2, value2] of Object.entries(value1)) {
          console.log('KEY2: ' + key2)
          console.log('VALUE2: ' + value2)
          if (key2 == 'type') {
            cmsType = value2 //remember cms type for sets
            innerParameters += value2 + '( '
          } else {
            if (cmsType != 'cms.PSet' && cmsType != 'cms.VPSet') {
              innerParameters += value2 + ' ),\n'
            } else {
              //complicated set type needs deconstructing
              innerParameters += this.buildRecursiveVPSetParameter(value2)
            }
          }
        }
      }
    }
    innerParameters += ' )\n'
    return innerParameters
  },
  getModuleSnippet(moduleName, moduleParams) {
    //console.log(moduleName)
    //console.log(moduleParams)
    //console.log('getModuleSnippet CALLED!')
    let moduleSnippet = moduleName + ' = '
    let innerParameters = ''
    let cmsType = ''
    let cType = ''

    for (const [key, value] of Object.entries(moduleParams)) {
      //console.log('KEY: ' + key)
      //console.log('VALUE: ' + value)
      //if (key == name) {
      //console.log('VALUE: ' + JSON.stringify(value))
      //return value
      //}
      if (key == 'pytype') {
        moduleSnippet += 'cms.' + value + '( '
      } else if (key == 'params') {
        for (const [key1, value1] of Object.entries(value)) {
          //console.log('KEY1: ' + key1)
          //console.log('VALUE1: ' + value1)
          innerParameters += key1 + ' = ' //parameter name
          //parse inner parameter values
          for (const [key2, value2] of Object.entries(value1)) {
            //console.log('KEY2: ' + key2)
            //console.log('VALUE2: ' + value2)
            if (key2 == 'type') {
              cmsType = value2 //remember cms type for sets
              innerParameters += value2 + '( '
            } else if (key2 == 'value') {
              if (cmsType != 'cms.PSet' && cmsType != 'cms.VPSet') {
                innerParameters += value2 + ' ),\n'
              } else {
                //complicated set type needs deconstructing
                innerParameters += this.buildRecursiveVPSetParameter(value2)
              }
            }
          }
        }
      } else if (key == 'ctype') cType = '"' + value + '",\n'
    }
    moduleSnippet = moduleSnippet + cType + innerParameters
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
