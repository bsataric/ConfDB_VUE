<template>
  <!-- change key into some computed key or something and not name since they can be same-->
  <div>
    <v-treeview
      v-model="tree"
      :open="open"
      :items="items"
      activatable
      item-key="name"
      item-text=""
      open-on-click
    >
      <template v-slot:prepend="{ item, open }">
        <v-icon v-if="!item.iconType && item.globalType != 'parameter'">
          {{ open ? 'mdi-minus-thick' : 'mdi-plus-thick' }}
        </v-icon>
        <v-icon v-else :style="{ color: item.iconColor }">
          {{ iconTypes[item.iconType] }}
        </v-icon>
        <span class="param-style" v-if="item.cmsType">
          {{ item.cmsType }}
        </span>
        <span :class="item.globalType == 'parameter' ? 'param-name-style' : ''">
          {{ item.name }}
        </span>
        <span class="param-value-style" v-if="item.value">
          {{ item.value }}
        </span>
      </template>
    </v-treeview>
    <!--     {{ getSequenceById(2) }}
 -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

//const axios = require('axios').default

@Component({
  computed: {
    ...mapGetters({
      getSequences: 'sequence/getSequences',
      getPaths: 'path/getPaths',
      getModules: 'module/getModules',
      getPSets: 'pset/getPSets',
    }),
    // ...mapState('sequence', ['sequences']),
  },
})
export default class TreeView extends Vue {
  private open: any = ['public']
  private getSequences!: any[] // are assigned via mapState
  private getPaths!: any[]
  private getModules!: any[]
  private getPSets!: any[]

  private globalSequencesObject: Object = {}
  private globalPathsObject: Object = {}
  private globalModulesObject: Object = {}
  private globalPSetsObject: Object = {}

  private iconTypes: any = {
    sequence: 'mdi-view-sequential',
    module: 'mdi-view-module',
    path: 'mdi-filmstrip',
    pset: 'mdi-format-list-bulleted',
  }
  private tree: any = []
  //private items: any = [
  /*   {
      name: 'Sequences',
      type: 'seqs',
      children: [
        {
          type: 'sequence',
          name: 'HLTPFClusteringForEgammaUnseeded',
          iconType: 'sequence',
          iconColor: 'red',
          children: [
            {
              type: 'modules',
              name: 'hltParticleFlowRecHitECALUnseeded',
              iconType: 'module',
            },
            {
              type: 'modules',
              name: 'hltParticleFlowRecHitPSUnseeded',
              iconType: 'module',
            },
          ],
        },
        {
          type: 'sequence',
          name: 'HLTDoLocalPixelSequence',
          iconType: 'sequence',
          iconColor: 'red',
          children: [
            {
              type: 'modules',
              name: 'hltSiPixelDigis',
              iconType: 'module',
            },
            {
              type: 'modules',
              name: 'hltSiPixelClusters',
              iconType: 'module',
            },
          ],
        },
      ],
    }, */
  /*     {
      name: 'Paths',
      type: 'paths',
      children: [
        {
          type: 'paths',
          name: 'HLTriggerFirstPath',
          iconType: 'path',
          iconColor: 'green',
          children: [
            {
              type: 'modules',
              name: 'hltGetConditions',
              iconType: 'module',
            },
            {
              type: 'modules',
              name: 'hltGetRaw',
              iconType: 'module',
            },
            {
              type: 'modules',
              name: 'hltBoolFalse',
              iconType: 'module',
            },
          ],
        },
        {
          type: 'paths',
          name: 'HLT_Ele5_Open_v1',
          iconType: 'path',
          iconColor: 'green',
          children: [
            {
              type: 'sequences',
              name: 'HLTBeginSequence',
              iconType: 'sequence',
              iconColor: 'red',
            },
            {
              type: 'modules',
              name: 'hltL1sSingleEGor',
              iconType: 'module',
            },
            {
              type: 'modules',
              name: 'hltPreEle5',
              iconType: 'module',
            },
            {
              type: 'sequences',
              name: 'HLTEle5OpenSequence',
              iconType: 'sequence',
              iconColor: 'red',
            },
            {
              type: 'sequences',
              name: 'HLTEndSequence',
              iconType: 'sequence',
              iconColor: 'red',
            },
          ],
        },
      ],
    }, */
  /*     {
      name: 'Modules',
      type: 'mods',
      children: [
        {
          type: 'modules',
          name: 'hltIter1ClustersRefRemoval',
          iconType: 'module',
          children: [
            {
              type: 'cms.string',
              globalType: 'parameter',
              ctype: 'TrackClusterRemover',
              pytype: 'EDProducer',
              value: 'highPurity',
              name: 'string = highPurity', //this will have to be computed (maybe coloured)
            },
          ],
        },
        {
          type: 'modules',
          name: 'hltParticleFlowSuperClusterECALUnseeded',
          iconType: 'module',
          children: [
            {
              type: 'cms.string',
              globalType: 'parameter',
              ctype: 'PFECALSuperClusterProducer',
              pytype: 'EDProducer',
              value: 'hltParticleFlowSuperClusterECALEndcapWithPreshower',
              name:
                'string = hltParticleFlowSuperClusterECALEndcapWithPreshower',
            },
          ],
        },
        {
          type: 'modules',
          name: 'hltDoubletRecoveryPFlowPixelSeeds',
          iconType: 'module',
          children: [
            {
              type: 'cms.double',
              globalType: 'parameter',
              ctype: 'SeedCreatorFromRegionConsecutiveHitsEDProducer',
              pytype: 'EDProducer',
              value: 1.0,
              name: 'double = 1.0',
            },
          ],
        },
        {
          type: 'modules',
          name: 'hltFEDSelector',
          iconType: 'module',
          children: [
            {
              type: 'cms.vuint32',
              globalType: 'parameter',
              ctype: 'SiPixelClusterShapeCacheProducer',
              pytype: 'EDProducer',
              value: [1023, 1024],
              name: 'vuint32 = [1023, 1024]',
            },
          ],
        },
        {
          type: 'modules',
          name: 'hltEgammaElectronPixelSeedsUnseeded',
          iconType: 'module',
          children: [
            {
              type: 'cms.InputTag',
              globalType: 'parameter',
              ctype: 'ElectronNHitSeedProducer',
              pytype: 'EDProducer',
              value: 'hltElePixelSeedsCombinedUnseeded',
              name: 'InputTag = hltElePixelSeedsCombinedUnseeded',
            },
          ],
        },
        {
          type: 'modules',
          name: 'hltParticleFlowRecHitECALUnseeded',
          iconType: 'module',
          children: [
            {
              type: 'cms.VPSet',
              globalType: 'parameter',
              ctype: 'PFRecHitProducer',
              pytype: 'EDProducer',
              name: 'VPSet',
              children: [
                {
                  type: 'cms.VPSet',
                  globalType: 'parameter',
                  name: 'VPSet',
                  children: [
                    {
                      type: 'cms.bool',
                      globalType: 'parameter',
                      value: true,
                      name: 'bool = true1',
                    },
                    {
                      type: 'cms.double',
                      globalType: 'parameter',
                      value: 2.0,
                      name: 'double = 2.02',
                    },
                  ],
                },
                {
                  type: 'cms.VPSet',
                  globalType: 'parameter',
                  name: 'VPSet',
                  children: [
                    {
                      type: 'cms.bool',
                      globalType: 'parameter',
                      value: true,
                      name: 'bool = true',
                    },
                    {
                      type: 'cms.double',
                      globalType: 'parameter',
                      value: 2.0,
                      name: 'double = 2.0',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'modules',
          name: 'hltFEDSelector',
          iconType: 'module',
          children: [
            {
              type: 'cms.vstring',
              globalType: 'parameter',
              ctype: 'ClassifierMerger',
              pytype: 'EDProducer',
              value: [
                'hltIter1PFlowTrackCutClassifierPrompt',
                'hltIter1PFlowTrackCutClassifierDetached',
              ],
              name:
                'vstring = [hltIter1PFlowTrackCutClassifierPrompt, hltIter1PFlowTrackCutClassifierDetached]',
            },
          ],
        },
      ],
    }, */
  /*  {
      name: 'PSets',
      type: 'psets',
      children: [
        {
          type: 'pset', //TODO: check this
          name: 'HLTPSetPixelLessStepTrajectoryFilter',
          children: [
            {
              type: 'cms.double',
              globalType: 'parameter',
              value: -1.0,
              name: 'double = -1.0', //this will have to be computed (maybe coloured)
            },
          ],
        },
        {
          type: 'pset', //TODO: check this
          name: 'HLTPSetInitialStepTrajectoryFilterPreSplittingForDmesonPPOnAA',
          children: [
            {
              type: 'cms.VPSet',
              globalType: 'parameter',
              name: 'VPSet',
              children: [
                {
                  type: 'cms.string',
                  globalType: 'parameter',
                  value:
                    'HLTPSetInitialStepTrajectoryFilterBasePreSplittingForDmesonPPOnAA',
                  name:
                    'string = HLTPSetInitialStepTrajectoryFilterBasePreSplittingForDmesonPPOnAA',
                },
                {
                  type: 'cms.string',
                  globalType: 'parameter',
                  value:
                    'HLTPSetInitialStepTrajectoryFilterShapePreSplittingPPOnAA',
                  name:
                    'string = HLTPSetInitialStepTrajectoryFilterShapePreSplittingPPOnAA',
                },
              ],
            },
          ],
        },
      ],
    }, */
  //]

  get items() {
    return [
      this.globalSequencesObject,
      this.globalPathsObject,
      this.globalModulesObject,
      this.globalPSetsObject,
    ]
  }
  public parseSequences(sequenceData: any) {
    let sequencesObject: Object = {
      name: 'Sequences',
      type: 'seqs',
      children: [],
    }

    //console.log(sequencesObject)
    for (const [key, value] of Object.entries(sequenceData)) {
      //loop over sequnces - create new Sequence object and add it to children of the seqs
      let sequenceObject: Object = {
        type: 'sequence',
        name: key,
        iconType: 'sequence',
        iconColor: 'red',
        children: [],
      }
      //console.log(`${key}`)
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        //loop over sequence entries
        let nestedSequenceObject: Object = {}
        //console.log(`${key1}`)
        if (Object(value1)[0] === 'modules') {
          //console.log('MODULE')
          nestedSequenceObject['type'] = 'modules'
          nestedSequenceObject['name'] = Object(value1)[1]
          nestedSequenceObject['iconType'] = 'module'
        } else if (Object(value1)[0] === 'sequences') {
          //console.log('SEQUENCE')
          nestedSequenceObject['type'] = 'sequences'
          nestedSequenceObject['name'] = Object(value1)[1]
          nestedSequenceObject['iconType'] = 'sequence'
          nestedSequenceObject['iconColor'] = 'red'
        }
        sequenceObject['children'].push(nestedSequenceObject)
      }
      sequencesObject['children'].push(sequenceObject)
    }
    //console.log(sequencesObject)
    //this.items = Object.values(sequencesObject)
    //this.items[0] = sequencesObject
    //console.log(this.items[0])
    //console.log(this.pera)
    //this.items = JSON.stringify(sequencesObject)
    this.globalSequencesObject = sequencesObject
  }

  public parsePaths(pathData: any) {
    let pathsObject: Object = {
      name: 'Paths',
      type: 'paths',
      children: [],
    }

    //console.log(pathsObject)
    for (const [key, value] of Object.entries(pathData)) {
      //loop over sequnces - create new Sequence object and add it to children of the seqs
      let pathObject: Object = {
        type: 'paths',
        name: key,
        iconType: 'path',
        iconColor: 'green',
        children: [],
      }
      //console.log(`${key}`)
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        //loop over sequence entries
        let nestedPathObject: Object = {}
        //console.log(`${key1}`)
        if (Object(value1)[0] === 'modules') {
          //console.log('MODULE')
          nestedPathObject['type'] = 'modules'
          nestedPathObject['name'] = Object(value1)[1]
          nestedPathObject['iconType'] = 'module'
        } else if (Object(value1)[0] === 'sequences') {
          //console.log('SEQUENCE')
          nestedPathObject['type'] = 'sequences'
          nestedPathObject['name'] = Object(value1)[1]
          nestedPathObject['iconType'] = 'sequence'
          nestedPathObject['iconColor'] = 'red'
        }
        pathObject['children'].push(nestedPathObject)
      }
      pathsObject['children'].push(pathObject)
    }
    //console.log(pathsObject)
    //this.items = Object.values(pathsObject)
    //this.items[0] = pathsObject
    //console.log(this.items[0])
    //console.log(this.pera)
    //this.items = JSON.stringify(pathsObject)
    this.globalPathsObject = pathsObject
  }

  public buildRecursiveVPSetObject(vpSetObject: Object, body: any) {
    //console.log(JSON.stringify(vpSetObject))
    //console.log(body)

    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of Object.entries(Object(body))) {
      //loop over VPSet entries
      let nestedVPSetObject: Object = {}
      //console.log(JSON.stringify(key), JSON.stringify(value))
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        //console.log(JSON.stringify(key1), JSON.stringify(value1))
        for (const [key2, value2] of Object.entries(Object(value1))) {
          //console.log(JSON.stringify(key2), JSON.stringify(value2))
          if (key2 === 'type') nestedVPSetObject['type'] = value2
          else if (key2 === 'value') {
            if (
              nestedVPSetObject['type'] == 'cms.VPSet' ||
              nestedVPSetObject['type'] == 'cms.PSet'
            ) {
              if (nestedVPSetObject['type'] == 'cms.VPSet')
                nestedVPSetObject['name'] = 'VPSet'
              else nestedVPSetObject['name'] = 'PSet'

              nestedVPSetObject['globalType'] = 'parameter'
              nestedVPSetObject['children'] = []

              this.buildRecursiveVPSetObject(nestedVPSetObject, value2)
            } else {
              nestedVPSetObject['value'] = JSON.stringify(value2) //simple value
              nestedVPSetObject['name'] = nestedVPSetObject['value']
            }
          }
        }
      }
      nestedVPSetObject['globalType'] = 'parameter'
      /*    console.log(
          'NESTED MODULE OBJECT: ' + JSON.stringify(nestedModuleObject)
        ) */
      //console.log('NESTED MODULE TYPE ' + nestedModuleObject['type'])
      if (nestedVPSetObject['type'] != undefined) {
        let cmsTypeLenght = nestedVPSetObject['type'].length
        let cmsType = nestedVPSetObject['type'].substring(
          //cmsType is necessary for printing out in tree
          nestedVPSetObject['type'].indexOf('.') + 1,
          cmsTypeLenght
        )
        nestedVPSetObject['cmsType'] = cmsType
        //nestedModuleObject['name'] = nestedModuleObject['value']
        vpSetObject['children'].push(nestedVPSetObject)
      }
    }
  }

  public parseModules(moduleData: any) {
    //TODO refractor this nesting goes deeper with multiple parameters now
    let modulesObject: Object = {
      name: 'Modules',
      type: 'mods',
      children: [],
    }
    //console.log(moduleData)
    //console.log(modulesObject)
    for (const [key, value] of Object.entries(moduleData)) {
      //loop over sequnces - create new Sequence object and add it to children of the seqs
      //console.log('NAME: ' + key)
      let moduleObject: Object = {
        type: 'modules',
        name: key,
        iconType: 'module',
        children: [],
      }
      //console.log(`${key}`)
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        //loop over sequence entries
        let nestedModuleObject: Object = {}
        //console.log(`${key1}`)
        if (key1 === 'params') {
          // eslint-disable-next-line no-unused-vars
          for (const [key2, value2] of Object.entries(Object(value1))) {
            //key2 should be parameter name
            //aviod para_name level
            console.log(key2)
            nestedModuleObject['name'] = key2 + ' = '

            for (const [key3, value3] of Object.entries(Object(value2))) {
              if (key3 === 'type') nestedModuleObject['type'] = value3
              else if (key3 === 'value') {
                if (
                  nestedModuleObject['type'] == 'cms.VPSet' ||
                  nestedModuleObject['type'] == 'cms.PSet'
                ) {
                  if (nestedModuleObject['type'] == 'cms.VPSet')
                    nestedModuleObject['name'] = 'VPSet'
                  /*+ this.makeid(5)*/
                  //dummy name to avoid same names
                  else nestedModuleObject['name'] = 'PSet' /*+ this.makeid(5)*/

                  nestedModuleObject['globalType'] = 'parameter'
                  nestedModuleObject['children'] = []

                  this.buildRecursiveVPSetObject(nestedModuleObject, value3)
                } else {
                  nestedModuleObject['value'] = JSON.stringify(value3) //simple value
                  if (nestedModuleObject['value'].length > 70) {
                    //shorten the string and put three dots in the end
                    nestedModuleObject['value'] =
                      nestedModuleObject['value'].substring(1, 70) + '...'
                  }
                  //if (nestedModuleObject['value'].indexOf('OR') != -1) {
                  //probably need more operators
                  //console.log('FOUND OR OPERATOR')
                  //let splitString = nestedModuleObject['value'].split('OR')
                  //console.log('SPLIT STRING: ' + splitString)
                  /*    nestedModuleObject['value'] = ''
                    for (let i = 0; i < splitString.length; i++) {
                      nestedModuleObject['value'] += splitString[i] + ' \r\n'
                    } */
                  //}
                }
              }
              //console.log(key3)
            }
          }
        } else if (key1 === 'ctype') {
          nestedModuleObject['ctype'] = value1
        } else if (key1 === 'pytype') {
          nestedModuleObject['pytype'] = value1
        } //TODO: fix this
        nestedModuleObject['globalType'] = 'parameter'
        /*    console.log(
          'NESTED MODULE OBJECT: ' + JSON.stringify(nestedModuleObject)
        ) */
        //console.log('NESTED MODULE TYPE ' + nestedModuleObject['type'])
        if (nestedModuleObject['type'] != undefined) {
          let cmsTypeLenght = nestedModuleObject['type'].length
          let cmsType = nestedModuleObject['type'].substring(
            //cmsType is necessary for printing out in tree
            nestedModuleObject['type'].indexOf('.') + 1,
            cmsTypeLenght
          )
          nestedModuleObject['cmsType'] = cmsType
          //nestedModuleObject['name'] = nestedModuleObject['value']
          moduleObject['children'].push(nestedModuleObject)
          console.log(nestedModuleObject)
        }
      }
      modulesObject['children'].push(moduleObject)
    }
    //console.log(modulesObject)
    //this.items = Object.values(modulesObject)
    //this.items[0] = modulesObject
    //console.log(this.items[0])
    //console.log(this.pera)
    //this.items = JSON.stringify(modulesObject)
    this.globalModulesObject = modulesObject
  }

  public parsePSets(psetData: any) {
    //console.log(psetData)
    let psetsObject: Object = {
      name: 'PSets',
      type: 'psets',
      children: [],
    }
    for (const [key, value] of Object.entries(psetData)) {
      //loop over sequnces - create new Sequence object and add it to children of the seqs
      //console.log('NAME: ' + key)
      let psetObject: Object = {
        type: 'pset',
        name: key,
        iconType: 'pset',
        children: [],
      }
      //console.log(`${key}`)
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        //loop over sequence entries
        let nestedPSetObject: Object = {}
        //console.log(`${key1}, ${value1}`)
        if (key1 === 'para_name') {
          // eslint-disable-next-line no-unused-vars
          for (const [key2, value2] of Object.entries(Object(value1))) {
            //aviod para_name level
            //console.log('ANYTHING')
            console.log(`${key2}, ${value2}`)
            if (key2 === 'type') nestedPSetObject['type'] = value2
            else if (key2 === 'value') {
              if (
                nestedPSetObject['type'] == 'cms.VPSet' ||
                nestedPSetObject['type'] == 'cms.PSet'
              ) {
                if (nestedPSetObject['type'] == 'cms.VPSet')
                  nestedPSetObject['name'] = 'VPSet'
                /*+ this.makeid(5)*/
                //dummy name to avoid same names
                else nestedPSetObject['name'] = 'PSet' /*+ this.makeid(5)*/

                nestedPSetObject['globalType'] = 'parameter'
                nestedPSetObject['children'] = []

                this.buildRecursiveVPSetObject(nestedPSetObject, value2)
              } else {
                nestedPSetObject['value'] = JSON.stringify(value2) //simple value
                if (nestedPSetObject['value'].length > 70) {
                  //shorten the string and put three dots in the end
                  nestedPSetObject['value'] =
                    nestedPSetObject['value'].substring(1, 70) + '...'
                }
                //if (nestedPSetObject['value'].indexOf('OR') != -1) {
                //probably need more operators
                //console.log('FOUND OR OPERATOR')
                //let splitString = nestedPSetObject['value'].split('OR')
                //console.log('SPLIT STRING: ' + splitString)
                /*    nestedPSetObject['value'] = ''
                    for (let i = 0; i < splitString.length; i++) {
                      nestedPSetObject['value'] += splitString[i] + ' \r\n'
                    } */
                //}
                nestedPSetObject['name'] = nestedPSetObject['value']
              }
            }
            //console.log(key3)
          }
        }
        nestedPSetObject['globalType'] = 'parameter'
        /*    console.log(
          'NESTED MODULE OBJECT: ' + JSON.stringify(nestedModuleObject)
        ) */
        //console.log('NESTED MODULE TYPE ' + nestedModuleObject['type'])
        if (nestedPSetObject['type'] != undefined) {
          let cmsTypeLenght = nestedPSetObject['type'].length
          let cmsType = nestedPSetObject['type'].substring(
            //cmsType is necessary for printing out in tree
            nestedPSetObject['type'].indexOf('.') + 1,
            cmsTypeLenght
          )
          nestedPSetObject['cmsType'] = cmsType
          //nestedModuleObject['name'] = nestedModuleObject['value']
          psetObject['children'].push(nestedPSetObject)
        }
      }
      psetsObject['children'].push(psetObject)
    }
    //console.log(psetsObject)
    //this.items = Object.values(psetsObject)
    //this.items[0] = psetsObject
    //console.log(this.items[0])
    //console.log(this.pera)
    //this.items = JSON.stringify(psetsObject)
    this.globalPSetsObject = psetsObject
  }

  async fetchGroup(name: string) {
    if (name == 'seqs') {
      await this.$store.dispatch('sequence/fetchSequences') // note the "await"
      this.parseSequences(this.getSequences)
    } else if (name == 'paths') {
      await this.$store.dispatch('path/fetchPaths')
      this.parsePaths(this.getPaths)
    } else if (name == 'mods') {
      await this.$store.dispatch('module/fetchModules')
      this.parseModules(this.getModules)
    } else if (name == 'psets') {
      await this.$store.dispatch('pset/fetchPSets')
      this.parsePSets(this.getPSets)
    }
  }

  created() {
    // Make a request for config parts
    this.fetchGroup('seqs')
    this.fetchGroup('paths')
    this.fetchGroup('mods')
    this.fetchGroup('psets')
  }
}
</script>

<style lang="scss" scoped>
.param-style {
  color: green;
}
.param-value-style {
  color: blue;
  font-weight: bold;
}
.param-name-style {
  font-weight: bold;
}
</style>
