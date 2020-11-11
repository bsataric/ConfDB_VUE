<template>
  <div class="mb-6">
    <!--     <v-data-table
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
    </v-data-table> -->
    <vue-ads-table
      :columns="columns"
      :rows="rows"
      :page="page"
      selectable
      @selection-change="blabla"
      @filter-change="filterChanged"
      @page-change="pageChanged"
    >
      <template v-slot:trkd="cell">
        <v-checkbox v-model="cell.row.trkd"></v-checkbox>
      </template>
      <template v-slot:dft="cell">
        <v-checkbox v-model="cell.row.dft"></v-checkbox>
      </template>
    </vue-ads-table>
    <!--     {{ this.getSelectedModule }} -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { VueAdsTable } from 'vue-ads-table-tree'
import { VueAdsPagination } from 'vue-ads-pagination'
//import { VueAdsPageButton } from 'vue-ads-pagination/

@Component({
  computed: {
    ...mapGetters({
      getModuleByName: 'module/getModuleByName',
      getSelectedModule: 'module/getSelectedModule',
    }),
    // ...mapState('sequence', ['sequences']),
  },
  components: {
    VueAdsTable,
    VueAdsPagination,
  },
})
export default class TableView extends Vue {
  private getSelectedModule!: any[]

  private page: number = 0
  private filter: string = ''

  /*   private headers: any = [
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
  ] */
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

  private columns: any = [
    {
      property: 'name',
      title: 'Name',
      direction: null,
      filterable: true,
    },
    {
      property: 'type',
      title: 'Type',
      direction: null,
      filterable: true,
      collapseIcon: true,
    },
    {
      property: 'value',
      title: 'Value',
      direction: null,
      filterable: true,
      collapseIcon: true,
    },
    {
      property: 'trkd',
      title: 'Trkd',
      direction: null,
      filterable: true,
      collapseIcon: true,
    },
    {
      property: 'dft',
      title: 'Dft',
      direction: null,
      filterable: true,
      collapseIcon: true,
    },
  ]
  private rows: any = [
    {
      name: 'allHadPtCut',
      type: 'double',
      value: 380,
      dft: true,
      trkd: false,
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
  ]
  private rows1: any = [
    {
      firstName: 'Josephine',
      lastName: 'Astrid',
    },
    {
      firstName: 'Boudewijn',
      lastName: 'Van Brabandt',
    },
    {
      firstName: 'Albert II',
      lastName: 'Van Belgie',
      _children: [
        {
          firstName: 'Filip',
          lastName: 'Van Belgie',
          _children: [
            {
              firstName: 'Elisabeth',
              lastName: 'Van Brabant',
            },
            {
              firstName: 'Gabriel',
              lastName: 'Boudwijn',
            },
            {
              firstName: 'Emmanuel',
              lastName: 'Van Belgie',
            },
            {
              firstName: 'Eleonore',
              lastName: 'Boudwijn',
              _hasChildren: true,
            },
          ],
        },
        {
          firstName: 'Astrid',
          lastName: 'Van Belgie',
        },
        {
          firstName: 'Laurent',
          lastName: 'Van Belgie',
        },
      ],
    },
    {
      firstName: 'Alexander',
      lastName: 'Van Belgie',
    },
    {
      firstName: 'Marie-Christine',
      lastName: 'Leopoldine',
    },
    {
      firstName: 'Marie-Esmeralda',
      lastName: 'Leopoldine',
    },
    {
      firstName: 'Alexander',
      lastName: 'Van Belgie',
    },
    {
      firstName: 'Marie-Christine',
      lastName: 'Leopoldine',
    },
    {
      firstName: 'Marie-Esmeralda',
      lastName: 'Leopoldine',
    },
    {
      firstName: 'Alexander',
      lastName: 'Van Belgie',
    },
    {
      firstName: 'Marie-Christine',
      lastName: 'Leopoldine',
    },
    {
      firstName: 'Marie-Esmeralda',
      lastName: 'Leopoldine',
    },
  ]

  public filterChanged(filter) {
    this.filter = filter
  }

  public pageChanged(page) {
    this.page = page
  }

  public blabla(rows: any) {
    console.log(rows)
  }

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

<style lang="scss" scoped>
//see to include this directly into assets and not like this
@import '../assets/styles/vue-ads-table-tree.css';
@import 'https://use.fontawesome.com/releases/v5.3.1/css/all.css';
@import '../assets/styles/vue-ads-pagination.css';
@import 'https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css';

.leftAlign {
  text-align: left;
}
</style>
