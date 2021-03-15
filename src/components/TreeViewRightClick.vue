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
      <v-list style="max-height: 400px" class="overflow-y-auto">
        <v-list-item
          v-for="menuItem in this.getMenuItems"
          :key="menuItem[0]"
          @click="clickAction($event, menuItem[0])"
        >
          <div v-if="menuItem[0] != 'Add Module'">
            <v-list-item-title
              >{{ menuItem[0] }}
              <v-divider v-if="menuItem[1] == 'Separator'"></v-divider>
            </v-list-item-title>
          </div>
          <div v-else>
            <v-list>
              <v-list-group>
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title v-text="menuItem[0]"></v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-list-item
                  v-for="moduleInfo in getModulesInfo"
                  :key="moduleInfo.id"
                  @click="clickSubAction($event, 'insertNode', moduleInfo)"
                >
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="moduleInfo.name"
                    ></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </v-list>
          </div>
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
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
// eslint-disable-next-line no-unused-vars
import { NodeObject, NodeBasicInfo } from '../types'

@Component({
  computed: {
    ...mapGetters({
      getNodeByName: 'getNodeByName',
      getNodeIDToNodeObjectMap: 'getNodeIDToNodeObjectMap',
      getDarkMode: 'getDarkMode',
      getIDCounter: 'getIDCounter',
      getModulesInfo: 'getModulesInfo',
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
  // eslint-disable-next-line no-unused-vars
  onIDCounterChanged(val: any, oldVal: any) {
    /*    console.log('getIDCounter from right click VAL:' + val)
    console.log('getIDCounter from right click OLDVAL: ' + oldVal) */
  }

  @Watch('showMenu')
  // eslint-disable-next-line no-unused-vars
  onShowMenuChanged(val: any, oldVal: any) {
    console.log('showMenu NEW VAL:' + val)
    //console.log('showMenu OLDVAL: ' + oldVal)
  }

  private getNodeByName!: any

  private getNodeIDToNodeObjectMap!: any
  private getIDCounter!: any
  private getModulesInfo!: Array<NodeObject>

  private menuItems: any = [
    [
      //main sequence node
      ['Add Sequence', 'Separator', true],
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
  public clickAction(e: Event, actionName: string) {
    console.log('ACTION NAME: ' + actionName)
    console.log('NODE TYPE: ' + this.rightClickNodeType)
    console.log('NODE ID: ' + this.rightClickNodeId)
    e.preventDefault() //prevent context menu from closing if action is clicked
    e.stopPropagation()
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

        this.enterText = false
        this.dialog = true
        this.dialogHeader = ''
        this.dialogText =
          'Do you really want to remove ' +
          sequenceName +
          ', which is referenced ' +
          referencesNumber +
          ' times?' //TODO FIX MODAL FOR RENAME

        this.actionCallBack = this.deleteSequence
      } else if (actionName == 'Replace Sequence') {
        //TODO
        console.log('Replace Sequence')
      }
    }
  }

  public clickSubAction(
    e: Event,
    subactionName: string,
    nodeBasicInfo: NodeBasicInfo
  ) {
    console.log('NODE OBJECT ID: ' + nodeBasicInfo.id)
    if (subactionName == 'insertNode') {
      Promise.all([
        [this.$store.dispatch('incrementIDCounter')],
        //set new object into main map

        //Focus and open/active new node
      ]).finally(() => {
        Promise.all([
          //set new object into main map
          this.$store.dispatch('insertNodeReference', {
            parentId: this.rightClickNodeId,
            childId: nodeBasicInfo.id,
          }),
        ]).finally(() => {
          //TODO: fix focus
          /*      this.$store.dispatch('setSelectedNodeViaID', {
            selectedNodeId: this.getIDCounter,
            forceOpenNode: true,
          }) */
          //Display snackbar success
          this.$store.dispatch('setSnackBarText', {
            snackBarText: 'Node successfuly inserted!',
            snackBarColor: 'green',
          })
        })
      })
    }
  }

  // eslint-disable-next-line no-unused-vars
  async insertSequence(sequenceName: string, sequenceNodeId: number) {
    //sequenceNodeId is not used for new node
    console.log('TRYING TO INSERT SEQUENCE ' + sequenceName)
    //TODO: properly add sequence and focus
    //first check if there is sequence with the same name
    if (this.getNodeByName('sequences', sequenceName) == undefined) {
      Promise.all([this.$store.dispatch('incrementIDCounter')]).finally(() => {
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
          iconType: 'sequence',
          iconColor: 'red',
          paremeterJSONValue: Infinity,
          ctype: '',
          ptype: '',
        }

        Promise.all([
          //set new object into main map
          this.$store.dispatch('addNode', {
            nodeId: newSequenceId,
            nodeIDToObject: newSequenceObject,
          }),
          //Focus and open/active new node
        ]).finally(() => {
          this.$store.dispatch('setSelectedNodeViaID', {
            selectedNodeId: newSequenceId,
            forceOpenNode: true,
          })
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
    if (this.getNodeByName('sequences', newSequenceName) == undefined) {
      Promise.all([
        this.$store.dispatch('renameNode', {
          newNodeName: newSequenceName,
          nodeId: sequenceNodeId,
        }),
      ]).finally(() => {
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
