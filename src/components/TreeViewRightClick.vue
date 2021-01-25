<template>
  <div>
    <v-menu
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
      :dark="getDarkMode"
      :value="showMenu"
    >
      <v-list>
        <v-list-item
          v-for="menuItem in this.getMenuItems"
          :key="menuItem[0]"
          @click="clickAction($event, menuItem[0])"
        >
          <v-list-item-title
            >{{ menuItem[0] }}
            <v-divider v-if="menuItem[1] == 'Separator'"></v-divider>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="290" :dark="getDarkMode">
        <v-card>
          <v-card-title class="headline">
            {{ this.dialogText }}
          </v-card-title>
          <div style="margin-left: 40px">
            <!-- TODO: FIX THIS STYLING -->
            <v-text-field v-model="dialogValue"></v-text-field>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="cancelClicked()">
              Cancel
            </v-btn>
            <v-btn color="green darken-1" text @click="okClicked()">
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script lang="ts">
//TODO REFREACTOR HERE
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

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
      getNodeIDToObjectMap: 'getNodeIDToObjectMap',
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
})
export default class TreeViewRightClick extends Vue {
  @Prop(String) readonly rightClickNodeType: string | undefined
  @Prop(Number) readonly rightClickNodeId: number | undefined
  @Prop(Boolean) readonly showMenu: boolean | undefined
  @Prop(Number) readonly x: number | undefined
  @Prop(Number) readonly y: number | undefined

  @Watch('getIDCounter')
  onIDCounterChanged(val: any, oldVal: any) {
    console.log('getIDCounter from right click VAL:' + val)
    console.log('getIDCounter from right click OLDVAL: ' + oldVal)
  }

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
  private getNodeIDToObjectMap!: any //maybe unecessary since we have map as variable
  private getSelectedNodeParamLength!: number
  private getOpenNodeIds!: any
  private getForcedOpenNodeIds!: any
  private getOpenNodeIdsLength!: any
  private getIDCounter!: any

  private menuItems: any = [
    [
      //main sequence node
      ['Add Sequence', 'Separator'],
      ['Remove Unreferenced Sequences', 'No Separator'],
      ['Resolve Unnecessary Sequences', 'Separator'],
      ['Sort', 'No Separator'],
    ],
    [
      //sequence node
      ['Add Module', 'No Separator'],
      ['Add Sequence', 'No Separator'],
      ['Add Task', 'No Separator'],
      ['Add SwitchProducer', 'Separator'],
      ['Rename Sequence', 'No Separator'],
      ['Clone Sequence', 'No Separator'],
      ['Deep Clone Sequence', 'No Separator'],
      ['Remove Sequence', 'No Separator'],
      ['Replace Sequence', 'No Separator'],
    ],
    [
      //main path node
      ['Add Path', 'Seprator'],
      ['Sort', 'No Seprator'],
    ],
    [
      //path node
      ['Add Module', 'No Separator'],
      ['Add Path', 'No Separator'],
      ['Add Sequence', 'No Separator'],
      ['Add Task', 'No Separator'],
      ['Add SwitchProducer', 'Separator'],
      ['Remove Path', 'No Separator'],
      ['Clone Path', 'Separator'],
      ['Assign to P. Dataset', 'No Separator'],
      ['Remove from P. Dataset', 'Separator'],
      ['endpath', 'No Separator'],
      ['Replace Path', 'No Separator'],
    ],
    [
      //main modules node
      ['Sort', 'No Seprator'],
    ],
    [
      //module node
      ['Rename Module', 'No Seprator'],
      ['Replace Module', 'No Seprator'],
    ],
    [
      //main PSet node
      ['Add PSet', 'No Seprator'],
    ],
    [
      //PSet node
      ['Add PSet', 'No Seprator'],
      ['Remove PSet', 'No Seprator'],
    ],
  ]

  private dialog: boolean = false
  private dialogText: string = ''
  private dialogValue: string = ''
  private actionCallBack!: (string, number) => void

  get getMenuItems() {
    //TODO CHANGE THIS INTO NORMAL MAP
    //console.log('RIGHT CLICK NODE TYPE: ' + nodeType)
    //console.log('this.menuItems[0]: ' + this.menuItems[0])
    if (this.rightClickNodeType == 'seqs') return this.menuItems[0]
    else if (this.rightClickNodeType == 'sequences') return this.menuItems[1]
    else if (this.rightClickNodeType == 'pts') return this.menuItems[2]
    else if (this.rightClickNodeType == 'paths') return this.menuItems[3]
    else if (this.rightClickNodeType == 'mods') return this.menuItems[4]
    else if (this.rightClickNodeType == 'modules') return this.menuItems[5]
    else if (this.rightClickNodeType == 'psets') return this.menuItems[6]
    else if (this.rightClickNodeType == 'pset') return this.menuItems[7]
    //return this.menuItems[nodeType]
    return []
  }

  // eslint-disable-next-line no-unused-vars
  public clickAction(e, actionName: string) {
    console.log(actionName)
    console.log(this.rightClickNodeType)
    console.log(this.rightClickNodeId)
    if (this.rightClickNodeType == 'seqs') {
      if (actionName == 'Add Sequence') {
        //console.log('Add Sequence')
        this.dialog = true
        this.dialogText = 'Sequence name:'
        //this.insertSequence('AAA', this.rightClickNodeId)
        this.actionCallBack = this.insertSequence
      } else if (actionName == 'Remove Unreferenced Sequences') {
        //TODO
        console.log('Remove Unreferenced Sequences')
      } else if (actionName == 'Resolve Unnecessary Sequences') {
        //TODO
        console.log('Resolve Unnecessary Sequences')
      } else if (actionName == 'Sort') {
        //TODO
        console.log('Sort')
      }
    } else if (this.rightClickNodeType == 'Sequences') {
      if (actionName == 'Add Module') {
        console.log('Add Module')
        //TODO
      } else if (actionName == 'Add Sequence') {
        //TODO
        console.log('Add Sequence')
      } else if (actionName == 'Add Task') {
        //TODO
        console.log('Add Task')
      } else if (actionName == 'Add SwitchProducer') {
        //TODO
        console.log('Add SwitchProducer')
      } else if (actionName == 'Rename Sequence') {
        //TODO
        console.log('Rename Sequence')
        this.dialog = true
        this.dialogText = 'New sequence name:' //TODO FIX MODAL FOR RENAME
        //this.actionCallBack = this.renameSequence
      } else if (actionName == 'Clone Sequence') {
        //TODO
        console.log('Clone Sequence')
      } else if (actionName == 'Deep Clone Sequence') {
        //TODO
        console.log('Deep Clone Sequence')
      } else if (actionName == 'Remove Sequence') {
        //TODO
        console.log('Remove Sequence')
      } else if (actionName == 'Replace Sequence') {
        //TODO
        console.log('Replace Sequence')
      }
    }
  }
  //TODO CREATE SEQUENCE IN STORES AND PASS IT TO THE TREEVIEW
  // eslint-disable-next-line no-unused-vars
  async insertSequence(sequenceName: string, sequenceNodeId: number) {
    console.log('TRYING TO INSERT SEQUENCE ' + sequenceName)

    //first check if there is sequence with the same name
    if (this.getSequenceByName(sequenceName) == undefined) {
      await this.$store.dispatch('sequence/createSequenceLocally', {
        sequenceName: sequenceName,
        sequenceParams: [],
      })

      await this.$store.dispatch('incrementIDCounter')

      let newSequenceId = this.getIDCounter

      let newSequenceObject: Object = {
        type: 'sequences',
        name: sequenceName,
        id: newSequenceId,
        iconType: 'sequence',
        iconColor: 'red',
        children: [],
      }
      //console.log(newSequenceObject)
      //console.log('sequenceNodeId' + sequenceNodeId)
      /* console.log(
      'this.items[sequenceNodeId]: ' +
        JSON.stringify(this.globalSequencesObject['children'])
    )  */

      //DONE in TreeView (send object to TreeView)
      this.$emit('add-node', newSequenceObject)

      //this.globalSequencesObject['children'].push(newSequenceObject) //add new node to the sequence node
      /*    for (const [key, value] of Object.entries(this.globalSequencesObject)) {
      console.log('KEY: ' + key)
      console.log('VALUE: ' + value)
    } */

      let nodeIDToObject = {
        name: sequenceName,
        type: 'sequences',
        itemChildrenLength: 0,
        parentNodeId: 1,
      }

      //set new object into main map
      await this.$store.dispatch('appendNodeIDToObjectMap', {
        id: newSequenceId,
        nodeIDToObject: nodeIDToObject,
      })
      //Focus and open/active new node
      await this.$store.dispatch('sequence/fetchSequenceViaId', {
        itemId: newSequenceId,
        forceOpenNode: true,
      })

      console.log('DISPATCH SUCCESS') //TODO FIX SNACKBAR REAPEARRING
      await this.$store.dispatch('setSnackBarText', {
        snackBarText: 'Sequence successfully created!',
        snackBarColor: 'green',
      })
    } else {
      //TODO DISPATCH NOTIFICATION BAR
      console.log('DISPATCH ERROR')
      await this.$store.dispatch('setSnackBarText', {
        snackBarText: 'ERROR: There is sequence with the same name!',
        snackBarColor: 'red',
      })
    }
  }

  async renameSequence(sequenceName: string, sequenceNodeId: number) {
    console.log('TRYING TO INSERT SEQUENCE ' + sequenceName)
    //first check if there is sequence with the same name
    //if (this.getSequenceById(sequenceNodeId) != undefined) {
    await this.$store.dispatch('sequence/renameSequenceLocally', {
      sequenceId: sequenceNodeId,
      sequenceName: sequenceName,
    })
    /*    let newSequenceObject: Object = {
        type: 'sequences',
        name: sequenceName,
        id: ++this.idCounter,
        iconType: 'sequence',
        iconColor: 'red',
        children: [],
      } */
    //console.log(newSequenceObject)
    //console.log('sequenceNodeId' + sequenceNodeId)
    /* console.log(
      'this.items[sequenceNodeId]: ' +
        JSON.stringify(this.globalSequencesObject['children'])
    )  */
    //change name in object here
    //this.globalSequencesObject['children'].push(newSequenceObject) //add new node to the sequence node
    /*    for (const [key, value] of Object.entries(this.globalSequencesObject)) {
      console.log('KEY: ' + key)
      console.log('VALUE: ' + value)
    } */

    let nodeIDToObject = {
      name: sequenceName,
      type: 'sequences',
      itemChildrenLength: 0,
      parentNodeId: 1,
    }

    //set new object into main map and focus
    await this.$store.dispatch('appendNodeIDToObjectMap', {
      //id: this.idCounter,
      nodeIDToObject: nodeIDToObject,
    })
    //Focus and open/active new node
    /*   await this.$store.dispatch('sequence/fetchSequenceViaId', {
        itemId: this.idCounter,
        forceOpenNode: true,
      }) */
    //} else {
    //TODO DISPATCH NOTIFICATION BAR
    console.log('THERE IS SEQUENCE WITH THE SAME NAME!')
    // }
  }

  //public showRightClickMenu(e, itemType: string, itemId: number) {
  //e.preventDefault()
  //console.log('RIGHT CLICK ITEM TYPE: ' + itemType)
  //this.rightClickNodeType = itemType
  //this.rightClickNodeId = itemId
  //this.showMenu = false
  //this.x = e.clientX
  //this.y = e.clientY
  /* this.$nextTick(() => {
      this.showMenu = true
    }) */
  //}

  async okClicked() {
    console.log(this.dialogValue)
    this.actionCallBack(this.dialogValue, this.rightClickNodeId)

    this.dialog = false
  }

  public cancelClicked() {
    this.dialog = false
    console.log('CANCEL CLICKED')
  }

  public onKeyDown(e) {
    if (e.key == 'Escape') {
      if (this.dialog) {
        this.cancelClicked()
      }
      // or if you have created a dialog as a custom component, emit an event
      // this.$emit('closeDialog')
    } else if (e.key == 'Enter') {
      if (this.dialog) this.okClicked()
    }
  }

  mounted() {
    document.addEventListener('keydown', this.onKeyDown)
  }

  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeyDown)
  }
}
</script>

<style lang="scss" scoped>
.v-text-field {
  width: 200px;
}
.center {
  display: flex;
  align-items: center;
}
</style>
