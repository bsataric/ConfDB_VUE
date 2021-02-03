<template>
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
        <span
          :ref="item.name"
          :id="item.type + item.name"
          @contextmenu="showRightClickMenu($event, item.type, item.id)"
        >
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
    <TreeViewRightClick
      :rightClickNodeType="this.rightClickNodeType"
      :rightClickNodeId="this.rightClickNodeId"
      :showMenu="this.showMenu"
      :x="this.x"
      :y="this.y"
      @add-node="addNode"
      @update-node-name="updateNodeName"
      @remove-node="removeNode"
    />
  </div>
</template>

<script lang="ts">
import TreeViewRightClick from './TreeViewRightClick.vue'

import { Component, Vue, Watch } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
// eslint-disable-next-line no-unused-vars
import { NodeObject } from '../types'

//const axios = require('axios').default

@Component({
  computed: {
    ...mapGetters({
      getSequences: 'sequence/getSequences',
      getSequenceByName: 'sequence/getSequenceByName',
      getSequenceById: 'sequence/getSequenceById',
      getPaths: 'path/getPaths',
      getModules: 'module/getModules',
      getSelectedNodeType: 'getSelectedNodeType',
      getSelectedNodeName: 'getSelectedNodeName',
      getSelectedNodeId: 'getSelectedNodeId',
      getNodeIDToVuexObjectMap: 'getNodeIDToVuexObjectMap',
      getSelectedNodeParamLength: 'getSelectedNodeParamLength',
      getOpenNodeIds: 'getOpenNodeIds',
      getForcedOpenNodeIds: 'getForcedOpenNodeIds',
      getForcedActiveNodeId: 'getForcedActiveNodeId',
      getOpenNodeIdsLength: 'getOpenNodeIdsLength',
      getPSets: 'pset/getPSets',
      getOpenFileContent: 'getOpenFileContent',
      getDarkMode: 'getDarkMode',
      getIDCounter: 'getIDCounter',
    }),
    // ...mapState('sequence', ['sequences']),
  },
  components: {
    TreeViewRightClick,
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
    //console.log('active VAL:' + val)
    //console.log('active OLDVAL: ' + oldVal)
  }

  @Watch('getForcedActiveNodeId')
  // eslint-disable-next-line no-unused-vars
  onForcedActiveChanged(val: any, oldVal: any) {
    //console.log('active VAL:' + val)
    //console.log('active OLDVAL: ' + oldVal)
    //this.active = [val]
    this.forcedActive = [val]
  }

  @Watch('getOpenNodeIds')
  // eslint-disable-next-line no-unused-vars
  onOpenNodeChanged(val: any, oldVal: any) {
    //console.log('getOpenNodeIds VAL:' + val)
    //console.log('getOpenNodeIds OLDVAL: ' + oldVal)
  }

  @Watch('getForcedOpenNodeIds')
  // eslint-disable-next-line no-unused-vars
  onForcedOpenNodeChanged(val: any, oldVal: any) {
    //console.log('getForcedOpenNodeIds VAL:' + val)
    //console.log('getForcedOpenNodeIds OLDVAL: ' + oldVal)
    this.open = val
  }

  @Watch('getIDCounter')
  onIDCounterChanged(val: any, oldVal: any) {
    console.log('getIDCounter VAL:' + val)
    console.log('getIDCounter OLDVAL: ' + oldVal)
  }

  //private openNodes: any = []
  //private openNodeIds: any = []
  //private nodeIds: any = []
  private nodeIDToVuexObjectMap: any = {} //ID to Vuex Object map
  private nodeIDToNodeObjectMap: Map<number, NodeObject> = new Map<
    number,
    NodeObject
  >() //ID to Node Object map
  private open: any = [1]
  private active: any = []
  private forcedActive: any = []
  //private configLoaded: boolean = false

  //private openSequencesList: any = []
  //private openModulesList: any = []
  private getSequences!: any[] // are assigned via mapState
  private getSequenceByName!: any
  private getSequenceById!: any
  private getPaths!: any[]
  private getModules!: any[]
  private getPSets!: any[]
  private getOpenFileContent!: any[]

  private getSelectedNodeName!: string
  private getSelectedNodeType!: string
  private getSelectedNodeId!: number
  private getNodeIDToVuexObjectMap!: any //maybe unecessary since we have map as variable
  private getSelectedNodeParamLength!: number
  private getOpenNodeIds!: any
  private getForcedOpenNodeIds!: any
  private getOpenNodeIdsLength!: any

  private globalSequencesObject: Object = {}
  private globalPathsObject: Object = {}
  private globalModulesObject: Object = {}
  private globalPSetsObject: Object = {}

  private idCounter = 1 //TODO: this is dummy this has to be provided from the server

  //right click menu variables
  private rightClickNodeType = ''
  private rightClickNodeId = 0
  private showMenu: boolean = false
  private x: number = 0
  private y: number = 0

  private iconTypes: any = {
    sequence: 'mdi-view-sequential',
    module: 'mdi-view-module',
    path: 'mdi-filmstrip',
    pset: 'mdi-format-list-bulleted',
  }
  //private tree: any = []
  /*
  private items1: any = [
    {
      id: 1,
      name: 'Sequences',
      type: 'seqs',
      children: [
        {
          id: 2,
          type: 'sequences',
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
          type: 'sequences',
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
  ] */
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
    let sequencesObject: NodeObject = {
      id: 1,
      name: 'Sequences',
      type: 'seqs',
      globalType: 'rootNode',
      children: [],
      parentNodeId: 0,
      referencedByIds: [],
      //parameters: sequenceData,
      iconType: '',
      iconColor: '',
      value: '',
    }
    //this.nodeIds.push(1)
    //console.log(sequencesObject)
    for (const [key, value] of Object.entries(sequenceData)) {
      //loop over sequnces - create new Sequence object and add it to children of the seqs
      let sequenceObject: NodeObject = {
        id: ++this.idCounter,
        name: key,
        type: 'sequences',
        globalType: 'node',
        children: [],
        parentNodeId: 1,
        referencedByIds: [],
        //parameters: value,
        iconType: 'sequence',
        iconColor: 'red',
        value: '',
      }

      //this.nodeIds.push(this.idCounter)
      //let sequenceObjectId = this.idCounter //remember counter to use it after children are populated

      //console.log(`${key}`)
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        //loop over sequence entries
        //this.nodeIds.push(this.idCounter)

        //console.log(`${key1}`)
        if (Object(value1)[0] === 'modules') {
          //console.log('MODULE')
          let nestedSequenceObject: NodeObject = {
            id: ++this.idCounter,
            name: Object(value1)[1],
            type: 'modules',
            globalType: 'node',
            children: [],
            parentNodeId: sequenceObject['id'],
            referencedByIds: [],
            iconType: 'module',
            iconColor: '',
            value: '',
          }
          //TODO: substitute Vuex object map with this if it works
          this.nodeIDToNodeObjectMap[this.idCounter] = nestedSequenceObject
          sequenceObject['children'].push(nestedSequenceObject)

          this.nodeIDToVuexObjectMap[this.idCounter] = {
            name: Object(value1)[1],
            type: 'modules',
            itemChildrenLength: 0,
            parentNodeId: sequenceObject['id'],
            referencedByIds: [],
            parameters: value1,
          }
        } else if (Object(value1)[0] === 'sequences') {
          //console.log('SEQUENCE')
          let nestedSequenceObject: NodeObject = {
            id: ++this.idCounter,
            name: Object(value1)[1],
            type: 'sequences',
            globalType: 'node',
            children: [],
            parentNodeId: sequenceObject['id'],
            referencedByIds: [],
            iconType: 'sequence',
            iconColor: 'red',
            value: '',
          }

          //TODO: substitute Vuex object map with this if it works
          this.nodeIDToNodeObjectMap[this.idCounter] = nestedSequenceObject
          sequenceObject['children'].push(nestedSequenceObject)

          this.nodeIDToVuexObjectMap[this.idCounter] = {
            name: Object(value1)[1],
            type: 'sequences',
            itemChildrenLength: 0,
            parentNodeId: sequenceObject['id'],
            referencedByIds: [],
            parameters: value1,
          }
        }
      }
      //TODO: substitute Vuex object map with this if it works
      this.nodeIDToNodeObjectMap[sequenceObject['id']] = sequenceObject

      this.nodeIDToVuexObjectMap[sequenceObject['id']] = {
        name: key,
        type: 'sequences',
        itemChildrenLength: sequenceObject['children'].length,
        parentNodeId: 1,
        referencedByIds: [],
        parameters: value,
      }
      sequencesObject['children'].push(sequenceObject)
    }
    //TODO: substitute Vuex object map with this if it works
    this.nodeIDToNodeObjectMap[1] = sequencesObject

    this.nodeIDToVuexObjectMap[1] = {
      name: 'Sequences',
      type: 'seqs',
      itemChildrenLength: sequencesObject['children'].length,
      referencedByIds: [],
      parameters: {},
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
    let pathsObject: NodeObject = {
      id: ++this.idCounter,
      name: 'Paths',
      type: 'pts', //TODO check this
      globalType: 'rootNode',
      children: [],
      parentNodeId: 0,
      referencedByIds: [],
      //parameters: pathData,
      iconType: '',
      iconColor: '',
      value: '',
    }
    // this.nodeIds.push(this.idCounter)
    //remember the paths id
    //let pathsIdCounter = this.idCounter
    //this.nodeIDToVuexObjectMap[this.idCounter] = { name: 'Paths', type: 'pts' }

    //console.log(pathsObject)
    for (const [key, value] of Object.entries(pathData)) {
      //loop over sequnces - create new Sequence object and add it to children of the seqs
      let pathObject: NodeObject = {
        id: ++this.idCounter,
        name: key,
        type: 'paths',
        globalType: 'node',
        children: [],
        parentNodeId: pathsObject['id'],
        referencedByIds: [],
        //parameters: value,
        iconType: 'path',
        iconColor: 'green',
        value: '',
      }
      //let pathIdCounter = this.idCounter
      //this.nodeIds.push(this.idCounter)

      //console.log(`${key}`)
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        //loop over path entries
        //let nestedPathObject: Object = { id: ++this.idCounter }
        // this.nodeIds.push(this.idCounter)

        //console.log(`${key1}`)
        if (Object(value1)[0] === 'modules') {
          //console.log('MODULE')
          let nestedPathObject: NodeObject = {
            id: ++this.idCounter,
            name: Object(value1)[1],
            type: 'modules',
            globalType: 'node',
            children: [],
            parentNodeId: pathObject['id'],
            referencedByIds: [],
            //nestedPathObject['parameters'] = value1
            iconType: 'module',
            iconColor: '',
            value: '',
          }

          //TODO: substitute Vuex object map with this if it works
          this.nodeIDToNodeObjectMap[this.idCounter] = nestedPathObject
          pathObject['children'].push(nestedPathObject)

          this.nodeIDToVuexObjectMap[this.idCounter] = {
            name: Object(value1)[1],
            type: 'modules',
            itemChildrenLength: 0,
            parentNodeId: pathObject['id'],
            referencedByIds: [],
            parameters: value1,
          }
        } else if (Object(value1)[0] === 'sequences') {
          //console.log('SEQUENCE')
          let nestedPathObject: NodeObject = {
            id: ++this.idCounter,
            name: Object(value1)[1],
            type: 'sequences',
            globalType: 'node',
            children: [],
            parentNodeId: pathObject['id'],
            referencedByIds: [],
            //nestedPathObject['parameters'] = value1
            iconType: 'sequence',
            iconColor: 'red',
            value: '',
          }
          //TODO: substitute Vuex object map with this if it works
          this.nodeIDToNodeObjectMap[this.idCounter] = nestedPathObject
          pathObject['children'].push(nestedPathObject)

          this.nodeIDToVuexObjectMap[this.idCounter] = {
            name: Object(value1)[1],
            type: 'sequences',
            itemChildrenLength: 0,
            parentNodeId: pathObject['id'],
            referencedByIds: [],
            parameters: value1,
          }
        }
      }
      //TODO: substitute Vuex object map with this if it works
      this.nodeIDToNodeObjectMap[pathObject['id']] = pathObject

      this.nodeIDToVuexObjectMap[pathObject['id']] = {
        name: key,
        type: 'paths',
        itemChildrenLength: pathObject['children'].length,
        parentNodeId: pathsObject['id'],
        referencedByIds: [],
        parameters: value,
      }
      pathsObject['children'].push(pathObject)
    }
    //TODO: substitute Vuex object map with this if it works
    this.nodeIDToNodeObjectMap[pathsObject['id']] = pathsObject

    this.nodeIDToVuexObjectMap[pathsObject['id']] = {
      name: 'Paths',
      type: 'pts',
      itemChildrenLength: pathsObject['children'].length,
      referencedByIds: [],
      parameters: {},
    }
    //console.log(pathsObject)
    //this.items = Object.values(pathsObject)
    //this.items[0] = pathsObject
    //console.log(this.items[0])
    //console.log(this.pera)
    //this.items = JSON.stringify(pathsObject)
    this.globalPathsObject = pathsObject
  }

  public buildRecursiveVPSetObject(
    vpSetObject: NodeObject,
    body: any,
    parentID: number
  ) {
    //console.log(JSON.stringify(vpSetObject))
    //console.log(body)
    //console.log('PARENT ID: ' + parentID)
    //if the body has more then 0 keys it is an unnamed nested PSet
    //if (Object.entries(Object(body)).length > 1) {
    //console.log('NESTED UNNAMED PSET')
    //}
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
      let nestedNoNamePSetObject: NodeObject = {} as NodeObject //might or might not be used
      //let nestedNoNamePSetObjectId = 0
      if (Object.entries(Object(body)).length > 1) {
        nestedNoNamePSetObject['id'] = ++this.idCounter
        nestedNoNamePSetObject['name'] = 'PSet' //no name
        nestedNoNamePSetObject['type'] == 'PSet'
        nestedNoNamePSetObject['globalType'] = 'parameter'
        nestedNoNamePSetObject['children'] = []
        nestedNoNamePSetObject['parentNodeId'] = parentID
        nestedNoNamePSetObject['referencedByIds'] = []
        nestedNoNamePSetObject['iconType'] = ''
        nestedNoNamePSetObject['iconColor'] = ''
        nestedNoNamePSetObject['value'] = ''

        //nestedNoNamePSetObject['parameters'] = value1 //TODO
        //nestedNoNamePSetObjectId = this.idCounter
      }
      //this.nodeIds.push(this.idCounter)

      //console.log(JSON.stringify(key), JSON.stringify(value))
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        let nestedVPSetObject: NodeObject = {} as NodeObject
        nestedVPSetObject['id'] = ++this.idCounter
        nestedVPSetObject['globalType'] = 'parameter'

        //this.nodeIds.push(this.idCounter)

        //this is parameter loop
        //if (vpSetObject['name'] === 'regressionConfig') {
        //console.log(JSON.stringify(key1), JSON.stringify(value1))
        //}
        for (const [key2, value2] of Object.entries(Object(value1))) {
          //if (vpSetObject['name'] === 'regressionConfig') {
          //console.log(JSON.stringify(key2), JSON.stringify(value2))
          //}
          if (key2 === 'type') nestedVPSetObject['type'] = value2 as string
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
              this.buildRecursiveVPSetObject(
                nestedVPSetObject,
                value2,
                nestedVPSetObject['id']
              ) //TODO: is parent ID ok?
            } else {
              nestedVPSetObject['name'] = key1 + ' = '
              nestedVPSetObject['children'] = []

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
        //if (vpSetObject['name'] === 'regressionConfig') {
        //console.log(nestedVPSetObject)
        //}

        //nestedVPSetObject['parentNodeId'] = 0 //TODO: who's parent?
        nestedVPSetObject['referencedByIds'] = []
        nestedVPSetObject['iconType'] = ''
        nestedVPSetObject['iconColor'] = ''

        //TODO: substitute Vuex object map with this if it works
        this.nodeIDToNodeObjectMap[nestedVPSetObject['id']] = nestedVPSetObject

        if (Object.entries(Object(body)).length == 1) {
          nestedVPSetObject['parentNodeId'] = vpSetObject['id']
          vpSetObject['children'].push(nestedVPSetObject)
        } else {
          nestedVPSetObject['parentNodeId'] = nestedNoNamePSetObject['id']
          nestedNoNamePSetObject['children'].push(nestedVPSetObject)
        }
      }

      //TODO: substitute Vuex object map with this if it works
      this.nodeIDToNodeObjectMap[
        nestedNoNamePSetObject['id']
      ] = nestedNoNamePSetObject

      if (Object.entries(Object(body)).length > 1) {
        vpSetObject['children'].push(nestedNoNamePSetObject)
      }
    }
  }

  public parseModules(moduleData: any) {
    //TODO refractor this nesting goes deeper with multiple parameters now
    let modulesObject: NodeObject = {
      id: ++this.idCounter,
      name: 'Modules',
      type: 'mods',
      globalType: 'rootNode',
      children: [],
      parentNodeId: 0,
      referencedByIds: [],
      //parameters: moduleData,
      iconType: '',
      iconColor: '',
      value: '',
    }
    //this.nodeIds.push(this.idCounter)
    //let modulesIdCounter = this.idCounter
    //this.nodeIDToVuexObjectMap[this.idCounter] = { name: 'Modules', type: 'mods' }

    //console.log(moduleData)
    //console.log(modulesObject)
    for (const [key, value] of Object.entries(moduleData)) {
      //loop over sequnces - create new Sequence object and add it to children of the seqs
      //console.log('NAME: ' + key)
      let moduleObject: NodeObject = {
        id: ++this.idCounter,
        name: key,
        type: 'modules',
        globalType: 'node',
        children: [],
        parentNodeId: modulesObject['id'],
        referencedByIds: [],
        //parameters: value,
        iconType: 'module',
        iconColor: '',
        value: '',
      }
      // this.nodeIds.push(this.idCounter)

      //let moduleIdCounter = this.idCounter
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

            let nestedParameterObject: NodeObject = {} as NodeObject
            nestedParameterObject['id'] = ++this.idCounter
            nestedParameterObject['children'] = []
            nestedParameterObject['globalType'] = 'parameter'
            //this.nodeIds.push(this.idCounter)

            for (const [key3, value3] of Object.entries(Object(value2))) {
              if (key3 === 'type')
                nestedParameterObject['type'] = value3 as string
              else if (key3 === 'value') {
                if (
                  nestedParameterObject['type'] == 'cms.VPSet' ||
                  nestedParameterObject['type'] == 'cms.PSet'
                ) {
                  nestedParameterObject['children'] = []
                  nestedParameterObject['name'] = key2

                  this.buildRecursiveVPSetObject(
                    nestedParameterObject,
                    value3,
                    moduleObject['id']
                  )
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
            nestedParameterObject['parentNodeId'] = moduleObject['id']
            nestedParameterObject['referencedByIds'] = []
            nestedParameterObject['iconType'] = ''
            nestedParameterObject['iconColor'] = ''

            this.nodeIDToNodeObjectMap[
              nestedParameterObject['id']
            ] = nestedParameterObject

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

      this.nodeIDToNodeObjectMap[moduleObject['id']] = moduleObject

      this.nodeIDToVuexObjectMap[moduleObject['id']] = {
        name: key,
        type: 'modules',
        itemChildrenLength: moduleObject['children'].length,
        parentNodeId: moduleObject['id'],
        referencedByIds: [],
        parameters: value, //TODO: check this
      }
    }

    //TODO: substitute Vuex object map with this if it works
    //console.log('MODULES OBJECT ID: ' + modulesObject['id'])
    //console.log('MODULES OBJECT: ' + JSON.stringify(modulesObject))
    this.nodeIDToNodeObjectMap[modulesObject['id']] = modulesObject

    this.nodeIDToVuexObjectMap[modulesObject['id']] = {
      name: 'Modules',
      type: 'mods',
      itemChildrenLength: modulesObject['children'].length,
      referencedByIds: [],
      parameters: {},
    }
    //console.log('MODULES OBJECT' + JSON.stringify(modulesObject))
    //this.items = Object.values(modulesObject)
    //this.items[0] = modulesObject
    //console.log(this.items[0])
    //console.log(this.pera)
    //this.items = JSON.stringify(modulesObject)
    this.globalModulesObject = modulesObject
  }

  public parsePSets(psetData: any) {
    //console.log(psetData)
    let psetsObject: NodeObject = {
      id: ++this.idCounter,
      name: 'PSets',
      type: 'psets',
      globalType: 'node',
      children: [],
      parentNodeId: 0,
      referencedByIds: [],
      //parameters: psetData,
      iconType: '',
      iconColor: '',
      value: '',
    }
    //this.nodeIds.push(this.idCounter)

    //let psetsIdCounter = this.idCounter

    for (const [key, value] of Object.entries(psetData)) {
      //loop over sequnces - create new Sequence object and add it to children of the seqs
      //console.log('NAME: ' + key)
      let psetObject: NodeObject = {
        id: ++this.idCounter,
        name: key,
        type: 'pset',
        globalType: 'node',
        children: [],
        parentNodeId: psetsObject['id'],
        referencedByIds: [],
        //parameters: value,
        iconType: 'pset',
        iconColor: '',
        value: '',
        //parameters: value,
      }
      // this.nodeIds.push(this.idCounter)

      //let psetIdCounter = this.idCounter

      //console.log(`${key}`)
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(Object(value))) {
        //loop over pset entries
        //if (key == 'HLTPSetPixelLessStepTrajectoryFilter') {
        //console.log(`${key1}, ${value1}`)
        //}
        let nestedPSetObject: NodeObject = {} as NodeObject
        //this.nodeIds.push(this.idCounter)
        nestedPSetObject['id'] = ++this.idCounter
        //console.log(`${key1}, ${value1}`)
        //if (key1 === 'para_name') {
        // eslint-disable-next-line no-unused-vars
        for (const [key2, value2] of Object.entries(Object(value1))) {
          //aviod para_name level
          //console.log('ANYTHING')
          //console.log(`${key2}, ${value2}`)
          if (key2 === 'type') nestedPSetObject['type'] = value2 as string
          else if (key2 === 'value') {
            if (
              nestedPSetObject['type'] == 'cms.VPSet' ||
              nestedPSetObject['type'] == 'cms.PSet'
            ) {
              nestedPSetObject['name'] = key1
              nestedPSetObject['globalType'] = 'parameter'
              nestedPSetObject['children'] = []

              this.buildRecursiveVPSetObject(
                nestedPSetObject,
                value2,
                psetObject['id']
              )
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
          nestedPSetObject['parentNodeId'] = psetObject['id'] //TODO: who's parent?
          nestedPSetObject['referencedByIds'] = []
          nestedPSetObject['iconType'] = ''
          nestedPSetObject['iconColor'] = ''

          this.nodeIDToNodeObjectMap[nestedPSetObject['id']] = nestedPSetObject
          //nestedModuleObject['name'] = nestedModuleObject['value']
          psetObject['children'].push(nestedPSetObject)
        }
      }
      psetsObject['children'].push(psetObject)

      this.nodeIDToNodeObjectMap[psetObject['id']] = psetObject

      this.nodeIDToVuexObjectMap[psetObject['id']] = {
        name: key,
        type: 'pset',
        itemChildrenLength: psetObject['children'].length,
        parentNodeId: psetObject['id'],
        referencedByIds: [],
        parameters: value, //TODO: check this
      }
    }
    this.nodeIDToNodeObjectMap[psetsObject['id']] = psetsObject

    this.nodeIDToVuexObjectMap[psetsObject['id']] = {
      name: 'PSets',
      type: 'psets',
      itemChildrenLength: psetsObject['children'].length,
      referencedByIds: [],
      parameters: {},
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
      //console.log('EVO GA: ' + JSON.stringify(this.nodeIDToNodeObjectMap[3818]))
    } else if (name == 'psets') {
      await this.$store.dispatch('pset/fetchPSets', {
        fromFile: fromFile,
        fileData: fileData,
      })
      /*    console.log(
        'EVO GA 1: ' + JSON.stringify(this.nodeIDToNodeObjectMap[3818])
      ) */

      this.parsePSets(this.getPSets)
      /*    console.log(
        'EVO GA 2: ' + JSON.stringify(this.nodeIDToNodeObjectMap[3818])
      ) */

      //console.log('AFTER PSETS: ' + this.nodeIds)
      //initilaize node id object map so all components can get name fast from the node id
      await this.$store.dispatch(
        'createNodeIDToVuexObjectMap',
        this.nodeIDToVuexObjectMap
      )

      //initilaize id counter in the store so other components can get/modify it
      await this.$store.dispatch('setInitialIDCounter', this.idCounter)
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
    /*
    //this.getOpen(itemType, itemName, itemId, itemChildren.length)
    //let index = this.checkOpen(itemName) //close node if it's already open
    //console.log('FETCH')
    //console.log('NODE ID: ' + itemId)
    console.log('OPEN ' + this.open)
    console.log('ACTIVE ' + this.active)
    //@ts-ignore
    //console.log('REF: ' + this.$refs[itemId].innerHTML)
    //console.log('FETCH 1 TRIGGERED')

    /*   console.log(
      'this.getNodeIDToVuexObjectMap:' + JSON.stringify(this.getNodeIDToVuexObjectMap)
    ) */
    /* console.log(
      'this.getNodeIDToVuexObjectMap[itemId]' + this.getNodeIDToVuexObjectMap[itemId]
    ) */
    //TODO: leaf nodes for now are not inserted in object map
    if (this.getNodeIDToVuexObjectMap[itemId] == undefined) return
    //if (this.getNodeIDToVuexObjectMap[itemId].type == undefined) return

    //console.log('SELECTED NODE TYPE: ' + this.getNodeIDToVuexObjectMap[itemId].type)

    let itemType = this.getNodeIDToVuexObjectMap[itemId].type

    if (itemType === 'sequences') {
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
      //console.log('SPECIAL CASE!')
      //console.log(itemChildren.length)
      await this.$store.dispatch('setSelectedNodeViaID', {
        selectedNodeId: itemId,
      })
    }
    //if (index == -1)
    //open only if it is not already open
    //this.openNodes = ['Modules', 'hltFEDSelector']
  }

  public addNode(nodeObject: any) {
    console.log('NODE OBJECT TO ADD: ' + JSON.stringify(nodeObject))

    if (nodeObject.type == 'sequences') {
      this.globalSequencesObject['children'].push(nodeObject)
    }
  }

  public updateNodeName(nodeId: number, newNodeName: string) {
    console.log('NODE ID: ' + nodeId)
    console.log('NEW NODE NAME: ' + newNodeName)
    console.log('ITEM: ' + JSON.stringify(this.items[0]))
  }

  public removeNode() {}

  public showRightClickMenu(e: any, itemType: string, itemId: number): void {
    e.preventDefault()
    //console.log('RIGHT CLICK ITEM TYPE: ' + itemType)
    this.rightClickNodeType = itemType
    this.rightClickNodeId = itemId
    this.showMenu = false
    this.x = e.clientX
    this.y = e.clientY
    this.$nextTick(() => {
      this.showMenu = true
    })
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

    //console.log(this.$refs.treeReference)
    //@ts-ignore
    //console.log(this.$refs.treeReference.nodes[1].vnode.$el)
    //@ts-ignore
    //this.$vuetify.goTo(0, {
    //@ts-ignore
    // container: this.$refs.treeReference.nodes[1].vnode.$el,
    //})

    this.nodeIDToNodeObjectMap[1].name = 'PERA'

    //console.log('OPENNNNN: ' + this.open)
  }

  //Very important function, basically decides which node is clicked upon and gets all info about it
  public updateOpenNodes(array: any) {
    //console.log('THIS OPEN BEFORE: ' + this.open)
    let difference: number = parseInt(
      this.open
        .filter((x) => !array.includes(x))
        .concat(array.filter((x) => !this.open.includes(x)))
    )
    //console.log('DIFFERENCE:' + difference)
    //console.log('DIFFERENCE TYPE: ' + typeof difference)
    if (Object.keys(this.getNodeIDToVuexObjectMap).length !== 0)
      this.fetchNodeById(difference)
    this.open = array
    //console.log('THIS OPEN AFTER: ' + array)
  }

  public updateActiveNodes(array: any) {
    //console.log('THIS ACTIVE: ' + array)
    if (Object.keys(this.getNodeIDToVuexObjectMap).length !== 0)
      //if map is initialized
      this.fetchNodeById(array[0])
    this.active = array
  }

  async fetchAllGroups() {
    Promise.all([
      //set new object into main map
      this.fetchGroup('seqs', false, null),
      this.fetchGroup('paths', false, null),
      this.fetchGroup('mods', false, null),
      this.fetchGroup('psets', false, null),
    ]).finally(async () => {
      await this.$store.dispatch(
        'createNodeIDToNodeObjectMap',
        this.nodeIDToNodeObjectMap
      ),
        await this.$store.dispatch('createObjectReferences')
    })
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
    //console.log('UPDATED')
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
.v-text-field {
  width: 200px;
}
.center {
  display: flex;
  align-items: center;
}
</style>
