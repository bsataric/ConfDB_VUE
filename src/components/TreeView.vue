<template>
  <!-- change key into some computed key or something and not name since they can be same-->
  <!-- 
          :open="openNodes"
      :key="openNodes.length"
  -->

  <div>
    <v-btn small @click="testFunction()">Test function</v-btn>
    <v-treeview
      :items="items"
      :activatable="true"
      dense
      item-key="id"
      item-text=""
      open-on-click
      :open="open"
      :active="active"
      @update:open="updateOpenNodes"
      @update:active="updateActiveNodes"
      ref="treeReference"
    >
      <template v-slot:prepend="{ item, open }">
        <span :ref="item.name" :id="item.type + item.name">
          <v-icon v-if="!item.iconType && item.globalType != 'parameter'">
            {{ open ? 'mdi-minus-thick' : 'mdi-plus-thick' }}
          </v-icon>
          <v-icon v-else :style="{ color: item.iconColor }">
            {{ iconTypes[item.iconType] }}
          </v-icon>
          <span class="param-style" v-if="item.cmsType">
            {{ item.cmsType }}
          </span>
          <span
            :class="item.globalType == 'parameter' ? 'param-name-style' : ''"
          >
            {{ item.name }}
          </span>
          <span class="param-value-style" v-if="item.value">
            {{ item.value }}
          </span>
        </span>
      </template>
    </v-treeview>
    <!--     {{ getSequenceById(2) }}
 -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

//const axios = require('axios').default

@Component({
  computed: {
    ...mapGetters({
      getSequences: 'sequence/getSequences',
      getPaths: 'path/getPaths',
      getModules: 'module/getModules',
      getSelectedNodeType: 'getSelectedNodeType',
      getSelectedNodeName: 'getSelectedNodeName',
      getSelectedNodeId: 'getSelectedNodeId',
      getNodeIDToObjectMap: 'getNodeIDToObjectMap',
      getSelectedNodeParamLength: 'getSelectedNodeParamLength',
      getOpenNodeIds: 'getOpenNodeIds',
      getForcedOpenNodeIds: 'getForcedOpenNodeIds',
      getForcedActiveNodeId: 'getForcedActiveNodeId',
      getOpenNodeIdsLength: 'getOpenNodeIdsLength',
      getPSets: 'pset/getPSets',
      getOpenFileContent: 'getOpenFileContent',
    }),
    // ...mapState('sequence', ['sequences']),
  },
})
export default class TreeView extends Vue {
  @Watch('getOpenFileContent')
  // eslint-disable-next-line no-unused-vars
  onOpenFileContentChanged(val: any, oldVal: any) {
    //console.log('VAL:' + val)
    //console.log('OLDVAL: ' + oldVal)
    this.fetchAllGroupsFromFile(val)
  }

  @Watch('open')
  // eslint-disable-next-line no-unused-vars
  onOpenChanged(val: any, oldVal: any) {
    /*  console.log('open VAL:' + val)
    console.log('open OLDVAL: ' + oldVal) */
  }

  @Watch('active')
  // eslint-disable-next-line no-unused-vars
  onActiveChanged(val: any, oldVal: any) {
    console.log('active VAL:' + val)
    console.log('active OLDVAL: ' + oldVal)
    //@ts-ignore
    //this.$refs[val].scrollIntoView() //TODO FIX
  }

  @Watch('getForcedActiveNodeId')
  onForcedActiveChanged(val: any, oldVal: any) {
    console.log('active VAL:' + val)
    console.log('active OLDVAL: ' + oldVal)
    //this.active = [val]
    this.forcedActive = [val]
  }

  @Watch('getOpenNodeIds')
  onOpenNodeChanged(val: any, oldVal: any) {
    console.log('getOpenNodeIds VAL:' + val)
    console.log('getOpenNodeIds OLDVAL: ' + oldVal)
  }

  @Watch('getForcedOpenNodeIds')
  onForcedOpenNodeChanged(val: any, oldVal: any) {
    console.log('getForcedOpenNodeIds VAL:' + val)
    console.log('getForcedOpenNodeIds OLDVAL: ' + oldVal)
    this.open = val
  }

  //private openNodes: any = []
  //private openNodeIds: any = []
  //private nodeIds: any = []
  private nodeIdNameMap: any = {}
  private nodeIDToObjectMap: any = {} //ID to Object map (name, type, children length passed to the Vuex store)
  private open: any = [1]
  private active: any = []
  private forcedActive: any = []
  //private configLoaded: boolean = false

  private openSequencesList: any = []
  private openModulesList: any = []
  private getSequences!: any[] // are assigned via mapState
  private getPaths!: any[]
  private getModules!: any[]
  private getPSets!: any[]
  private getOpenFileContent!: any[]

  private getSelectedNodeName!: string
  private getSelectedNodeType!: string
  private getSelectedNodeId!: number
  private getNodeIDToObjectMap!: any //maybe unecessary since we have map as variable
  private getSelectedNodeParamLength!: number
  private getOpenNodeIds!: any
  private getForcedOpenNodeIds!: any
  private getOpenNodeIdsLength!: any

  private globalSequencesObject: Object = {}
  private globalPathsObject: Object = {}
  private globalModulesObject: Object = {}
  private globalPSetsObject: Object = {}

  private idCounter = 1 //TODO: this is dummy this has to be provided from the server

  private iconTypes: any = {
    sequence: 'mdi-view-sequential',
    module: 'mdi-view-module',
    path: 'mdi-filmstrip',
    pset: 'mdi-format-list-bulleted',
  }
  private tree: any = []

  private items1: any = [
    {
      id: 1,
      name: 'Sequences',
      type: 'seqs',
      children: [
        {
          id: 2,
          type: 'sequence',
          name: 'HLTPFClusteringForEgammaUnseeded',
          iconType: 'sequence',
          iconColor: 'red',
          children: [
            {
              id: 3,
              type: 'modules',
              name: 'hltParticleFlowRecHitECALUnseeded',
              iconType: 'module',
            },
            {
              id: 4,
              type: 'modules',
              name: 'hltParticleFlowRecHitPSUnseeded',
              iconType: 'module',
            },
          ],
        },
        {
          id: 5,
          type: 'sequence',
          name: 'HLTDoLocalPixelSequence',
          iconType: 'sequence',
          iconColor: 'red',
          children: [
            {
              id: 6,
              type: 'modules',
              name: 'hltSiPixelDigis',
              iconType: 'module',
            },
            {
              id: 7,
              type: 'modules',
              name: 'hltSiPixelClusters',
              iconType: 'module',
            },
          ],
        },
      ],
    },
  ]
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

  /*  get open() {
    console.log('GET OPEN CALLED')
    return this.getOpenNodeIds
  } */

  public parseSequences(sequenceData: any) {
    let sequencesObject: Object = {
      id: 1,
      name: 'Sequences',
      type: 'seqs',
      children: [],
    }
    //this.nodeIds.push(1)
    this.nodeIdNameMap['Sequences'] = 1

    //console.log(sequencesObject)
    for (const [key, value] of Object.entries(sequenceData)) {
      //loop over sequnces - create new Sequence object and add it to children of the seqs
      let sequenceObject: Object = {
        type: 'sequence',
        name: key,
        id: ++this.idCounter,
        iconType: 'sequence',
        iconColor: 'red',
        children: [],
      }
      /*      if (sequenceObject['id'] == 1) {
        console.log('ID 1')
        console.log(sequenceObject['name'])
      } */
      //this.nodeIds.push(this.idCounter)
      this.nodeIdNameMap['sequence.' + key] = this.idCounter //top level we need
      //TRY
      let sequenceObjectId = this.idCounter //remember counter to use it after children are populated
      //this.nodeIDToObjectMap[this.idCounter] = { name: key, type: 'sequence' }

      //console.log(`${key}`)
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        //loop over sequence entries
        let nestedSequenceObject: Object = { id: ++this.idCounter }
        //this.nodeIds.push(this.idCounter)

        //console.log(`${key1}`)
        if (Object(value1)[0] === 'modules') {
          //console.log('MODULE')
          nestedSequenceObject['type'] = 'modules'
          nestedSequenceObject['name'] = Object(value1)[1]
          nestedSequenceObject['iconType'] = 'module'
          nestedSequenceObject['children'] = []
          this.nodeIdNameMap[
            'sequence.module.' + Object(value1)[1]
          ] = this.idCounter
          //TRY nested sequence
          this.nodeIDToObjectMap[this.idCounter] = {
            name: Object(value1)[1],
            type: 'modules',
            itemChildrenLength: 0,
            parentNodeId: 1,
          }
        } else if (Object(value1)[0] === 'sequences') {
          //console.log('SEQUENCE')
          nestedSequenceObject['type'] = 'sequences'
          nestedSequenceObject['name'] = Object(value1)[1]
          nestedSequenceObject['iconType'] = 'sequence'
          nestedSequenceObject['iconColor'] = 'red'
          nestedSequenceObject['children'] = []
          this.nodeIdNameMap[
            'sequence.sequence.' + Object(value1)[1]
          ] = this.idCounter
          //TRY nested sequence
          this.nodeIDToObjectMap[this.idCounter] = {
            name: Object(value1)[1],
            type: 'sequences',
            itemChildrenLength: 0,
            parentNodeId: 1,
          }
        }
        sequenceObject['children'].push(nestedSequenceObject)
      }
      //TRY one sequence
      this.nodeIDToObjectMap[sequenceObjectId] = {
        name: key,
        type: 'sequence',
        itemChildrenLength: sequenceObject['children'].length,
        parentNodeId: 1,
      }
      sequencesObject['children'].push(sequenceObject)
    }

    //TRY all sequences
    this.nodeIDToObjectMap[1] = {
      name: 'Sequences',
      type: 'seqs',
      itemChildrenLength: sequencesObject['children'].length,
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
      id: ++this.idCounter,
      name: 'Paths',
      type: 'pts', //TODO check this
      children: [],
    }
    // this.nodeIds.push(this.idCounter)
    this.nodeIdNameMap['Paths'] = this.idCounter
    //TRY remember the paths id
    let pathsIdCounter = this.idCounter
    //this.nodeIDToObjectMap[this.idCounter] = { name: 'Paths', type: 'pts' }

    //console.log(pathsObject)
    for (const [key, value] of Object.entries(pathData)) {
      //loop over sequnces - create new Sequence object and add it to children of the seqs
      let pathObject: Object = {
        type: 'paths',
        name: key,
        id: ++this.idCounter,
        iconType: 'path',
        iconColor: 'green',
        children: [],
      }
      let pathIdCounter = this.idCounter
      //this.nodeIds.push(this.idCounter)
      this.nodeIdNameMap['path.' + key] = this.idCounter
      //TRY
      //this.nodeIDToObjectMap[this.idCounter] = { name: key, type: 'paths' }

      //console.log(`${key}`)
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        //loop over path entries
        let nestedPathObject: Object = { id: ++this.idCounter }
        // this.nodeIds.push(this.idCounter)

        //console.log(`${key1}`)
        if (Object(value1)[0] === 'modules') {
          //console.log('MODULE')
          nestedPathObject['type'] = 'modules'
          nestedPathObject['name'] = Object(value1)[1]
          nestedPathObject['iconType'] = 'module'
          nestedPathObject['children'] = []
          this.nodeIdNameMap[
            'path.module.' + Object(value1)[1]
          ] = this.idCounter
          //TRY
          this.nodeIDToObjectMap[this.idCounter] = {
            name: Object(value1)[1],
            type: 'modules',
            itemChildrenLength: 0,
            parentNodeId: pathsIdCounter,
          }
        } else if (Object(value1)[0] === 'sequences') {
          //console.log('SEQUENCE')
          nestedPathObject['type'] = 'sequences'
          nestedPathObject['name'] = Object(value1)[1]
          nestedPathObject['iconType'] = 'sequence'
          nestedPathObject['iconColor'] = 'red'
          nestedPathObject['children'] = []
          this.nodeIdNameMap[
            'path.sequence.' + Object(value1)[1]
          ] = this.idCounter
          //TRY
          this.nodeIDToObjectMap[this.idCounter] = {
            name: Object(value1)[1],
            type: 'sequences',
            itemChildrenLength: 0,
            parentNodeId: pathsIdCounter,
          }
        }
        pathObject['children'].push(nestedPathObject)
      }
      this.nodeIDToObjectMap[pathIdCounter] = {
        name: key,
        type: 'paths',
        itemChildrenLength: pathObject['children'].length,
        parentNodeId: pathsIdCounter,
      }
      pathsObject['children'].push(pathObject)
    }

    //TRY all paths
    this.nodeIDToObjectMap[pathsIdCounter] = {
      name: 'Paths',
      type: 'pts',
      itemChildrenLength: pathsObject['children'].length,
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
    //if the body has more then 0 keys it is an unnamed nested PSet
    if (Object.entries(Object(body)).length > 1) {
      //console.log('NESTED UNNAMED PSET')
    }
    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of Object.entries(Object(body))) {
      //if (vpSetObject['name'] === 'qualityTests') {
      //console.log('LOOPING 1')
      //console.log('key: ' + key)
      //}
      //loop over VPSet entries
      //if (vpSetObject['name'] === 'regressionConfig') {
      //console.log(JSON.stringify(key))
      //console.log(JSON.stringify(value))
      //console.log('key: ' + key)
      //console.log('value: ' + value)
      //}
      let nestedNoNamePSetObject: Object = {} //might or might not be used
      if (Object.entries(Object(body)).length > 1) {
        nestedNoNamePSetObject['id'] = ++this.idCounter
        nestedNoNamePSetObject['globalType'] = 'parameter'
        nestedNoNamePSetObject['type'] == 'PSet'
        nestedNoNamePSetObject['name'] = 'PSet' //no name
        nestedNoNamePSetObject['children'] = []
      }
      //this.nodeIds.push(this.idCounter)

      //console.log(JSON.stringify(key), JSON.stringify(value))
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        let nestedVPSetObject: Object = { id: ++this.idCounter }
        nestedVPSetObject['globalType'] = 'parameter'

        //this.nodeIds.push(this.idCounter)

        //this is parameter loop
        if (vpSetObject['name'] === 'regressionConfig') {
          //console.log(JSON.stringify(key1), JSON.stringify(value1))
        }
        for (const [key2, value2] of Object.entries(Object(value1))) {
          if (vpSetObject['name'] === 'regressionConfig') {
            //console.log(JSON.stringify(key2), JSON.stringify(value2))
          }
          if (key2 === 'type') nestedVPSetObject['type'] = value2
          else if (key2 === 'value') {
            if (
              nestedVPSetObject['type'] == 'cms.VPSet' ||
              nestedVPSetObject['type'] == 'cms.PSet'
            ) {
              //if (vpSetObject['name'] === 'regressionConfig') {
              //console.log('type PSET')
              //}
              nestedVPSetObject['name'] = key1
              //if (key1 === 'qualityTests') {
              //console.log('AAAAA')
              //console.log('value2: ' + JSON.stringify(value2))
              //}

              /*     if (nestedVPSetObject['type'] == 'cms.VPSet')
                nestedVPSetObject['name'] = 'VPSet'
              else nestedVPSetObject['name'] = 'PSet' */

              nestedVPSetObject['children'] = []

              this.buildRecursiveVPSetObject(nestedVPSetObject, value2)
            } else {
              nestedVPSetObject['name'] = key1 + ' = '

              //if (vpSetObject['name'] === 'regressionConfig') {
              //console.log('type ' + nestedVPSetObject['type'])
              //}
              nestedVPSetObject['value'] = JSON.stringify(value2) //simple value
              //nestedVPSetObject['name'] = nestedVPSetObject['value']
            }
          }
          //if (vpSetObject['name'] === 'regressionConfig') {
          //console.log(JSON.stringify(nestedVPSetObject))
          //}
        }
        if (nestedVPSetObject['type'] != undefined) {
          let cmsTypeLenght = nestedVPSetObject['type'].length
          let cmsType = nestedVPSetObject['type'].substring(
            //cmsType is necessary for printing out in tree
            nestedVPSetObject['type'].indexOf('.') + 1,
            cmsTypeLenght
          )
          nestedVPSetObject['cmsType'] = cmsType
        }
        /*    console.log(
          'NESTED MODULE OBJECT: ' + JSON.stringify(nestedModuleObject)
        ) */
        //console.log('NESTED MODULE TYPE ' + nestedModuleObject['type'])

        //nestedModuleObject['name'] = nestedModuleObject['value']
        if (vpSetObject['name'] === 'regressionConfig') {
          //console.log(nestedVPSetObject)
        }
        if (Object.entries(Object(body)).length == 1) {
          vpSetObject['children'].push(nestedVPSetObject)
        } else {
          nestedNoNamePSetObject['children'].push(nestedVPSetObject)
        }
      }
      if (Object.entries(Object(body)).length > 1) {
        vpSetObject['children'].push(nestedNoNamePSetObject)
      }
    }
  }

  public parseModules(moduleData: any) {
    //TODO refractor this nesting goes deeper with multiple parameters now
    let modulesObject: Object = {
      id: ++this.idCounter,
      name: 'Modules',
      type: 'mods',
      children: [],
    }
    //this.nodeIds.push(this.idCounter)
    this.nodeIdNameMap['Modules'] = this.idCounter
    //TRY
    let modulesIdCounter = this.idCounter
    //this.nodeIDToObjectMap[this.idCounter] = { name: 'Modules', type: 'mods' }

    //console.log(moduleData)
    //console.log(modulesObject)
    for (const [key, value] of Object.entries(moduleData)) {
      //loop over sequnces - create new Sequence object and add it to children of the seqs
      //console.log('NAME: ' + key)
      let moduleObject: Object = {
        type: 'modules',
        name: key,
        id: ++this.idCounter,
        iconType: 'module',
        children: [],
      }
      // this.nodeIds.push(this.idCounter)
      this.nodeIdNameMap['module.' + key] = this.idCounter

      let moduleIdCounter = this.idCounter
      //TRY
      //this.nodeIDToObjectMap[this.idCounter] = { name: key, type: 'modules' }
      //console.log(`${key}`)
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        //loop over module entries
        //let nestedModuleObject: Object = { children: [] }
        //console.log(`${key1}`)
        if (key1 === 'params') {
          // eslint-disable-next-line no-unused-vars
          for (const [key2, value2] of Object.entries(Object(value1))) {
            //key2 should be parameter name
            //aviod para_name level
            //console.log(key2)

            let nestedParameterObject: Object = {
              id: ++this.idCounter, //parameter id is not used activly anywhere for now (don't put it in the map)
              children: [],
            }
            nestedParameterObject['globalType'] = 'parameter'
            //this.nodeIds.push(this.idCounter)

            for (const [key3, value3] of Object.entries(Object(value2))) {
              if (key3 === 'type') nestedParameterObject['type'] = value3
              else if (key3 === 'value') {
                if (
                  nestedParameterObject['type'] == 'cms.VPSet' ||
                  nestedParameterObject['type'] == 'cms.PSet'
                ) {
                  nestedParameterObject['children'] = []
                  nestedParameterObject['name'] = key2

                  this.buildRecursiveVPSetObject(nestedParameterObject, value3)
                } else {
                  nestedParameterObject['name'] = key2 + ' = '
                  //simple type
                  nestedParameterObject['value'] = JSON.stringify(value3) //simple value
                  if (nestedParameterObject['value'].length > 70) {
                    //shorten the string and put three dots in the end
                    nestedParameterObject['value'] =
                      nestedParameterObject['value'].substring(1, 70) + '...'
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
            nestedParameterObject['globalType'] = 'parameter'
            if (nestedParameterObject['type'] != undefined) {
              let cmsTypeLenght = nestedParameterObject['type'].length
              let cmsType = nestedParameterObject['type'].substring(
                //cmsType is necessary for printing out in tree
                nestedParameterObject['type'].indexOf('.') + 1,
                cmsTypeLenght
              )
              nestedParameterObject['cmsType'] = cmsType
              //nestedModuleObject['name'] = nestedModuleObject['value']
              //console.log(nestedParameterObject)
            }
            //push parameter into module children
            moduleObject['children'].push(nestedParameterObject)
          }
        } else if (key1 === 'ctype') {
          moduleObject['ctype'] = value1
        } else if (key1 === 'pytype') {
          moduleObject['pytype'] = value1
        }
        /*    console.log(
          'NESTED MODULE OBJECT: ' + JSON.stringify(nestedModuleObject)
        ) */
        //console.log('NESTED MODULE TYPE ' + nestedModuleObject['type'])

        //moduleObject['children'].push(nestedModuleObject)
      }
      modulesObject['children'].push(moduleObject)

      this.nodeIDToObjectMap[moduleIdCounter] = {
        name: key,
        type: 'modules',
        itemChildrenLength: moduleObject['children'].length,
        parentNodeId: modulesIdCounter,
      }
    }

    this.nodeIDToObjectMap[modulesIdCounter] = {
      name: 'Modules',
      type: 'mods',
      itemChildrenLength: modulesObject['children'].length,
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
      id: ++this.idCounter,
      name: 'PSets',
      type: 'psets',
      children: [],
    }
    //this.nodeIds.push(this.idCounter)
    this.nodeIdNameMap['Psets'] = this.idCounter

    let psetsIdCounter = this.idCounter
    //TRY
    //this.nodeIDToObjectMap[this.idCounter] = { name: 'PSets', type: 'psets' }

    for (const [key, value] of Object.entries(psetData)) {
      //loop over sequnces - create new Sequence object and add it to children of the seqs
      //console.log('NAME: ' + key)
      let psetObject: Object = {
        type: 'pset',
        name: key,
        id: ++this.idCounter,
        iconType: 'pset',
        children: [],
      }
      // this.nodeIds.push(this.idCounter)
      this.nodeIdNameMap['pset.' + key] = this.idCounter

      let psetIdCounter = this.idCounter
      //TRY
      //this.nodeIDToObjectMap[this.idCounter] = { name: key, type: 'pset' }

      //console.log(`${key}`)
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        //loop over pset entries
        if (key == 'HLTPSetPixelLessStepTrajectoryFilter') {
          //console.log(`${key1}, ${value1}`)
        }
        let nestedPSetObject: Object = { id: ++this.idCounter }
        //this.nodeIds.push(this.idCounter)

        //console.log(`${key1}, ${value1}`)
        //if (key1 === 'para_name') {
        // eslint-disable-next-line no-unused-vars
        for (const [key2, value2] of Object.entries(Object(value1))) {
          //aviod para_name level
          //console.log('ANYTHING')
          //console.log(`${key2}, ${value2}`)
          if (key2 === 'type') nestedPSetObject['type'] = value2
          else if (key2 === 'value') {
            if (
              nestedPSetObject['type'] == 'cms.VPSet' ||
              nestedPSetObject['type'] == 'cms.PSet'
            ) {
              nestedPSetObject['name'] = key1
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
              nestedPSetObject['children'] = []
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
              nestedPSetObject['name'] = key1 + ' = '
            }
          }
          //console.log(key3)
        }
        //}
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

      this.nodeIDToObjectMap[psetIdCounter] = {
        name: key,
        type: 'pset',
        itemChildrenLength: psetObject['children'].length,
        parentNodeId: psetsIdCounter,
      }
    }
    this.nodeIDToObjectMap[psetsIdCounter] = {
      name: 'PSets',
      type: 'psets',
      itemChildrenLength: psetsObject['children'].length,
    }
    //console.log(psetsObject)
    //this.items = Object.values(psetsObject)
    //this.items[0] = psetsObject
    //console.log(this.items[0])
    //console.log(this.pera)
    //this.items = JSON.stringify(psetsObject)
    this.globalPSetsObject = psetsObject
  }

  async fetchGroup(name: string, fromFile: boolean, fileData: any) {
    if (name == 'seqs') {
      await this.$store.dispatch('sequence/fetchSequences', {
        fromFile: fromFile,
        fileData: fileData,
      }) // note the "await"
      this.parseSequences(this.getSequences)
      //console.log(this.nodeIdNameMap)
    } else if (name == 'paths') {
      await this.$store.dispatch('path/fetchPaths', {
        fromFile: fromFile,
        fileData: fileData,
      })
      this.parsePaths(this.getPaths)
    } else if (name == 'mods') {
      await this.$store.dispatch('module/fetchModules', {
        fromFile: fromFile,
        fileData: fileData,
      })
      this.parseModules(this.getModules)
    } else if (name == 'psets') {
      await this.$store.dispatch('pset/fetchPSets', {
        fromFile: fromFile,
        fileData: fileData,
      })
      this.parsePSets(this.getPSets)
      //console.log('AFTER PSETS: ' + this.nodeIds)
      //TRY NEW DISPATCH
      await this.$store.dispatch(
        'createNodeIDToObjectMap',
        this.nodeIDToObjectMap
      ) // note the "await"
    }
  }

  /* 
  get selected() {
    if (!this.active.length) return undefined

    //const id = this.active[0]

    console.log('OPEN ' + this.open)
    console.log('ACTIVE ' + this.active)

    return this.active[0]
  } */

  async fetchNodeById(itemId: number) {
    /*     console.log(itemType)
    console.log(itemName)
    console.log(itemId)
    console.log(itemChildren.length) */
    //this.getOpen(itemType, itemName, itemId, itemChildren.length)
    //let index = this.checkOpen(itemName) //close node if it's already open
    //console.log('FETCH')
    //console.log('NODE ID: ' + itemId)
    /*     console.log('OPEN ' + this.open)
    console.log('ACTIVE ' + this.active) */
    //@ts-ignore
    //console.log('REF: ' + this.$refs[itemId].innerHTML)
    console.log('FETCH 1 TRIGGERED')

    /*   console.log(
      'this.getNodeIDToObjectMap:' + JSON.stringify(this.getNodeIDToObjectMap)
    ) */
    /* console.log(
      'this.getNodeIDToObjectMap[itemId]' + this.getNodeIDToObjectMap[itemId]
    ) */
    //TODO: leaf nodes for now are not inserted in object map
    if (this.getNodeIDToObjectMap[itemId] == undefined) return
    //if (this.getNodeIDToObjectMap[itemId].type == undefined) return

    console.log('SELECTED NODE TYPE: ' + this.getNodeIDToObjectMap[itemId].type)

    let itemType = this.getNodeIDToObjectMap[itemId].type

    if (itemType === 'sequence') {
      //console.log('FETCH SEQUENCE ID TYPE: ' + typeof itemId)
      await this.$store.dispatch('sequence/fetchSequenceViaId', {
        itemId: itemId,
        forceOpenNode: false,
      }) // note the "await"
    } else if (itemType === 'paths') {
      await this.$store.dispatch('path/fetchPathViaId', {
        itemId: itemId,
        forceOpenNode: false,
      })
    } else if (itemType === 'modules') {
      await this.$store.dispatch('module/fetchModuleViaId', {
        itemId: itemId,
        forceOpenNode: false,
      })
    } else if (itemType === 'pset') {
      await this.$store.dispatch('pset/fetchPSetViaId', {
        itemId: itemId,
        forceOpenNode: false,
      })
    } else {
      console.log('SPECIAL CASE!')
      //console.log(itemChildren.length)
      await this.$store.dispatch('setSelectedNodeViaID', {
        selectedNodeId: itemId,
      })
    }
    //if (index == -1)
    //open only if it is not already open
    //this.openNodes = ['Modules', 'hltFEDSelector']
  }

  /*   public checkOpen(openNodeName: string) {
    let index = this.openNodes.indexOf(openNodeName)
    if (index != -1) {
      //element already open
      this.openNodes.splice(index, 1)
      console.log('ELEMENT ALREADY OPEN this.open: ' + this.openNodes)
    }
    return index
  } */

  /*   public getOpen(
    openNodeType: string,
    openNodeName: string,
    openNodeId: number,
    itemChildrenLength: number
  ) {
    if (itemChildrenLength == 0) {
      console.log('ITEM CHILDREN ZERO!')
      return this.openNodeIds.length
    }

    let idIndex = this.openNodeIds.indexOf(openNodeId)

    //console.log('OPEN NODES BEFORE: ' + this.openNodeIds)

    if (idIndex == -1) this.openNodeIds.push(openNodeId)
    else this.openNodeIds.splice(idIndex, 1)

    //console.log('OPEN NODES AFTER: ' + this.openNodeIds)
    return this.openNodeIds.length
  } */

  /*   public calculateOpenNodesLength(nodeType: string, nodeName: string) {
    console.log('OPEN ON DEMAND')
    //this.getOpen(nodeType, nodeName)
    return this.openNodes.length
  } */

  // eslint-disable-next-line no-unused-vars
  /*   public returnOpenNodes(nodeName: any) {
    console.log('RETURN OPEN NODES')
    console.log('getSelectedNodeType: ' + this.getSelectedNodeType)
    console.log('getSelectedNodeName: ' + this.getSelectedNodeName)
    console.log('getSelectedNodeId: ' + this.getSelectedNodeId)
    console.log(
      'getSelectedNodeParamLength: ' + this.getSelectedNodeParamLength
    )
    console.log('getOpenNodeIds' + this.getOpenNodeIds)

    return this.getOpenNodeIds
  } */

  // eslint-disable-next-line no-unused-vars
  /*   public returnOpenNodes(nodeName: any) {
    console.log('returnOpenNodes TRIGGERED')
    return this.getOpenNodeIds
  } */

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // eslint-disable-next-line no-unused-vars
  /*   public getOpenNodeIdsWithDelay(nodeName: any) {
    this.sleep(50).then(() => {
      //let central store update cycle finish properly
      console.log('DELAYED CALL')
      return this.getOpenNodeIds
    })
  } */

  public testFunction() {
    //override
    //this.open = [1] //TODO open array not working properly, either find a way to fix it or drop it after tomorrow
    //this.active = [2]

    //console.log('REFS: ' + this.$refs.items[0])
    //@ts-ignore
    //this.$refs['Sequences'].scrollIntoView()
    /*   for (const [key, value] of Object.entries(this.$refs)) {
      console.log('KEY: ' + key)
      console.log('VALUE: ' + value)
    } */

    console.log(this.$refs.treeReference)
    //@ts-ignore
    console.log(this.$refs.treeReference.nodes[1].vnode.$el)
    //@ts-ignore
    this.$vuetify.goTo(0, {
      //@ts-ignore
      container: this.$refs.treeReference.nodes[1].vnode.$el,
    })

    //console.log('OPENNNNN: ' + this.open)
  }

  public updateOpenNodes(array: any) {
    console.log('THIS OPEN BEFORE: ' + this.open)
    let difference: number = parseInt(
      this.open
        .filter((x) => !array.includes(x))
        .concat(array.filter((x) => !this.open.includes(x)))
    )
    console.log('DIFFERENCE:' + difference)
    console.log('DIFFERENCE TYPE: ' + typeof difference)
    if (Object.keys(this.getNodeIDToObjectMap).length !== 0)
      this.fetchNodeById(difference)
    this.open = array
    console.log('THIS OPEN AFTER: ' + array)
  }

  public updateActiveNodes(array: any) {
    console.log('THIS ACTIVE: ' + array)
    if (Object.keys(this.getNodeIDToObjectMap).length !== 0)
      this.fetchNodeById(array[0])
    this.active = array
  }

  public updateTreeView() {
    console.log('UPDATE TREEVIEW!')
  }

  public fetchAllGroups() {
    this.fetchGroup('seqs', false, null)
    this.fetchGroup('paths', false, null)
    this.fetchGroup('mods', false, null)
    this.fetchGroup('psets', false, null)
  }

  public fetchAllGroupsFromFile(fileContent: any) {
    //console.log('FETCH ALL GROUPS')
    this.fetchGroup('seqs', true, fileContent)
    this.fetchGroup('paths', true, fileContent)
    this.fetchGroup('mods', true, fileContent)
    this.fetchGroup('psets', true, fileContent)
  }

  created() {
    // Make a request for config parts
    //this.nodeIds = []
    this.fetchAllGroups()

    //this.setNodeIds()
    //this.getOpenNodeIdsWithDelay()
    //this.open = ['Modules']

    //this.open = [1]
  }

  updated() {
    this.$nextTick(() => {
      if (this.forcedActive.length != 0) {
        let forced = this.forcedActive[0]
        //@ts-ignore
        this.$refs.treeReference.nodes[forced].vnode.$el.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        })

        this.forcedActive = []
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.param-style {
  color: darkgreen;
  font-weight: bold;
}
.param-value-style {
  color: blue;
  font-weight: bold;
}
.param-name-style {
  font-weight: bold;
}
</style>
