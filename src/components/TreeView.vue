<template>
  <v-skeleton-loader
    v-if="!getConfigLoaded"
    :boilerplate="false"
    :dark="getDarkMode"
    type="avatar, card-heading@10"
  ></v-skeleton-loader>
  <div v-else>
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
import TreeParser from '@/components/helpers/TreeParser.ts'

//const axios = require('axios').default

@Component({
  computed: {
    ...mapGetters({
      getConfiguration: 'getConfiguration',
      getSelectedNodeType: 'getSelectedNodeType',
      getSelectedNodeName: 'getSelectedNodeName',
      getSelectedNodeId: 'getSelectedNodeId',
      getNodeIDToNodeObjectMap: 'getNodeIDToNodeObjectMap',
      getOpenNodeIds: 'getOpenNodeIds',
      getForcedOpenNodeIds: 'getForcedOpenNodeIds',
      getForcedActiveNodeId: 'getForcedActiveNodeId',
      getOpenFileContent: 'getOpenFileContent',
      getDarkMode: 'getDarkMode',
      getIDCounter: 'getIDCounter',
      getConfigLoaded: 'getConfigLoaded',
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
  private nodeIDToNodeObjectMap: Map<number, NodeObject> = new Map<
    number,
    NodeObject
  >() //ID to Node Object map
  private open: any = [1]
  private active: any = []
  private forcedActive: any = []

  private getOpenFileContent!: any[]
  private getConfiguration!: any[] // are assigned via mapState

  private getSelectedNodeName!: string
  private getSelectedNodeType!: string
  private getSelectedNodeId!: number
  private getNodeIDToNodeObjectMap!: any

  private getOpenNodeIds!: any
  private getForcedOpenNodeIds!: any

  private globalSequencesObject: Object = {}
  private globalPathsObject: Object = {}
  private globalModulesObject: Object = {}
  private globalPSetsObject: Object = {}
  private globalTasksObject: Object = {}
  private globalESProducersObject: Object = {}
  private globalESSourcesObject: Object = {}

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
    task: 'mdi-sort-reverse-variant',
    esproducer: 'mdi-hammer-wrench',
    essource: 'mdi-source-merge',
  }

  get items() {
    return [
      this.globalSequencesObject,
      this.globalPathsObject,
      this.globalModulesObject,
      this.globalPSetsObject,
      this.globalTasksObject,
      this.globalESProducersObject,
      this.globalESSourcesObject,
    ]
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
    //console.log('THIS ACTIVE: ' + array)
    let difference: number = parseInt(
      this.active
        .filter((x) => !array.includes(x))
        .concat(array.filter((x) => !this.active.includes(x)))
    )
    if (array.length != 0) difference = array[0]
    //console.log('DIFFERENCE: ' + difference)
    if (Object.keys(this.getNodeIDToNodeObjectMap).length !== 0)
      //if map is initialized
      this.fetchNodeById(difference)
    this.active = array
  }

  async fetchConfiguration() {
    //reset maps and ID counters
    this.nodeIDToNodeObjectMap = new Map<number, NodeObject>()
    this.idCounter = 1

    this.$store.dispatch('setConfigLoaded', false)

    Promise.all([
      await this.$store.dispatch('fetchConfiguration', {
        fromFile: false,
        fileData: null,
      }), // note the "await"
    ]).finally(async () => {
      this.idCounter = TreeParser.parseSequences(
        this.getConfiguration['seqs'],
        this.globalSequencesObject,
        this.nodeIDToNodeObjectMap,
        this.idCounter
      )
      this.idCounter = TreeParser.parsePaths(
        this.getConfiguration['paths'],
        this.globalPathsObject,
        this.nodeIDToNodeObjectMap,
        this.idCounter
      )
      this.idCounter = TreeParser.parseModules(
        this.getConfiguration['mods'],
        this.globalModulesObject,
        this.nodeIDToNodeObjectMap,
        this.idCounter
      )
      this.idCounter = TreeParser.parsePSets(
        this.getConfiguration['psets'],
        this.globalPSetsObject,
        this.nodeIDToNodeObjectMap,
        this.idCounter
      )
      this.idCounter = TreeParser.parseTasks(
        this.getConfiguration['tasks'],
        this.globalTasksObject,
        this.nodeIDToNodeObjectMap,
        this.idCounter
      )

      this.idCounter = TreeParser.parseESProducers(
        this.getConfiguration['esprods'],
        this.globalESProducersObject,
        this.nodeIDToNodeObjectMap,
        this.idCounter
      )

      this.idCounter = TreeParser.parseESSources(
        this.getConfiguration['essources'],
        this.globalESSourcesObject,
        this.nodeIDToNodeObjectMap,
        this.idCounter
      )

      this.$store.dispatch(
        'createNodeIDToNodeObjectMap',
        this.nodeIDToNodeObjectMap
      )

      //initilaize id counter in the store so other components can get/modify it
      this.$store.dispatch('setInitialIDCounter', this.idCounter)
      this.$store.dispatch('createObjectReferences')
      this.$store.dispatch('setConfigLoaded', true)
      this.$store.dispatch('setSnackBarText', {
        snackBarText: 'Configuration successfully loaded!',
        snackBarColor: 'green',
      })
    })
  }

  async fetchConfigurationFromFile(fileContent: any) {
    //reset maps and ID counters
    this.nodeIDToNodeObjectMap = new Map<number, NodeObject>()
    this.idCounter = 1

    this.$store.dispatch('setConfigLoaded', false)

    Promise.all([
      await this.$store.dispatch('fetchConfiguration', {
        fromFile: true,
        fileData: fileContent,
      }), // note the "await"
    ]).finally(async () => {
      this.idCounter = TreeParser.parseSequences(
        this.getConfiguration['seqs'],
        this.globalSequencesObject,
        this.nodeIDToNodeObjectMap,
        this.idCounter
      )
      this.idCounter = TreeParser.parsePaths(
        this.getConfiguration['paths'],
        this.globalPathsObject,
        this.nodeIDToNodeObjectMap,
        this.idCounter
      )
      this.idCounter = TreeParser.parseModules(
        this.getConfiguration['mods'],
        this.globalModulesObject,
        this.nodeIDToNodeObjectMap,
        this.idCounter
      )
      this.idCounter = TreeParser.parsePSets(
        this.getConfiguration['psets'],
        this.globalPSetsObject,
        this.nodeIDToNodeObjectMap,
        this.idCounter
      )
      this.idCounter = TreeParser.parseTasks(
        this.getConfiguration['tasks'],
        this.globalTasksObject,
        this.nodeIDToNodeObjectMap,
        this.idCounter
      )

      this.idCounter = TreeParser.parseESProducers(
        this.getConfiguration['esprods'],
        this.globalESProducersObject,
        this.nodeIDToNodeObjectMap,
        this.idCounter
      )

      this.$store.dispatch(
        'createNodeIDToNodeObjectMap',
        this.nodeIDToNodeObjectMap
      )

      //initilaize id counter in the store so other components can get/modify it
      this.$store.dispatch('setInitialIDCounter', this.idCounter)
      this.$store.dispatch('createObjectReferences')
      this.$store.dispatch('setConfigLoaded', true)
      this.$store.dispatch('setSnackBarText', {
        snackBarText: 'Configuration successfully loaded!',
        snackBarColor: 'green',
      })
    })
  }

  created() {
    // Make a request for config parts
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
