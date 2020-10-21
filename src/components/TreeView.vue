<template>
  <!-- change key into some computed key or something and not name since they can be same-->
  <div>
    {{ user.name }}
    <v-treeview
      v-model="tree"
      :open="open"
      :items="items"
      activatable
      item-key="name"
      open-on-click
    >
      <template v-slot:prepend="{ item, open }">
        <v-icon v-if="!item.iconType && item.globalType != 'parameter'">
          {{ open ? 'mdi-minus-thick' : 'mdi-plus-thick' }}
        </v-icon>
        <v-icon v-else :style="{ color: item.iconColor }">
          {{ iconTypes[item.iconType] }}
        </v-icon>
      </template>
    </v-treeview>
    <!--     {{ getEventById(2) }}
 -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'

const axios = require('axios').default

@Component({
  computed: {
    /*     ...mapGetters(['getEventById']),
     */ ...mapState(['user', 'categories']),
  },
})
export default class TreeView extends Vue {
  private open: any = ['public']
  private globalSequencesObject: Object = {}
  private globalPathsObject: Object = {}
  private globalModulesObject: Object = {}

  private iconTypes: any = {
    sequence: 'mdi-view-sequential',
    module: 'mdi-view-module',
    path: 'mdi-filmstrip',
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
    console.log(sequencesObject)
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
    console.log(pathsObject)
    //this.items = Object.values(pathsObject)
    //this.items[0] = pathsObject
    //console.log(this.items[0])
    //console.log(this.pera)
    //this.items = JSON.stringify(pathsObject)
    this.globalPathsObject = pathsObject
  }

  public parseModules(moduleData: any) {
    let modulesObject: Object = {
      name: 'Modules',
      type: 'mods',
      children: [],
    }

    //console.log(modulesObject)
    for (const [key, value] of Object.entries(moduleData)) {
      //loop over sequnces - create new Sequence object and add it to children of the seqs
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
        console.log(`${key1}`)
        if (key1 === 'params') {
          // eslint-disable-next-line no-unused-vars
          for (const [key2, value2] of Object.entries(Object(value1))) {
            //console.log(key2)
            for (const [key3, value3] of Object.entries(Object(value2))) {
              if (key3 == 'type') nestedModuleObject['type'] = value3
              else if (key3 == 'value') nestedModuleObject['value'] = value3

              console.log(key3)
              console.log(value3)
            }
          }
        } else if (key1 === 'ctype') {
          nestedModuleObject['ctype'] = value1
        } else if (key1 === 'pytype') {
          nestedModuleObject['pytype'] = value1
        } //TODO: fix this
        let cmsTypeLenght = nestedModuleObject['type'].toString().length()
        let cmsType = nestedModuleObject['type'].substring(
          nestedModuleObject['type'].indexOf('.'),
          cmsTypeLenght
        )
        nestedModuleObject['name'] =
          cmsType + ' = ' + nestedModuleObject['value']
        moduleObject['name'] = moduleObject['children'].push(nestedModuleObject)
      }
      modulesObject['children'].push(moduleObject)
    }
    console.log(modulesObject)
    //this.items = Object.values(modulesObject)
    //this.items[0] = modulesObject
    //console.log(this.items[0])
    //console.log(this.pera)
    //this.items = JSON.stringify(modulesObject)
    //this.globalModulesObject = modulesObject
  }

  public fetchGroup(name: string) {
    axios
      .get('http://localhost:3000/' + name) //will have to do separate requests for all entities
      .then((response) => {
        // handle success
        if (name == 'seqs') this.parseSequences(response.data)
        else if (name == 'paths') this.parsePaths(response.data)
        else if (name == 'mods') this.parseModules(response.data)
      })
      .catch((error) => {
        // handle error
        console.log(error)
      })
      .then(function() {
        // always executed
      })
  }

  created() {
    // Make a request for config parts
    this.fetchGroup('seqs')
    this.fetchGroup('paths')
    this.fetchGroup('mods')
  }
}
</script>
