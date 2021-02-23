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
          <span
            class="param-value-style"
            v-if="
              item.globalType == 'parameter' &&
                item.paremeterJSONValue != Infinity
            "
          >
            {{ JSON.stringify(item.paremeterJSONValue) }}
          </span>
          <span v-if="item.referencedByIds && item.referencedByIds.length != 0">
            {{ '(' + item.referencedByIds.length + ')' }}
          </span>
          <span
            v-if="
              item.rootNodeId != item.id &&
                item.rootNodeId != -1 &&
                item.globalType != 'parameter'
            "
          >
            {{
              '(' +
                getNodeIDToNodeObjectMap[item.rootNodeId].referencedByIds
                  .length +
                ')'
            }}
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
// eslint-disable-next-line no-unused-vars
import Utils from '@/lib/utils.ts'

//const axios = require('axios').default

@Component({
  computed: {
    ...mapGetters({
      getSequences: 'sequence/getSequences',
      getSequenceByName: 'sequence/getSequenceByName',
      getSequenceById: 'sequence/getSequenceById',
      getPaths: 'path/getPaths',
      getModules: 'module/getModules',
      getConfiguration: 'getConfiguration',
      getSelectedNodeType: 'getSelectedNodeType',
      getSelectedNodeName: 'getSelectedNodeName',
      getSelectedNodeId: 'getSelectedNodeId',
      //getNodeIDToVuexObjectMap: 'getNodeIDToVuexObjectMap',
      getNodeIDToNodeObjectMap: 'getNodeIDToNodeObjectMap',
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
    this.fetchConfigurationFromFile(val)
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
  // eslint-disable-next-line no-unused-vars
  onIDCounterChanged(val: any, oldVal: any) {
    /*    console.log('getIDCounter VAL:' + val)
    console.log('getIDCounter OLDVAL: ' + oldVal) */
  }

  //private openNodes: any = []
  //private openNodeIds: any = []
  //private nodeIds: any = []
  //private nodeIDToVuexObjectMap: any = {} //ID to Vuex Object map
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
  private getConfiguration!: any[] // are assigned via mapState

  private getSelectedNodeName!: string
  private getSelectedNodeType!: string
  private getSelectedNodeId!: number
  private getNodeIDToNodeObjectMap!: any
  //private getNodeIDToVuexObjectMap!: any //maybe unecessary since we have map as variable
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
      rootNodeId: 1,
      referencedByIds: [],
      //parameters: sequenceData,
      iconType: '',
      iconColor: '',
      paremeterJSONValue: Infinity,
      ctype: '',
      ptype: '',
    }
    //this.nodeIds.push(1)
    //console.log(sequencesObject)
    for (const [key, value] of Object.entries(sequenceData)) {
      //loop over sequnces - create new Sequence object and add it to children of the seqs
      let sequenceObject: NodeObject = {
        id: ++this.idCounter,
        name: key,
        type: 'sequences',
        globalType: 'sequenceNode',
        children: [],
        parentNodeId: 1,
        rootNodeId: this.idCounter, //for the root nodes, rootNodeId = itself
        referencedByIds: [],
        iconType: 'sequence',
        iconColor: 'red',
        paremeterJSONValue: Infinity,
        ctype: '',
        ptype: '',
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
            globalType: 'nestedModuleNode',
            children: [],
            parentNodeId: sequenceObject['id'],
            rootNodeId: -1, //for the leaf nodes, rootNodeId will be calculated with references
            referencedByIds: [],
            iconType: 'module',
            iconColor: '',
            paremeterJSONValue: Infinity,
            ctype: '',
            ptype: '',
          }
          //TODO: substitute Vuex object map with this if it works
          this.nodeIDToNodeObjectMap[this.idCounter] = nestedSequenceObject
          sequenceObject['children'].push(nestedSequenceObject)

          /*   this.nodeIDToVuexObjectMap[this.idCounter] = {
            name: Object(value1)[1],
            type: 'modules',
            itemChildrenLength: 0,
            parentNodeId: sequenceObject['id'],
            referencedByIds: [],
            parameters: value1,
          } */
        } else if (Object(value1)[0] === 'sequences') {
          //console.log('SEQUENCE')
          let nestedSequenceObject: NodeObject = {
            id: ++this.idCounter,
            name: Object(value1)[1],
            type: 'sequences',
            globalType: 'nestedSequenceNode',
            children: [],
            parentNodeId: sequenceObject['id'],
            rootNodeId: -1, //for the leaf nodes, rootNodeId will be calculated with references
            referencedByIds: [],
            iconType: 'sequence',
            iconColor: 'red',
            paremeterJSONValue: Infinity,
            ctype: '',
            ptype: '',
          }

          //TODO: substitute Vuex object map with this if it works
          this.nodeIDToNodeObjectMap[this.idCounter] = nestedSequenceObject
          sequenceObject['children'].push(nestedSequenceObject)

          /*           this.nodeIDToVuexObjectMap[this.idCounter] = {
            name: Object(value1)[1],
            type: 'sequences',
            itemChildrenLength: 0,
            parentNodeId: sequenceObject['id'],
            referencedByIds: [],
            parameters: value1,
          } */
        }
      }
      //TODO: substitute Vuex object map with this if it works
      this.nodeIDToNodeObjectMap[sequenceObject['id']] = sequenceObject

      /*       this.nodeIDToVuexObjectMap[sequenceObject['id']] = {
        name: key,
        type: 'sequences',
        itemChildrenLength: sequenceObject['children'].length,
        parentNodeId: 1,
        referencedByIds: [],
        parameters: value,
      } */
      sequencesObject['children'].push(sequenceObject)
    }
    //TODO: substitute Vuex object map with this if it works
    this.nodeIDToNodeObjectMap[1] = sequencesObject

    /*     this.nodeIDToVuexObjectMap[1] = {
      name: 'Sequences',
      type: 'seqs',
      itemChildrenLength: sequencesObject['children'].length,
      referencedByIds: [],
      parameters: {},
    } */
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
      type: 'pts',
      globalType: 'rootNode',
      children: [],
      parentNodeId: 0,
      rootNodeId: this.idCounter,
      referencedByIds: [],
      //parameters: pathData,
      iconType: '',
      iconColor: '',
      paremeterJSONValue: Infinity,
      ctype: '',
      ptype: '',
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
        globalType: 'pathNode',
        children: [],
        parentNodeId: pathsObject['id'],
        rootNodeId: this.idCounter, //for the root nodes, rootNodeId = itself
        referencedByIds: [],
        iconType: 'path',
        iconColor: 'green',
        paremeterJSONValue: Infinity,
        ctype: '',
        ptype: '',
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
            globalType: 'nestedModuleNode',
            children: [],
            parentNodeId: pathObject['id'],
            rootNodeId: -1, //for the leaf nodes, rootNodeId will be calculated with references
            referencedByIds: [],
            //nestedPathObject['parameters'] = value1
            iconType: 'module',
            iconColor: '',
            paremeterJSONValue: Infinity,
            ctype: '',
            ptype: '',
          }

          //TODO: substitute Vuex object map with this if it works
          this.nodeIDToNodeObjectMap[this.idCounter] = nestedPathObject
          pathObject['children'].push(nestedPathObject)

          /*          this.nodeIDToVuexObjectMap[this.idCounter] = {
            name: Object(value1)[1],
            type: 'modules',
            itemChildrenLength: 0,
            parentNodeId: pathObject['id'],
            referencedByIds: [],
            parameters: value1,
          } */
        } else if (Object(value1)[0] === 'sequences') {
          //console.log('SEQUENCE')
          let nestedPathObject: NodeObject = {
            id: ++this.idCounter,
            name: Object(value1)[1],
            type: 'sequences',
            globalType: 'nestedSequenceNode',
            children: [],
            parentNodeId: pathObject['id'],
            rootNodeId: -1, //for the leaf nodes, rootNodeId will be calculated with references
            referencedByIds: [],
            //nestedPathObject['parameters'] = value1
            iconType: 'sequence',
            iconColor: 'red',
            paremeterJSONValue: Infinity,
            ctype: '',
            ptype: '',
          }
          //TODO: substitute Vuex object map with this if it works
          this.nodeIDToNodeObjectMap[this.idCounter] = nestedPathObject
          pathObject['children'].push(nestedPathObject)

          /*           this.nodeIDToVuexObjectMap[this.idCounter] = {
            name: Object(value1)[1],
            type: 'sequences',
            itemChildrenLength: 0,
            parentNodeId: pathObject['id'],
            referencedByIds: [],
            parameters: value1,
          } */
        }
      }
      //TODO: substitute Vuex object map with this if it works
      this.nodeIDToNodeObjectMap[pathObject['id']] = pathObject

      /*       this.nodeIDToVuexObjectMap[pathObject['id']] = {
        name: key,
        type: 'paths',
        itemChildrenLength: pathObject['children'].length,
        parentNodeId: pathsObject['id'],
        referencedByIds: [],
        parameters: value,
      } */
      pathsObject['children'].push(pathObject)
    }
    //TODO: substitute Vuex object map with this if it works
    this.nodeIDToNodeObjectMap[pathsObject['id']] = pathsObject

    /*     this.nodeIDToVuexObjectMap[pathsObject['id']] = {
      name: 'Paths',
      type: 'pts',
      itemChildrenLength: pathsObject['children'].length,
      referencedByIds: [],
      parameters: {},
    } */
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
        nestedNoNamePSetObject['rootNodeId'] = -1 //TODO if this can be referenced at all?
        nestedNoNamePSetObject['referencedByIds'] = []
        nestedNoNamePSetObject['iconType'] = ''
        nestedNoNamePSetObject['iconColor'] = ''
        nestedNoNamePSetObject['paremeterJSONValue'] = Infinity

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
              nestedVPSetObject['type'] == 'cms.PSet' ||
              nestedVPSetObject['type'] == 'cms.untracked.PSet' ||
              nestedVPSetObject['type'] == 'cms.untracked.VPSet'
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
              nestedVPSetObject['paremeterJSONValue'] = value2
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
          nestedVPSetObject['rootNodeId'] = -1 //TODO: can this bve referenced at all?
          nestedVPSetObject['parentNodeId'] = vpSetObject['id']
          vpSetObject['children'].push(nestedVPSetObject)
        } else {
          nestedVPSetObject['rootNodeId'] = -1 //TODO: can this bve referenced at all?
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
      rootNodeId: this.idCounter,
      referencedByIds: [],
      //parameters: moduleData,
      iconType: '',
      iconColor: '',
      paremeterJSONValue: Infinity,
      ctype: '',
      ptype: '',
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
        globalType: 'moduleNode',
        children: [],
        parentNodeId: modulesObject['id'],
        rootNodeId: this.idCounter, //for the root nodes, rootNodeId = itself
        referencedByIds: [],
        iconType: 'module',
        iconColor: '',
        paremeterJSONValue: Infinity,
        ctype: '',
        ptype: '',
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
                  nestedParameterObject['type'] == 'cms.PSet' ||
                  nestedParameterObject['type'] == 'cms.untracked.PSet' ||
                  nestedParameterObject['type'] == 'cms.untracked.VPSet'
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

                  /*  if (nestedParameterObject['name'] == 'ErrorList = ')
                    console.log('ErrorList INTRINSIC TYPE in: ' + typeof value3) */
                  //TODO: SEE WHY VINT32 is a STRING!!!!
                  nestedParameterObject['paremeterJSONValue'] = value3
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
              //console.log(nestedParameterObject)
            }
            nestedParameterObject['parentNodeId'] = moduleObject['id']
            nestedParameterObject['rootNodeId'] = -1 //TODO: can this be referenced at all?
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
          moduleObject['ctype'] = value1 as string
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

      /*      this.nodeIDToVuexObjectMap[moduleObject['id']] = {
        name: key,
        type: 'modules',
        itemChildrenLength: moduleObject['children'].length,
        parentNodeId: moduleObject['id'],
        referencedByIds: [],
        parameters: value, //TODO: check this
      } */
    }

    //TODO: substitute Vuex object map with this if it works
    //console.log('MODULES OBJECT ID: ' + modulesObject['id'])
    //console.log('MODULES OBJECT: ' + JSON.stringify(modulesObject))
    this.nodeIDToNodeObjectMap[modulesObject['id']] = modulesObject

    /*     this.nodeIDToVuexObjectMap[modulesObject['id']] = {
      name: 'Modules',
      type: 'mods',
      itemChildrenLength: modulesObject['children'].length,
      referencedByIds: [],
      parameters: {},
    } */
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
      globalType: 'rootNode',
      children: [],
      parentNodeId: 0,
      rootNodeId: this.idCounter,
      referencedByIds: [],
      //parameters: psetData,
      iconType: '',
      iconColor: '',
      paremeterJSONValue: Infinity,
      ctype: '',
      ptype: '',
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
        globalType: 'psetNode',
        children: [],
        parentNodeId: psetsObject['id'],
        rootNodeId: this.idCounter,
        referencedByIds: [],
        iconType: 'pset',
        iconColor: '',
        paremeterJSONValue: Infinity,
        ctype: '',
        ptype: '',
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
              nestedPSetObject['type'] == 'cms.PSet' ||
              nestedPSetObject['type'] == 'cms.untracked.PSet' ||
              nestedPSetObject['type'] == 'cms.untracked.VPSet'
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
              nestedPSetObject['paremeterJSONValue'] = value2
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
          psetObject['children'].push(nestedPSetObject)
        }
      }
      psetsObject['children'].push(psetObject)

      this.nodeIDToNodeObjectMap[psetObject['id']] = psetObject

      /*       this.nodeIDToVuexObjectMap[psetObject['id']] = {
        name: key,
        type: 'pset',
        itemChildrenLength: psetObject['children'].length,
        parentNodeId: psetObject['id'],
        referencedByIds: [],
        parameters: value, //TODO: check this
      } */
    }
    this.nodeIDToNodeObjectMap[psetsObject['id']] = psetsObject

    /*     this.nodeIDToVuexObjectMap[psetsObject['id']] = {
      name: 'PSets',
      type: 'psets',
      itemChildrenLength: psetsObject['children'].length,
      referencedByIds: [],
      parameters: {},
    } */
    //console.log(psetsObject)
    //this.items = Object.values(psetsObject)
    //this.items[0] = psetsObject
    //console.log(this.items[0])
    //console.log(this.pera)
    //this.items = JSON.stringify(psetsObject)
    this.globalPSetsObject = psetsObject
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
    //TODO: leaf nodes for now are not inserted in object map
    if (
      this.getNodeIDToNodeObjectMap[itemId] == undefined ||
      this.getNodeIDToNodeObjectMap[itemId].globalType == 'parameter'
    )
      return
    /*    console.log(
      'this.getNodeIDToNodeObjectMap[itemId].type:' +
        this.getNodeIDToNodeObjectMap[itemId].type
    ) */
    if (this.getNodeIDToNodeObjectMap[itemId].children.length == 0)
      itemId = this.getNodeIDToNodeObjectMap[itemId].rootNodeId

    await this.$store.dispatch('setSelectedNodeViaID', {
      selectedNodeId: itemId,
      forceOpenNode: false,
    })
  }

  public addNode(nodeObject: any) {
    console.log('NODE OBJECT TO ADD: ' + JSON.stringify(nodeObject))

    /*     if (nodeObject.type == 'sequences') {
      this.globalSequencesObject['children'].push(nodeObject)
    } */
  }

  public updateNodeName(nodeId: number, newNodeName: string) {
    console.log('NODE ID: ' + nodeId)
    console.log('NEW NODE NAME: ' + newNodeName)
    //console.log('ITEM: ' + JSON.stringify(this.items[0]))
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
    /*  this.$vuetify.goTo(0, {
      //@ts-ignore
      container: this.$refs.treeReference.nodes[2].vnode.$el,
    }) */
    //this.nodeIDToNodeObjectMap[1].name = 'PERA'
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
    /*  console.log('DIFFERENCE:' + difference)
    console.log('DIFFERENCE TYPE: ' + typeof difference) */
    if (Object.keys(this.getNodeIDToNodeObjectMap).length !== 0)
      this.fetchNodeById(difference)
    this.open = array
    //console.log('THIS OPEN AFTER: ' + array)
  }

  public updateActiveNodes(array: any) {
    //console.log('THIS ACTIVE: ' + this.active)
    let difference: number = parseInt(
      this.active
        .filter((x) => !array.includes(x))
        .concat(array.filter((x) => !this.active.includes(x)))
    )
    if (Object.keys(this.getNodeIDToNodeObjectMap).length !== 0)
      //if map is initialized
      this.fetchNodeById(difference)
    this.active = array
  }

  async fetchConfiguration() {
    //reset maps and ID counters
    this.nodeIDToNodeObjectMap = new Map<number, NodeObject>()
    //this.nodeIDToVuexObjectMap = {}
    this.idCounter = 1
    Promise.all([
      await this.$store.dispatch('fetchConfiguration', {
        fromFile: false,
        fileData: null,
      }), // note the "await"

      //TODO: parse all groups from main config
    ]).finally(async () => {
      this.parseSequences(this.getConfiguration['seqs'])
      this.parsePaths(this.getConfiguration['paths'])
      this.parseModules(this.getConfiguration['mods'])
      this.parsePSets(this.getConfiguration['psets'])

      this.$store.dispatch(
        'createNodeIDToNodeObjectMap',
        this.nodeIDToNodeObjectMap
      )
      /*    this.$store.dispatch(
        'createNodeIDToVuexObjectMap',
        this.nodeIDToVuexObjectMap
      ) */
      //initilaize id counter in the store so other components can get/modify it
      this.$store.dispatch('setInitialIDCounter', this.idCounter)
      this.$store.dispatch('createObjectReferences')
      this.$store.dispatch('setSnackBarText', {
        snackBarText: 'Configuration successfully loaded!',
        snackBarColor: 'green',
      })
    })
  }

  async fetchConfigurationFromFile(fileContent: any) {
    //reset maps and ID counters
    this.nodeIDToNodeObjectMap = new Map<number, NodeObject>()
    //this.nodeIDToVuexObjectMap = {}
    this.idCounter = 1

    Promise.all([
      await this.$store.dispatch('fetchConfiguration', {
        fromFile: true,
        fileData: fileContent,
      }), // note the "await"
    ]).finally(async () => {
      this.parseSequences(this.getConfiguration['seqs'])
      this.parsePaths(this.getConfiguration['paths'])
      this.parseModules(this.getConfiguration['mods'])
      this.parsePSets(this.getConfiguration['psets'])

      this.$store.dispatch(
        'createNodeIDToNodeObjectMap',
        this.nodeIDToNodeObjectMap
      )
      /*    this.$store.dispatch(
        'createNodeIDToVuexObjectMap',
        this.nodeIDToVuexObjectMap
      ) */
      //initilaize id counter in the store so other components can get/modify it
      this.$store.dispatch('setInitialIDCounter', this.idCounter)
      this.$store.dispatch('createObjectReferences')
      this.$store.dispatch('setSnackBarText', {
        snackBarText: 'Configuration successfully loaded!',
        snackBarColor: 'green',
      })
    })
  }

  created() {
    // Make a request for config parts
    //this.nodeIds = []
    this.fetchConfiguration()

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
        /*  console.log(
          'this.$refs.treeReference' + this.$refs.treeReference.nodes[forced].vnode
        ) */
        //console.log('FORCEEEED: ' + forced)
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
  max-width: 500px;
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
.v-treeview-node__content,
.v-treeview-node__label {
  flex-shrink: 1;
  word-break: break-all;
}
.v-treeview-node__root {
  height: auto;
  width: auto;
}
</style>
