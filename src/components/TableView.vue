<template>
  <div class="mb-6">
    <ZkTable
      @cell-dblclick="blabla()"
      ref="table"
      sum-text="sum"
      index-text="#"
      empty-text="No data"
      cell-class-name="param-style"
      :data="rows"
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
      <template v-slot:$expand="cell">
        {{
          `My name is ${cell.row.name},
           this rowIndex is ${cell.rowIndex}.`
        }}
      </template>
      <template v-slot:trkd="cell">
        {{ cell.row.trkd }}
      </template>
      <template v-slot:dft="cell">
        {{ cell.row.dft }}
      </template>
    </ZkTable>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import ZkTable from 'vue-table-with-tree-grid'

@Component({
  computed: {
    ...mapGetters({
      getModuleByName: 'module/getModuleByName',
      getSelectedModule: 'module/getSelectedModule',
    }),
    // ...mapState('sequence', ['sequences']),
  },
  components: {
    ZkTable,
  },
})
export default class TableView extends Vue {
  private getSelectedModule!: any[]

  @Prop({ default: false }) readonly stripe!: boolean
  @Prop({ default: true }) readonly border!: boolean
  @Prop({ default: true }) readonly showHeader!: boolean
  @Prop({ default: false }) readonly showSummary!: boolean
  @Prop({ default: true }) readonly showRowHover!: boolean
  @Prop({ default: false }) readonly showIndex!: boolean
  @Prop({ default: true }) readonly treeType!: boolean
  @Prop({ default: true }) readonly isFold!: boolean
  @Prop({ default: false }) readonly expandType!: boolean
  @Prop({ default: false }) readonly selectionType!: boolean

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
    },
    {
      label: 'Dft',
      prop: 'dft',
      type: 'template',
      template: 'dft',
    },
  ]

  public blabla() {
    console.log('BLABLA')
  }

  public buildRecursiveVPSetObject(vpSetObject: Object, body: any) {
    console.log('BUILDING RECURSIVE VPSET')
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
        console.log('KEY1: ' + key1 + ' VALUE1: ' + value1)
        //this is parameter loop
        for (const [key2, value2] of Object.entries(Object(value1))) {
          if (key2 === 'type') nestedVPSetObject['type'] = value2
          else if (key2 === 'value') {
            if (
              nestedVPSetObject['type'] == 'cms.VPSet' ||
              nestedVPSetObject['type'] == 'cms.PSet'
            ) {
              console.log('PSET NAME: ' + key1)
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

  public parseParams(params: any) {
    let paramsArray: any = []
    //paramsArray.length = 0

    //console.log(moduleData)
    //console.log(modulesObject)
    for (const [key, value] of Object.entries(params)) {
      //loop over sequnces - create new Sequence object and add it to children of the seqs
      //console.log('KEY: ' + key)
      //console.log('VALUE: ' + value)

      if (key === 'params') {
        // eslint-disable-next-line no-unused-vars
        for (const [key1, value1] of Object.entries(Object(value))) {
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
                console.log(JSON.stringify(nestedParameterObject))
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
      }
    }
    console.log('paramsArray:' + JSON.stringify(paramsArray))
    return paramsArray
  }

  get rows() {
    let rows = this.parseParams(this.getSelectedModule)
    return rows
  }
}
</script>

<style lang="scss" scoped>
//see to include this directly into assets and not like this
* {
  margin: 0;
  padding: 0;
}
.switch-list {
  margin: 20px 0;
  list-style: none;
  overflow: hidden;
}
.switch-item {
  margin: 20px;
  float: left;
}
.param-style {
  color: darkgreen;
  font-weight: bold;
}
</style>
