<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="parameters"
      :items-per-page="8"
      class="elevation-1"
    >
      <template v-slot:[`item.dft`]="{ item }">
        <v-simple-checkbox v-model="item.dft"></v-simple-checkbox>
      </template>
      <template v-slot:[`item.trkd`]="{ item }">
        <v-simple-checkbox v-model="item.trkd"></v-simple-checkbox>
      </template>
    </v-data-table>
    <!--     {{ this.getSelectedModule }} -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

@Component({
  computed: {
    ...mapGetters({
      getModuleByName: 'module/getModuleByName',
      getSelectedModule: 'module/getSelectedModule',
    }),
    // ...mapState('sequence', ['sequences']),
  },
})
export default class TableView extends Vue {
  private getSelectedModule!: any[]

  private headers: any = [
    {
      text: 'Name',
      align: 'start',
      sortable: true,
      value: 'name',
    },
    { text: 'Type', value: 'type' },
    { text: 'Value', value: 'value' },
    { text: 'Dft', value: 'dft' },
    { text: 'Trkd', value: 'trkd' },
  ]
  /*   private parameters1: any = [
    {
      name: 'allHadPtCut',
      type: 'double',
      value: 380,
      dft: true,
      trkd: true,
    },
    {
      name: 'semiE_dRMin',
      type: 'double',
      value: 0.5,
      dft: true,
      trkd: true,
    },
    {
      name: 'allHadRapidityCut',
      type: 'double',
      value: 16.0,
      dft: true,
      trkd: true,
    },
    {
      name: 'elecSelect',
      type: 'string',
      value:
        'pt > 45.0 & abs(eta)<2.5 & abs(gsfTrack.d0)<1 & abs(gsfTrack.dz)<20',
      dft: true,
      trkd: true,
    },
    {
      name: 'muonSrc',
      type: 'InputTag',
      value: 'muons',
      dft: true,
      trkd: true,
    },
    {
      name: 'jetLabels',
      type: 'VInputTag',
      value:
        'ak4PFJets, ak4PFJetsPuppi, ak8PFJetsPuppi, ak8PFJetsPuppiSoftDrop',
      dft: true,
      trkd: true,
    },
    {
      name: 'semiE_LepJetPtCut',
      type: 'double',
      value: 30,
      dft: true,
      trkd: true,
    },
    {
      name: 'Honeycomb',
      type: 408,
      value: 3.2,
      dft: true,
      trkd: true,
    },
    {
      name: 'Donut',
      type: 452,
      value: 25.0,
      dft: true,
      trkd: true,
    },
    {
      name: 'KitKat',
      type: 518,
      value: 26.0,
      dft: true,
      trkd: true,
    },
  ] */

  public parseParams(params: any) {
    let paramsArray: any = []

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
          }

          for (const [key2, value2] of Object.entries(Object(value1))) {
            if (key2 === 'type') nestedParameterObject['type'] = value2
            else if (key2 === 'value') {
              if (
                nestedParameterObject['type'] == 'cms.VPSet' ||
                nestedParameterObject['type'] == 'cms.PSet'
              ) {
                //nestedParameterObject['children'] = []
                nestedParameterObject['name'] = key2

                //this.buildRecursiveVPSetObject(nestedParameterObject, value3)
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
    return paramsArray
  }

  get parameters() {
    let params = this.parseParams(this.getSelectedModule)
    console.log(params)
    return params
  }
}
</script>

<style></style>
