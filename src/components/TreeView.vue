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
            {{ JSON.stringify(item.paremeterJSONValue, null, ' ') }}
          </span>
          <span v-if="item.referencedByIds && item.referencedByIds.length != 0">
            {{ '(' + item.referencedByIds.length + ')' }}
          </span>
          <!-- TODO: FIX THIS -->
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
    />
  </div>
</template>

<script lang="ts">
import TreeViewRightClick from './TreeViewRightClick.vue'

import { Component, Vue, Watch } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
// eslint-disable-next-line no-unused-vars
import { NodeObject } from '../types'
import TreeParser from './helpers/TreeParser'
// eslint-disable-next-line no-unused-vars
//import Utils from '@/lib/utils.ts'
//import TreeParser from '@/components/helpers/TreeParser.ts'
//import sizeof from 'object-sizeof'

//const axios = require('axios').default

@Component({
  computed: {
    ...mapGetters({
      getConfiguration: 'getConfiguration',
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
  private nodeIDToNodeObjectMap!: Object //ID to Node Object map
  private topLevelNodeTypeIds!: Object //top level node IDs
  private nonTopLevelNodeNameIdMap!: Object //nested node name - array of IDs map
  private open: any = [1]
  private active: any = []
  private forcedActive: any = []

  private getOpenFileContent!: any[]
  private getConfiguration!: any[] // are assigned via mapState

  private getNodeIDToNodeObjectMap!: any

  private getOpenNodeIds!: any
  private getForcedOpenNodeIds!: any
  private getIDCounter!: number

  private sequencesId!: number
  private pathsId!: number
  private modulesId!: number
  private psetsId!: number
  private tasksId!: number
  private esProducersId!: number
  private esSourcesId!: number
  private servicesId!: number

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
    service: 'mdi-room-service',
  }

  get items() {
    return [
      this.getNodeIDToNodeObjectMap[this.sequencesId],
      this.getNodeIDToNodeObjectMap[this.pathsId],
      this.getNodeIDToNodeObjectMap[this.modulesId],
      this.getNodeIDToNodeObjectMap[this.psetsId],
      this.getNodeIDToNodeObjectMap[this.tasksId],
      this.getNodeIDToNodeObjectMap[this.esProducersId],
      this.getNodeIDToNodeObjectMap[this.esSourcesId],
      this.getNodeIDToNodeObjectMap[this.servicesId],
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
    /*     console.log(
      'this.getNodeIDToNodeObjectMap[itemId].children: ' +
        this.getNodeIDToNodeObjectMap[itemId].children
    ) */
    console.log('ITEM ID: ' + itemId)
    if (this.getNodeIDToNodeObjectMap[itemId].children.length == 0) {
      itemId = this.getNodeIDToNodeObjectMap[itemId].rootNodeId
      console.log('ROOT NODE ID: ' + itemId)

      await this.$store.dispatch('setSelectedNodeViaID', {
        selectedNodeId: itemId,
        forceOpenNode: false,
        forceOpenReferenceIds: true,
      })
    }
    //console.log('fetchNodeById CALLED')
    else
      await this.$store.dispatch('setSelectedNodeViaID', {
        selectedNodeId: itemId,
        forceOpenNode: false,
        forceOpenReferenceIds: false,
      })
  }

  public showRightClickMenu(e: any, itemType: string, itemId: number): void {
    e.preventDefault()
    //console.log('RIGHT CLICK ITEM TYPE: ' + itemType)
    this.rightClickNodeType = itemType
    this.rightClickNodeId = itemId
    this.showMenu = false
    //console.log('SET FALSE')
    this.x = e.clientX
    this.y = e.clientY
    this.$nextTick(() => {
      this.showMenu = true
      //console.log('SET TRUE')
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
    /*     console.log(
      'this.nodeIDToNodeObjectMap: ' +
        JSON.stringify(this.nodeIDToNodeObjectMap)
    ) */
    //this.nodeIDToNodeObjectMap[1]['name'] = 'PERA'
    //this.nodeIDToNodeObjectMap[this.pathsId]['name'] = 'ZDERA'
    this.$store.dispatch('testAction', null)
    /*    console.log(
      'this.nodeIDToNodeObjectMap: ' +
        JSON.stringify(this.nodeIDToNodeObjectMap)
    ) */
  }

  //Very important function, basically decides which node is clicked upon and gets all info about it
  public updateOpenNodes(array: any) {
    console.log('THIS OPEN BEFORE: ' + this.open)
    console.log('array BEFORE: ' + array)
    let difference: number = parseInt(
      this.open
        .filter((x) => !array.includes(x))
        .concat(array.filter((x) => !this.open.includes(x)))
    )

    if (Object.keys(this.getNodeIDToNodeObjectMap).length !== 0) {
      console.log('updateOpenNodes DIFFERENCE:' + difference)
      this.fetchNodeById(difference)
      //console.log('updateOpenNodes DIFFERENCE TYPE: ' + typeof difference)
    }
    if (!isNaN(difference)) {
      if (this.open.indexOf(difference) == -1)
        if (array.indexOf(difference) == -1)
          //special case for forced references
          this.open = [...array, difference]
        else this.open = array
      else {
        console.log('DIFFERENCE INDEX: ' + this.open.indexOf(difference))
        this.open.splice(this.open.indexOf(difference), 1)
      }
    }
    console.log('THIS OPEN AFTER: ' + this.open)
  }

  public updateActiveNodes(array: any) {
    //console.log('THIS ACTIVE: ' + array)
    let difference: number = parseInt(
      this.active
        .filter((x) => !array.includes(x))
        .concat(array.filter((x) => !this.active.includes(x)))
    )
    if (array.length != 0) difference = array[0]
    if (Object.keys(this.getNodeIDToNodeObjectMap).length !== 0) {
      //if map is initialized
      console.log('updateActiveNodes DIFFERENCE: ' + difference)
      this.fetchNodeById(difference)
      /*       console.log('updateActiveNodes DIFFERENCE TYPE: ' + typeof difference)
       */
    }
    this.active = array
  }

  async fetchConfiguration() {
    //reset maps and ID counters
    this.nodeIDToNodeObjectMap = {}
    this.topLevelNodeTypeIds = {}
    this.nonTopLevelNodeNameIdMap = {}
    this.idCounter = 1

    let t0 = performance.now()
    this.$store.dispatch('setConfigLoaded', false)

    Promise.all([
      await this.$store.dispatch('fetchConfiguration', {
        fromFile: false,
        fileData: null,
      }), // note the "await"
    ]).finally(async () => {
      let ret = TreeParser.parseSequences(
        this.getConfiguration['seqs'],
        this.nodeIDToNodeObjectMap,
        this.topLevelNodeTypeIds,
        this.nonTopLevelNodeNameIdMap,
        this.idCounter
      )
      this.sequencesId = ret['sequencesId']
      this.idCounter = ret['idCounter']

      /*      console.log(
        'nonTopLevelNodeNameIdMap: ' +
          JSON.stringify(this.nonTopLevelNodeNameIdMap)
      ) */

      ret = TreeParser.parsePaths(
        this.getConfiguration['paths'],
        this.nodeIDToNodeObjectMap,
        this.topLevelNodeTypeIds,
        this.nonTopLevelNodeNameIdMap,
        this.idCounter
      )
      this.pathsId = ret['pathsId']
      this.idCounter = ret['idCounter']

      ret = TreeParser.parseModules(
        this.getConfiguration['mods'],
        this.nodeIDToNodeObjectMap,
        this.topLevelNodeTypeIds,
        this.nonTopLevelNodeNameIdMap,
        this.idCounter
      )
      this.modulesId = ret['modulesId']
      this.idCounter = ret['idCounter']

      ret = TreeParser.parsePSets(
        this.getConfiguration['psets'],
        this.nodeIDToNodeObjectMap,
        this.topLevelNodeTypeIds,
        this.nonTopLevelNodeNameIdMap,
        this.idCounter
      )
      this.psetsId = ret['psetsId']
      this.idCounter = ret['idCounter']

      ret = TreeParser.parseTasks(
        this.getConfiguration['tasks'],
        this.nodeIDToNodeObjectMap,
        this.topLevelNodeTypeIds,
        this.nonTopLevelNodeNameIdMap,
        this.idCounter
      )
      this.tasksId = ret['tasksId']
      this.idCounter = ret['idCounter']

      ret = TreeParser.parseESProducers(
        this.getConfiguration['esprods'],
        this.nodeIDToNodeObjectMap,
        this.topLevelNodeTypeIds,
        this.nonTopLevelNodeNameIdMap,
        this.idCounter
      )
      this.esProducersId = ret['esProducersId']
      this.idCounter = ret['idCounter']

      ret = TreeParser.parseESSources(
        this.getConfiguration['essources'],
        this.nodeIDToNodeObjectMap,
        this.topLevelNodeTypeIds,
        this.nonTopLevelNodeNameIdMap,
        this.idCounter
      )
      this.esSourcesId = ret['esSourcesId']
      this.idCounter = ret['idCounter']

      ret = TreeParser.parseServices(
        this.getConfiguration['services'],
        this.nodeIDToNodeObjectMap,
        this.topLevelNodeTypeIds,
        this.nonTopLevelNodeNameIdMap,
        this.idCounter
      )
      this.servicesId = ret['servicesId']
      this.idCounter = ret['idCounter']

      this.$store.dispatch(
        'createNodeIDToNodeObjectMap',
        this.nodeIDToNodeObjectMap
      )

      this.$store.dispatch(
        'createTopLevelNodeTypeIds',
        this.topLevelNodeTypeIds
      )

      this.$store.dispatch(
        'createNonTopLevelNodeNameIdMap',
        this.nonTopLevelNodeNameIdMap
      )

      //initilaize id counter in the store so other components can get/modify it
      this.$store.dispatch('setInitialIDCounter', this.idCounter)
      this.$store.dispatch('createObjectReferences')
      this.$store.dispatch('setConfigLoaded', true)

      let t1 = performance.now()

      this.$store.dispatch('setSnackBarText', {
        snackBarText:
          'Configuration successfully loaded! It took: ' +
          Math.round(t1 - t0) / 1000 +
          ' seconds',
        snackBarColor: 'green',
      })
    })
  }

  async fetchConfigurationFromFile(fileContent: any) {
    //reset maps and ID counters
    this.nodeIDToNodeObjectMap = {}
    this.topLevelNodeTypeIds = {}
    this.nonTopLevelNodeNameIdMap = {}
    this.idCounter = 1

    let t0 = performance.now()

    this.$store.dispatch('setConfigLoaded', false)

    Promise.all([
      await this.$store.dispatch('fetchConfiguration', {
        fromFile: true,
        fileData: fileContent,
      }), // note the "await"
    ]).finally(async () => {
      let ret = TreeParser.parseSequences(
        this.getConfiguration['seqs'],
        this.nodeIDToNodeObjectMap,
        this.topLevelNodeTypeIds,
        this.nonTopLevelNodeNameIdMap,
        this.idCounter
      )
      this.sequencesId = ret['sequencesId']
      this.idCounter = ret['idCounter']

      ret = TreeParser.parsePaths(
        this.getConfiguration['paths'],
        this.nodeIDToNodeObjectMap,
        this.topLevelNodeTypeIds,
        this.nonTopLevelNodeNameIdMap,
        this.idCounter
      )
      this.pathsId = ret['pathsId']
      this.idCounter = ret['idCounter']

      ret = TreeParser.parseModules(
        this.getConfiguration['mods'],
        this.nodeIDToNodeObjectMap,
        this.topLevelNodeTypeIds,
        this.nonTopLevelNodeNameIdMap,
        this.idCounter
      )
      this.modulesId = ret['modulesId']
      this.idCounter = ret['idCounter']

      ret = TreeParser.parsePSets(
        this.getConfiguration['psets'],
        this.nodeIDToNodeObjectMap,
        this.topLevelNodeTypeIds,
        this.nonTopLevelNodeNameIdMap,
        this.idCounter
      )
      this.psetsId = ret['psetsId']
      this.idCounter = ret['idCounter']

      ret = TreeParser.parseTasks(
        this.getConfiguration['tasks'],
        this.nodeIDToNodeObjectMap,
        this.topLevelNodeTypeIds,
        this.nonTopLevelNodeNameIdMap,
        this.idCounter
      )
      this.tasksId = ret['tasksId']
      this.idCounter = ret['idCounter']

      ret = TreeParser.parseESProducers(
        this.getConfiguration['esprods'],
        this.nodeIDToNodeObjectMap,
        this.topLevelNodeTypeIds,
        this.nonTopLevelNodeNameIdMap,
        this.idCounter
      )
      this.esProducersId = ret['esProducersId']
      this.idCounter = ret['idCounter']

      ret = TreeParser.parseESSources(
        this.getConfiguration['essources'],
        this.nodeIDToNodeObjectMap,
        this.topLevelNodeTypeIds,
        this.nonTopLevelNodeNameIdMap,
        this.idCounter
      )
      this.esSourcesId = ret['esSourcesId']
      this.idCounter = ret['idCounter']

      ret = TreeParser.parseServices(
        this.getConfiguration['services'],
        this.nodeIDToNodeObjectMap,
        this.topLevelNodeTypeIds,
        this.nonTopLevelNodeNameIdMap,
        this.idCounter
      )
      this.servicesId = ret['servicesId']
      this.idCounter = ret['idCounter']

      this.$store.dispatch(
        'createNodeIDToNodeObjectMap',
        this.nodeIDToNodeObjectMap
      )

      this.$store.dispatch(
        'createTopLevelNodeTypeIds',
        this.topLevelNodeTypeIds
      )

      this.$store.dispatch(
        'createNonTopLevelNodeNameIdMap',
        this.nonTopLevelNodeNameIdMap
      )

      //initilaize id counter in the store so other components can get/modify it
      this.$store.dispatch('setInitialIDCounter', this.idCounter)
      this.$store.dispatch('createObjectReferences')
      this.$store.dispatch('setConfigLoaded', true)
      var t1 = performance.now()

      this.$store.dispatch('setSnackBarText', {
        snackBarText:
          'Configuration successfully loaded! It took: ' +
          Math.round(t1 - t0) / 1000 +
          ' seconds',
        snackBarColor: 'green',
      })

      /*     console.log(
        'nodeIDToNodeObjectMap size' + sizeof(this.nodeIDToNodeObjectMap)
      ) */
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
    this.$nextTick().then(() => {
      if (this.forcedActive.length != 0) {
        let forced = this.forcedActive[0]
        /*       console.log(
          'this.$refs.treeReference ' + //@ts-ignore
            this.$refs.treeReference.nodes[forced].vnode
        )
        console.log(
          'this.getNodeIDToNodeObjectMap[forced] ' +
            JSON.stringify(this.getNodeIDToNodeObjectMap[forced])
        ) */
        //console.log('ID COUNTER: ' + this.getIDCounter)
        //console.log('FORCEEEED: ' + forced)
        //forced = this.getIDCounter
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
