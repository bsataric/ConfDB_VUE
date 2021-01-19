<template>
  <div class="mb-6">
    <span class="flex">
      <v-text-field
        value="Dummy package"
        label="Package"
        outlined
        readonly
        dense
        class="package, mx-3"
      ></v-text-field>
      <v-text-field
        value="Dummy CVS"
        label="CVS"
        outlined
        readonly
        dense
        class="cvs, mx-3"
      ></v-text-field>
      <v-text-field
        :value="this.getSelectedNodeEDProducerValue(this.getSelectedNodeType)"
        :label="this.getSelectedNodeEDProducer(this.getSelectedNodeType)"
        outlined
        readonly
        dense
        class="producer, mx-3"
      ></v-text-field>
    </span>
    <span class="flex">
      <v-text-field
        :value="this.getSelectedNodeLabel(this.getSelectedNodeType)"
        label="Label"
        outlined
        readonly
        dense
        class="label, mx-3"
      ></v-text-field>
      <v-select
        :items="this.getPaths(this.getSelectedNodeType)"
        label="Paths"
        dense
        outlined
        :disabled="this.getPathsDisabled(this.getSelectedNodeType)"
      ></v-select>
    </span>
    <ZkTable
      @cell-dblclick="blabla()"
      ref="table"
      sum-text="sum"
      index-text="#"
      empty-text="No data"
      :style="{
        color: activeColor,
        backgroundColor: backGroundColor,
        fontSize: fontSize + 'px',
        fontFamily: font_family,
      }"
      :data="this.getSelectedNodeParams(this.getSelectedNodeType)"
      :columns="columns"
      :stripe="$props.stripe"
      :border="$props.border"
      :show-header="$props.showHeader"
      :show-summary="$props.showSummary"
      :show-row-hover="$props.showRowHover"
      :show-index="$props.showIndex"
      :tree-type="$props.treeType"
      :is-fold="$props.isFold"
      :expand-type="$props.expandType"
      :selection-type="$props.selectionType"
    >
      <template v-slot:trkd="cell">
        <v-checkbox v-model="cell.row.trkd"></v-checkbox>
      </template>
      <template v-slot:dft="cell">
        <v-checkbox v-model="cell.row.dft"></v-checkbox>
      </template>
    </ZkTable>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import ZkTable from 'vue-table-with-tree-grid'

@Component({
  computed: {
    ...mapGetters({
      getSelectedNodeType: 'getSelectedNodeType',
      getSelectedModuleParams: 'module/getSelectedModuleParams',
      getSelectedModuleName: 'module/getSelectedModuleName',
      getSelectedModulePaths: 'module/getSelectedModulePaths',
      getSelectedPSetParams: 'pset/getSelectedPSetParams',
      getSelectedPSetName: 'pset/getSelectedPSetName',
      getDarkMode: 'getDarkMode',
    }),
    // ...mapState('sequence', ['sequences']),
  },
  components: {
    ZkTable,
  },
})
export default class TableView extends Vue {
  @Watch('getDarkMode')
  // eslint-disable-next-line no-unused-vars
  onDarkModeChanged(val: any, oldVal: any) {
    //console.log('open VAL:' + val)
    //console.log('open OLDVAL: ' + oldVal)
    let prevActive = this.activeColor
    let prevBackground = this.backGroundColor
    this.activeColor = prevBackground
    this.backGroundColor = prevActive
    if (this.activeHeaderBGColor == this.headerBackGroundColor1)
      this.activeHeaderBGColor = this.headerBackGroundColor2
    else this.activeHeaderBGColor = this.headerBackGroundColor1
    this.changeHeaderBGColor(this.activeHeaderBGColor)
  }

  private getSelectedNodeType!: any
  private getSelectedModuleParams!: any[]
  private getSelectedModuleName!: any[]
  private getSelectedModulePaths!: any[]
  private getSelectedPSetParams!: any[]
  private getSelectedPSetName!: any[]
  private getDarkMode!: any[]

  @Prop({ default: false }) readonly stripe!: boolean
  @Prop({ default: true }) readonly border!: boolean
  @Prop({ default: true }) readonly showHeader!: boolean //there is no option for sticky header
  @Prop({ default: false }) readonly showSummary!: boolean
  @Prop({ default: false }) readonly showRowHover!: boolean
  @Prop({ default: false }) readonly showIndex!: boolean
  @Prop({ default: true }) readonly treeType!: boolean
  @Prop({ default: true }) readonly isFold!: boolean
  @Prop({ default: false }) readonly expandType!: boolean
  @Prop({ default: false }) readonly selectionType!: boolean

  //TODO: fix the styling later to look like Vuetify but for now this is OK
  private activeColor: string = '#212121'
  private backGroundColor: string = 'white'
  private headerBackGroundColor1: string = '#f8f8f9'
  private headerBackGroundColor2: string = '#37474F'
  private activeHeaderBGColor: string = this.headerBackGroundColor1
  private fontSize: any = 16
  private font_family: any = 'Roboto, sans-serif'

  private columns: any = [
    {
      label: 'Name',
      prop: 'name',
      width: '250px',
    },
    {
      label: 'Type',
      prop: 'type',
      width: '100px',
    },
    {
      label: 'Value',
      prop: 'value',
      width: '250px',
    },
    {
      label: 'Trkd',
      prop: 'trkd',
      type: 'template',
      template: 'trkd',
      width: '50px',
    },
    {
      label: 'Dft',
      prop: 'dft',
      type: 'template',
      template: 'dft',
      width: '50px',
    },
  ]

  public blabla() {
    console.log('BLABLA')
  }

  public buildRecursiveVPSetObject(vpSetObject: Object, body: any) {
    //console.log('BUILDING RECURSIVE VPSET')
    //if the body has more then 0 keys it is an unnamed nested PSet
    if (Object.entries(Object(body)).length > 1) {
      //console.log('NESTED UNNAMED PSET')
    }
    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of Object.entries(Object(body))) {
      let nestedNoNamePSetObject: Object = {} //might or might not be used
      if (Object.entries(Object(body)).length > 1) {
        //nestedNoNamePSetObject['id'] = this.idCounter++
        nestedNoNamePSetObject['type'] == 'PSet'
        nestedNoNamePSetObject['name'] = 'PSet' //no name
        nestedNoNamePSetObject['dft'] = false
        nestedNoNamePSetObject['trkd'] = true
        nestedNoNamePSetObject['children'] = []
      }
      //console.log(JSON.stringify(key), JSON.stringify(value))
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        let nestedVPSetObject: Object = {
          /*  id: this.idCounter++ */
          value: '',
          trkd: true,
          dft: true,
        }
        //console.log('KEY1: ' + key1 + ' VALUE1: ' + value1)
        //this is parameter loop
        for (const [key2, value2] of Object.entries(Object(value1))) {
          if (key2 === 'type') nestedVPSetObject['type'] = value2
          else if (key2 === 'value') {
            if (
              nestedVPSetObject['type'] == 'cms.VPSet' ||
              nestedVPSetObject['type'] == 'cms.PSet'
            ) {
              //console.log('PSET NAME: ' + key1)
              nestedVPSetObject['name'] = key1
              nestedVPSetObject['children'] = []

              this.buildRecursiveVPSetObject(nestedVPSetObject, value2)
            } else {
              nestedVPSetObject['name'] = key1

              nestedVPSetObject['value'] = JSON.stringify(value2) //simple value
              //nestedVPSetObject['name'] = nestedVPSetObject['value']
            }
          }
        }
        if (nestedVPSetObject['type'] != undefined) {
          let cmsTypeLenght = nestedVPSetObject['type'].length
          let cmsType = nestedVPSetObject['type'].substring(
            //cmsType is necessary for printing out in tree
            nestedVPSetObject['type'].indexOf('.') + 1,
            cmsTypeLenght
          )
          nestedVPSetObject['type'] = cmsType
        }
        //nestedModuleObject['name'] = nestedModuleObject['value']
        if (Object.entries(Object(body)).length == 1) {
          vpSetObject['children'].push(nestedVPSetObject)
        } else {
          nestedNoNamePSetObject['children'].push(nestedVPSetObject)
        }
      }
      if (Object.entries(Object(body)).length > 1) {
        vpSetObject['children'].push(nestedNoNamePSetObject)
      }
      /*     console.log(
        'VPSET CHILDREN: ' + JSON.stringify(vpSetObject['children'][0])
      ) */
    }
  }

  public parseParams(params: any, nodeType: string) {
    //console.log('MODULE/PSET PARAMS: ' + JSON.stringify(params))
    //console.log('NODETYPE: ' + nodeType)
    let paramsArray: any = []
    //paramsArray.length = 0

    //console.log(moduleData)
    //console.log(modulesObject)
    if (nodeType == 'modules') {
      for (const [key, value] of Object.entries(params)) {
        //loop over sequnces - create new Sequence object and add it to children of the seqs
        /*   console.log('KEY: ' + key)
      console.log('VALUE: ' + value) */

        if (key === 'params') {
          // eslint-disable-next-line no-unused-vars
          this.parseInnerParams(value, paramsArray)
        }
      }
    } else if (nodeType == 'pset') {
      this.parseInnerParams(params, paramsArray)
    }
    //console.log('paramsArray:' + JSON.stringify(paramsArray))
    return paramsArray
  }

  public parseInnerParams(params: any, paramsArray: any) {
    for (const [key1, value1] of Object.entries(Object(params))) {
      //console.log('KEY1: ' + key1)
      //console.log('VALUE1: ' + value1)

      let nestedParameterObject: Object = {
        //id: this.idCounter++,
        //children: [],
        dft: true,
        trkd: true,
        children: [],
      }

      for (const [key2, value2] of Object.entries(Object(value1))) {
        if (key2 === 'type') nestedParameterObject['type'] = value2
        else if (key2 === 'value') {
          if (
            nestedParameterObject['type'] == 'cms.VPSet' ||
            nestedParameterObject['type'] == 'cms.PSet'
          ) {
            nestedParameterObject['children'] = []
            // nestedParameterObject['_hasChildren'] = true
            //console.log(JSON.stringify(nestedParameterObject))
            nestedParameterObject['name'] = key1
            nestedParameterObject['value'] = ''

            this.buildRecursiveVPSetObject(nestedParameterObject, value2)

            /*      console.log(
                  'VPSET BUILD: ' + JSON.stringify(nestedParameterObject)
                ) */
          } else {
            nestedParameterObject['name'] = key1
            //simple type
            nestedParameterObject['value'] = JSON.stringify(value2) //simple value
            if (nestedParameterObject['value'].length > 70) {
              //shorten the string and put three dots in the end
              nestedParameterObject['value'] =
                nestedParameterObject['value'].substring(1, 70) + '...'
            }
          }
        }
        //console.log(key3)
      }

      if (nestedParameterObject['type'] != undefined) {
        //console.log('AAAA')
        let cmsTypeLenght = nestedParameterObject['type'].length
        let cmsType = nestedParameterObject['type'].substring(
          //cmsType is necessary for printing out in tree
          nestedParameterObject['type'].indexOf('.') + 1,
          cmsTypeLenght
        )
        nestedParameterObject['type'] = cmsType
        //nestedModuleObject['name'] = nestedModuleObject['value']
        //console.log(nestedParameterObject)
      }
      //push parameter into module children
      paramsArray.push(nestedParameterObject)
    }

    return paramsArray
  }

  /*   get rows() {
    let rows = this.parseParams(this.getSelectedModuleParams)
    return rows
  } */

  public getSelectedNodeParams(nodeType: string) {
    //console.log('SELECTED NODE TYPE: ' + nodeType)
    if (nodeType == 'modules') {
      return this.parseParams(this.getSelectedModuleParams, nodeType)
    } else if (nodeType == 'sequences') {
      return []
    } else if (nodeType == 'paths') {
      return []
    } else if (nodeType == 'pset') {
      return this.parseParams(this.getSelectedPSetParams, nodeType)
    }
    return []
  }

  public getSelectedNodeEDProducer(nodeType: any) {
    if (nodeType == 'module') {
      return 'EDProducer'
    } else if (nodeType == 'sequences') {
      return ''
    } else if (nodeType == 'path') {
      return ''
    } else if (nodeType == 'pset') {
      return ''
    }
    return ''
  }

  public getSelectedNodeEDProducerValue(nodeType: string) {
    if (nodeType == 'modules') {
      return this.getSelectedModuleName
    } else if (nodeType == 'sequences') {
      return ''
    } else if (nodeType == 'paths') {
      return ''
    } else if (nodeType == 'pset') {
      return ''
    }
    return ''
  }

  public getSelectedNodeLabel(nodeType: string) {
    if (nodeType == 'modules') {
      return this.getSelectedModuleName
    } else if (nodeType == 'sequences') {
      return ''
    } else if (nodeType == 'paths') {
      return ''
    } else if (nodeType == 'pset') {
      return this.getSelectedPSetName
    }
    return ''
  }

  public getPathsDisabled(nodeType: any) {
    if (nodeType == 'modules') {
      return false
    } else if (nodeType == 'sequences') {
      return true
    } else if (nodeType == 'path') {
      return true
    } else if (nodeType == 'pset') {
      return true
    }
    return true
  }

  public getPaths(nodeType: string) {
    if (nodeType == 'modules') {
      //console.log('PATHS!: ' + this.getSelectedModulePaths)
      let values: Array<string> = []
      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of Object.entries(this.getSelectedModulePaths)) {
        values.push(value)
      }
      return values
    } else if (nodeType == 'sequences') {
      return []
    } else if (nodeType == 'path') {
      return []
    } else if (nodeType == 'pset') {
      return []
    }
    return []
  }

  get paths() {
    let selectedModulePath = this.getSelectedModulePaths
    // eslint-disable-next-line no-unused-vars
    //console.log(selectedModulePath)
    //console.log(pathContainngModule)
    return selectedModulePath
  }

  //Table header BG color has to be changed this way
  public changeHeaderBGColor(backgroundColor: string) {
    let cols: any = document.getElementsByClassName('zk-table__header-row')
    for (let i = 0; i < cols.length; i++) {
      cols[i].style.backgroundColor = backgroundColor
    }
  }
}
</script>

<style lang="scss" scoped>
//see to include this directly into assets and not like this
* {
  margin: 0;
  padding: 0;
}
.v-text-field {
  width: 200px;
}

.flex {
  display: flex;
  margin-top: 10px;
}
.package {
  width: 250px;
}
.cvs {
  width: 60px;
}
.producer {
  width: 200px;
}
.label {
  width: 400px;
}
</style>
