<template>
  <v-skeleton-loader
    v-if="!getConfigLoaded"
    :boilerplate="false"
    :dark="getDarkMode"
    type="table"
  ></v-skeleton-loader>
  <div v-else class="mb-6">
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
        :value="this.getSelectedNodeCTypeValue(this.getSelectedNodeType)"
        :label="this.getSelectedNodeLabelType(this.getSelectedNodeType)"
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
// eslint-disable-next-line no-unused-vars
import { NodeObject } from '../types'

import ZkTable from 'vue-table-with-tree-grid'

@Component({
  computed: {
    ...mapGetters({
      getSelectedNodeType: 'getSelectedNodeType',
      getSelectedNodeName: 'getSelectedNodeName',
      getSelectedNodeCType: 'getSelectedNodeCType',
      getSelectedNodeChildren: 'getSelectedNodeChildren',
      getPathsContainingCurrentNode: 'getPathsContainingCurrentNode',
      getDarkMode: 'getDarkMode',
      getConfigLoaded: 'getConfigLoaded',
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
  private getSelectedNodeName!: string
  private getSelectedNodeCType!: string
  private getSelectedNodeChildren!: Array<NodeObject>
  private getPathsContainingCurrentNode!: any[]
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

  public buildRecursiveVPSetObject(
    vpSetObject: Object,
    children: Array<NodeObject>
  ) {
    // eslint-disable-next-line no-unused-vars
    for (const [key, childObject] of Object.entries(children)) {
      let nestedNoNamePSetObject: Object = {} //might or might not be used
      if (childObject.name == 'PSet') {
        //console.log('NESTED UNNAMED PSET')
        //console.log('UNNAMED PSET OBJECT TYPE: ' + childObject.type)
        nestedNoNamePSetObject['type'] == 'PSet'
        nestedNoNamePSetObject['name'] = 'PSet' //no name
        nestedNoNamePSetObject['dft'] = false
        nestedNoNamePSetObject['trkd'] = true
        nestedNoNamePSetObject['children'] = []
      }
      //console.log(JSON.stringify(key), JSON.stringify(childObject))
      // eslint-disable-next-line no-unused-vars
      let nestedVPSetObject: Object = {
        value: '',
        trkd: true,
        dft: true,
      }

      nestedVPSetObject['type'] = childObject.type
      if (childObject.name == 'PSet') {
        this.buildRecursiveVPSetObject(
          nestedNoNamePSetObject,
          childObject.children
        )
      } else if (
        nestedVPSetObject['type'] == 'cms.VPSet' ||
        nestedVPSetObject['type'] == 'cms.PSet' ||
        nestedVPSetObject['type'] == 'cms.untracked.PSet' ||
        nestedVPSetObject['type'] == 'cms.untracked.VPSet'
      ) {
        //console.log('PSET NAME: ' + key1)
        nestedVPSetObject['name'] = childObject.name
        nestedVPSetObject['children'] = []

        this.buildRecursiveVPSetObject(nestedVPSetObject, childObject.children)
      } else {
        nestedVPSetObject['name'] = childObject.name.substring(
          0,
          childObject.name.indexOf(' ')
        )

        nestedVPSetObject['value'] = JSON.stringify(
          childObject.paremeterJSONValue
        ) //simple value
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
      if (childObject.name != 'PSet') {
        vpSetObject['children'].push(nestedVPSetObject)
      } else if (childObject.name == 'PSet') {
        vpSetObject['children'].push(nestedNoNamePSetObject)
      }
    }
  }

  public parseChildren(children: Array<NodeObject>, nodeType: string) {
    //console.log('MODULE/PSET PARAMS: ' + JSON.stringify(children)) //TODO: parse children
    //console.log('NODETYPE: ' + nodeType)
    let paramsArray: any = []

    if (
      nodeType == 'modules' ||
      nodeType == 'pset' ||
      nodeType == 'esproducers' ||
      nodeType == 'essources'
    ) {
      // eslint-disable-next-line no-unused-vars
      for (const [key, childObject] of Object.entries(children)) {
        this.parseInnerParams(childObject, paramsArray)
      }
    }
    //console.log('paramsArray:' + JSON.stringify(paramsArray))
    return paramsArray
  }

  public parseInnerParams(childObject: NodeObject, paramsArray: any) {
    let nestedParameterObject: Object = {
      //id: this.idCounter++,
      //children: [],
      dft: true,
      trkd: true,
      children: [],
    }

    nestedParameterObject['type'] = childObject.type
    if (
      nestedParameterObject['type'] == 'cms.VPSet' ||
      nestedParameterObject['type'] == 'cms.PSet' ||
      nestedParameterObject['type'] == 'cms.untracked.PSet' ||
      nestedParameterObject['type'] == 'cms.untracked.VPSet'
    ) {
      nestedParameterObject['children'] = []
      nestedParameterObject['name'] = childObject.name
      nestedParameterObject['value'] = ''

      this.buildRecursiveVPSetObject(
        nestedParameterObject,
        childObject.children
      )
    } else {
      nestedParameterObject['name'] = childObject.name.substring(
        0,
        childObject.name.indexOf(' ')
      )
      //simple type
      nestedParameterObject['value'] = JSON.stringify(
        childObject.paremeterJSONValue
      ) //simple value
      if (nestedParameterObject['value'].length > 70) {
        //shorten the string and put three dots in the end
        nestedParameterObject['value'] =
          nestedParameterObject['value'].substring(1, 70) + '...'
      }
    }

    if (nestedParameterObject['type'] != undefined) {
      let cmsTypeLenght = nestedParameterObject['type'].length
      let cmsType = nestedParameterObject['type'].substring(
        //cmsType is necessary for printing out in tree
        nestedParameterObject['type'].indexOf('.') + 1,
        cmsTypeLenght
      )
      nestedParameterObject['type'] = cmsType
      //console.log(nestedParameterObject)
    }
    //push parameter into module children
    paramsArray.push(nestedParameterObject)

    return paramsArray
  }

  public getSelectedNodeParams(nodeType: string) {
    //console.log('SELECTED NODE TYPE: ' + nodeType)
    if (
      nodeType == 'modules' ||
      nodeType == 'pset' ||
      nodeType == 'esproducers' ||
      nodeType == 'essources'
    ) {
      return this.parseChildren(this.getSelectedNodeChildren, nodeType)
    } else if (nodeType == 'sequences') {
      return []
    } else if (nodeType == 'paths') {
      return []
    }
    return []
  }

  public getSelectedNodeLabelType(nodeType: string) {
    if (nodeType == 'modules') {
      return 'EDProducer'
    } else if (nodeType == 'sequences') {
      return ''
    } else if (nodeType == 'paths') {
      return ''
    } else if (nodeType == 'pset') {
      return ''
    } else if (nodeType == 'esproducers') {
      return 'ESProducer'
    } else if (nodeType == 'essources') {
      return 'ESSource'
    }
    return ''
  }

  public getSelectedNodeCTypeValue(nodeType: string) {
    if (
      nodeType == 'modules' ||
      nodeType == 'esproducers' ||
      nodeType == 'essources'
    ) {
      return this.getSelectedNodeCType
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
    if (
      nodeType == 'modules' ||
      nodeType == 'pset' ||
      nodeType == 'esproducers' ||
      nodeType == 'essources'
    ) {
      return this.getSelectedNodeName
    } else if (nodeType == 'sequences') {
      return ''
    } else if (nodeType == 'paths') {
      return ''
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
    } else if (nodeType == 'esproducers') {
      return true
    } else if (nodeType == 'essources') {
      return true
    }
    return true
  }

  public getPaths(nodeType: string) {
    if (nodeType == 'modules') {
      let values: Array<string> = []
      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of Object.entries(
        this.getPathsContainingCurrentNode
      )) {
        values.push(value)
      }
      return values
    } else if (nodeType == 'sequences') {
      return []
    } else if (nodeType == 'path') {
      return []
    } else if (nodeType == 'pset') {
      return []
    } else if (nodeType == 'esproducers') {
      return []
    } else if (nodeType == 'essources') {
      return []
    }
    return []
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
