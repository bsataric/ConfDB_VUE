/* eslint-disable no-unused-vars */
export default {
  buildRecursiveVPSetParameter(parameters, level) {
    let vPSetParameterText = ''
    let firstRow = true
    let cmsType = ''
    let tab = '\t'

    /*     if (JSON.stringify(parameters) == '[{}]') {
      console.log('[{}]')
      console.log('vPSetParameterText:' + JSON.stringify(vPSetParameterText))
    } */
    //innerParameterText += '\n' + tab.repeat(level)
    if (JSON.stringify(parameters) != '[{}]' && firstRow) {
      //put tabs only if the PSet is not empty
      //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
      vPSetParameterText += '\n' + tab.repeat(level)
    }
    //console.log('VPSET parameters:' + JSON.stringify(parameters))
    let paramCounter = 0
    /*    if (Object.entries(parameters).length > 1) {
      console.log('NESTED NONAMED PSET')
    } */
    for (const [key, value] of Object.entries(parameters)) {
      /*       console.log('KEY: ' + key)
      console.log('VALUE: ' + JSON.stringify(value)) */
      /*    if (JSON.stringify(parameters) == '[{}]') {
        console.log('[{}]')
        console.log('value:' + JSON.stringify(value))
      } */
      let entriesCounter = 0
      //console.log('ENTERED LOOP parameters' + parameters)
      /*     console.log(
        'FIRST CHAR: ' +
          JSON.stringify(Object.entries(parameters)[paramCounter])
      ) */
      if (Object.entries(parameters).length > 1) {
        console.log('PRAVIM PSET')
        if (paramCounter == 0) {
          vPSetParameterText += 'cms.PSet(\n' //nested no named PSet
          level++
          vPSetParameterText += tab.repeat(level)
        } else {
          console.log('LEVEL: ' + level)
          vPSetParameterText += tab.repeat(level) + 'cms.PSet(\n' //nested no named PSet
          level++
          //vPSetParameterText += tab.repeat(level)
        }
      }
      paramCounter++

      for (const [key1, value1] of Object.entries(value)) {
        //console.log('KEY1: ' + key1)
        //console.log('VALUE1: ' + value1)
        /*      if (JSON.stringify(parameters) == '[{}]') {
          console.log('[{}]')
          console.log('value:' + JSON.stringify(value))
        } */
        //innerParameterText += key1 + ' = ' //name
        entriesCounter++
        //console.log('ENTERED LOOP entriesCounter' + entriesCounter)
        //console.log('INNER LEVEL: ' + level)
        //console.log('CREATING NAME')
        //if (actualLevel == -1) {
        if (!firstRow) vPSetParameterText += tab.repeat(level)
        else firstRow = false
        //console.log('TAB REPEAT LEVEL: ' + level)
        //actualLevel = level + 1
        /*    } else {
          vPSetParameterText += tab.repeat(actualLevel)
          console.log('TAB REPEAT LEVEL: ' + actualLevel)
        } */
        vPSetParameterText += key1 + ' = '

        //console.log(vPSetParameterText)
        //console.log('NAME CREATED')

        //console.log(innerParameterText)
        //console.log(vPSetParameterText)
        for (const [key2, value2] of Object.entries(value1)) {
          /*      console.log(
            'Object.entries(value1).length: ' + Object.entries(value).length
          )
          console.log('KEY2: ' + key2)
          console.log('VALUE2: ' + value2) */
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
                vPSetParameterText += value2 + ' ),\n'
              /* + tab.repeat(level) */ else
                vPSetParameterText +=
                  value2 + ' )\n' /* + tab.repeat(level - 1) */
              //console.log(innerParameterText)
            } else {
              //complicated set type needs deconstructing
              //console.log('innerParameterText BEFORE: ' + innerParameterText)
              ///if (value2 != '') {
              vPSetParameterText += this.buildRecursiveVPSetParameter(
                value2,
                level + 1
              )
              /* } else {
                console.log('EMPTY')
              } */
              //console.log('innerParameterText AFTER: ' + innerParameterText)
            }
          }
        }
      }
      if (Object.entries(parameters).length > 1) {
        console.log('ZAVRSIO PSET')
        //if (paramCounter == Object.entries(parameters).length) level -= 1
        //else level--
        level--
        vPSetParameterText += tab.repeat(level) + ')\n'
      }
    }

    if (Object.entries(parameters).length > 1) {
      //level--
      // console.log('USAOAAAA')
      //level--
      //vPSetParameterText += '\n)AA'
    }
    /*  if (cmsType != 'cms.PSet' && cmsType != 'cms.VPSet') {
      return innerParameterText + vPSetParameterText + ' )\n'
    } */
    /*     if (JSON.stringify(parameters) == '[{}]') {
      console.log('[{}]')
      console.log('vPSetParameterText:' + JSON.stringify(vPSetParameterText))
    } */
    //console.log(vPSetParameterText)
    //console.log('LEVEL: ' + level)
    /*     console.log(
      'Object.entries(parameters).length',
      Object.entries(parameters).length
    )
    console.log('LEVEL AT THE END: ' + level) */
    if (Object.entries(parameters).length > 1) {
      //level++ //TODO: FIX LAST BRACE ON MULTIPLE VPSETS
    }
    if (Object.entries(parameters).length > 1) {
      //console.log('LEVEL AT THE END: ' + level)
    }
    vPSetParameterText += tab.repeat(level - 1) + ')' + '\n' //else { //vPSetParameterText += ')\n' //console.log('LEVEL <= 2 ' + vPSetParameterText) //}
    //if (level > 2) //vPSetParameterText += ')\n'
    /* + tab.repeat(level - 1) */ return vPSetParameterText
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

          //if (key1 == 'l1InputRegions') {
          //console.log('KEY1:' + key1)
          //console.log(JSON.stringify(value1))
          //}
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
                //if (entriesCounter < Object.entries(value).length)
                /* innerParameterText += value2 + ' ),\n'
                else */ innerParameterText +=
                  value2 + ' )\n'
              } else {
                //complicated set type needs deconstructing
                /*     if (key1 == 'MTOB') {
                  console.log(key1)
                  console.log('VALUE2: ' + JSON.stringify(value2))
                } */
                //if (V)PSet is not empty
                //console.log('VALUE2: ' + JSON.stringify(value2)[0])
                /*         if (JSON.stringify(value2)[0] == '[') {
                  //no named PSet
                  innerParameterText += '\ncms.PSet('
                } */
                innerParameterText += this.buildRecursiveVPSetParameter(
                  value2,
                  2
                )
                /*      if (JSON.stringify(value2)[0] == '[') {
                  //no named PSet
                  innerParameterText += ')\n'
                } */
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
