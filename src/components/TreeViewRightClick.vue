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
      <v-dialog v-model="dialog" persistent width="unset" :dark="getDarkMode">
        <v-card>
          <v-card-title class="headline">
            {{ this.dialogHeader }}
          </v-card-title>
          <v-card-text v-if="!enterText">
            {{ this.dialogText }}
          </v-card-text>
          <div style="margin-left: 40px; margin-right: 40px">
            <!-- TODO: FIX THIS STYLING -->
            <v-text-field v-model="dialogValue" v-if="enterText"></v-text-field>
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
// eslint-disable-next-line no-unused-vars
import { NodeObject } from '../types'

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
})
export default class TreeViewRightClick extends Vue {
  @Prop(String) readonly rightClickNodeType!: string
  @Prop(Number) readonly rightClickNodeId!: number
  @Prop(Boolean) readonly showMenu!: boolean
  @Prop(Number) readonly x!: number
  @Prop(Number) readonly y!: number

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
  private getNodeIDToVuexObjectMap!: any //maybe unecessary since we have map as variable
  private getNodeIDToNodeObjectMap!: any
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
  private dialogHeader: string = ''
  private dialogText: string = ''
  private dialogValue: string = ''
  private enterText: boolean = false
  private actionCallBack!: (name: string, id: number) => void

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
    console.log('ACTION NAME: ' + actionName)
    console.log('NODE TYPE: ' + this.rightClickNodeType)
    console.log('NODE ID: ' + this.rightClickNodeId)
    if (this.rightClickNodeType == 'seqs') {
      if (actionName == 'Add Sequence') {
        //console.log('Add Sequence')
        this.dialog = true
        this.dialogHeader = 'Sequence name:'
        this.dialogText = ''
        this.enterText = true
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
    } else if (this.rightClickNodeType == 'sequences') {
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
        //console.log('Rename Sequence')
        this.dialog = true
        this.dialogHeader = 'New sequence name:' //TODO FIX MODAL FOR RENAME
        this.dialogText = ''
        this.enterText = true
        this.actionCallBack = this.renameSequence
      } else if (actionName == 'Clone Sequence') {
        //TODO
        console.log('Clone Sequence')
      } else if (actionName == 'Deep Clone Sequence') {
        //TODO
        console.log('Deep Clone Sequence')
      } else if (actionName == 'Remove Sequence') {
        //TODO
        console.log('Remove Sequence')

        let referencesNumber = this.getNodeIDToNodeObjectMap[
          this.rightClickNodeId
        ].referencedByIds.length
        let sequenceName = this.getNodeIDToNodeObjectMap[this.rightClickNodeId]
          .name
        if (referencesNumber > 0) {
          this.enterText = false
          this.dialog = true
          this.dialogHeader = ''
          this.dialogText =
            'Do you really want to remove ' +
            sequenceName +
            ', which is referenced ' +
            referencesNumber +
            ' times?' //TODO FIX MODAL FOR RENAME
        }
        this.actionCallBack = this.deleteSequence
      } else if (actionName == 'Replace Sequence') {
        //TODO
        console.log('Replace Sequence')
      }
    }
  }

  // eslint-disable-next-line no-unused-vars
  async insertSequence(sequenceName: string, sequenceNodeId: number) {
    //sequenceNodeId is not used for new node
    console.log('TRYING TO INSERT SEQUENCE ' + sequenceName)

    //first check if there is sequence with the same name
    if (this.getSequenceByName(sequenceName) == undefined) {
      Promise.all([
        /*       this.$store.dispatch('sequence/createSequenceLocally', {
          sequenceName: sequenceName,
          sequenceParams: [],
        }), */

        this.$store.dispatch('incrementIDCounter'),
      ]).finally(() => {
        let newSequenceId = this.getIDCounter
        console.log('NEW SEQUENCE ID: ' + newSequenceId)

        let newSequenceObject: NodeObject = {
          id: newSequenceId,
          name: sequenceName,
          type: 'sequences',
          globalType: 'sequenceNode',
          children: [],
          parentNodeId: 1,
          rootNodeId: newSequenceId, //new sequence is it's own root
          referencedByIds: [],
          //parameters: value,
          iconType: 'sequence',
          iconColor: 'red',
          value: '',
          ctype: '',
          ptype: '',
        }

        //DONE in TreeView (send object to TreeView)
        //this.$emit('add-node', newSequenceObject) //TODO: probably uncesseary

        /*    let nodeIDToObject = {
          name: sequenceName,
          type: 'sequences',
          itemChildrenLength: 0,
          parentNodeId: 1,
        } */

        Promise.all([
          //set new object into main map
          this.$store.dispatch('addNode', {
            nodeId: newSequenceId,
            nodeIDToObject: newSequenceObject,
          }),
          //Focus and open/active new node
          /* this.$store.dispatch('sequence/fetchSequenceViaId', {
            //TODO: FIX THIS SO IT GOES THROUGH MAP
            itemId: newSequenceId,
            forceOpenNode: true,
          }), */
        ]).finally(() => {
          //Display snackbar success
          this.$store.dispatch('setSnackBarText', {
            snackBarText: 'Sequence successfully created!',
            snackBarColor: 'green',
          })
        })
      })
    } else {
      await this.$store.dispatch('setSnackBarText', {
        snackBarText: 'ERROR: There is sequence with the same name!',
        snackBarColor: 'red',
      })
    }
  }

  // eslint-disable-next-line no-unused-vars
  async renameSequence(newSequenceName: string, sequenceNodeId: number) {
    console.log('TRYING TO RENAME SEQUENCE ' + newSequenceName)
    //first check if there is sequence with the same name TODO: refractor
    if (this.getSequenceByName(newSequenceName) == undefined) {
      Promise.all([
        /*   this.$store.dispatch('sequence/renameSequenceLocally', {
          newSequenceName: newSequenceName,
          sequenceNodeId: sequenceNodeId,
        }), */
        this.$store.dispatch('renameNode', {
          newNodeName: newSequenceName,
          nodeId: sequenceNodeId,
        }),
      ]).finally(() => {
        //DONE in TreeView (send object to TreeView)
        //this.$emit('update-node-name', sequenceNodeId, newSequenceName) //TODO: probably unecessary

        this.$store.dispatch('setSnackBarText', {
          snackBarText: 'Sequence successfully renamed!',
          snackBarColor: 'green',
        })
      })
    } else {
      await this.$store.dispatch('setSnackBarText', {
        snackBarText: 'ERROR: There is sequence with the same name!',
        snackBarColor: 'red',
      })
    }
  }

  // eslint-disable-next-line no-unused-vars
  async deleteSequence(oldSequenceName: string, sequenceNodeId: number) {
    console.log('TRYING TO DELETE SEQUENCE ' + oldSequenceName)

    Promise.all([
      this.$store.dispatch('deleteNode', {
        oldSequenceName: oldSequenceName,
        nodeId: sequenceNodeId,
      }),
    ]).finally(() => {
      //DONE in TreeView (send object to TreeView)
      //this.$emit('delete-node-name', sequenceNodeId, newSequenceName) //TODO: probably unecessary

      this.$store.dispatch('setSnackBarText', {
        snackBarText: 'Sequence successfully deleted!',
        snackBarColor: 'green',
      })
    })
  }

  async okClicked() {
    console.log('DIALOG VALUE: ' + this.dialogValue)
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
