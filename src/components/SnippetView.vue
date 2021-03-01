<template>
  <v-skeleton-loader
    v-if="!getConfigLoaded"
    :boilerplate="false"
    :dark="getDarkMode"
    type="table-thead, image@2"
  ></v-skeleton-loader>
  <div v-else>
    <v-tabs center-active v-model="activeTab" show-arrows>
      <v-tab
        v-for="(item, index) in items"
        :key="item"
        :disabled="getSelectedNodeDisabledTabs(getSelectedNodeType, index)"
      >
        {{ item }}
      </v-tab>
    </v-tabs>
    <div @click="handleClick">
      <v-textarea
        rows="17"
        name="input-7-4"
        label=""
        placeholder=""
        readonly
        v-html="getTextFieldValue(this.getSelectedNodeName)"
      ></v-textarea>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

@Component({
  computed: {
    ...mapGetters({
      getSelectedNodeType: 'getSelectedNodeType',
      getSelectedNodeName: 'getSelectedNodeName',
      getSelectedNodeSnippetText: 'getSelectedNodeSnippetText',
      getSequencesContainingCurrentNode: 'getSequencesContainingCurrentNode',
      getPathsContainingCurrentNode: 'getPathsContainingCurrentNode',
      getDarkMode: 'getDarkMode',
      getConfigLoaded: 'getConfigLoaded',
    }),
    // ...mapState('sequence', ['sequences']),
  },
})
export default class SnippetView extends Vue {
  private activeTab: number = 3
  //private triggered: boolean = false
  private getSelectedNodeType!: string
  private getSelectedNodeName!: any
  private getSelectedNodeSnippetText!: any
  private getSequencesContainingCurrentNode!: any
  private getPathsContainingCurrentNode!: any
  private previousNodeName: string = ''
  private areaText: any = '<br>aaaa</br>'

  private arrayOfSelectedObjects = []

  //private textFieldValueType = 'snippet'

  private items: any = [
    'Contained in Sequences',
    'Contained in Tasks',
    'Contained in Switch producers',
    'Snippet',
    'Assigned to Datasets',
    'Unresolved input Tags',
    'Contained in Paths',
  ]

  private disabledTabs: boolean[] = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]

  public displayAreaText() {
    console.log(JSON.stringify(this.arrayOfSelectedObjects))
  }

  public getSelectedNodeContainedInSequences() {
    //this.triggered = !this.triggered
    let sequences = this.getSequencesContainingCurrentNode
    this.arrayOfSelectedObjects = sequences
    let sequencesText = '<ul>'
    //console.log(sequences)
    // eslint-disable-next-line no-unused-vars
    for (const [nodeId, nodeName] of Object.entries(sequences)) {
      //console.log('KEY: ' + nodeId)
      //console.log('VALUE: ' + nodeName)
      sequencesText +=
        '<li><a id=Sequences.' +
        nodeId +
        '.' +
        nodeName +
        '>' +
        nodeName +
        '</a>' +
        '</li>'
    }
    sequencesText += '</ul>'
    return sequencesText
  }

  public getSelectedNodeContainedInPaths() {
    //this.triggered = !this.triggered
    let paths = this.getPathsContainingCurrentNode
    this.arrayOfSelectedObjects = paths
    let pathsText = '<ul>'
    //console.log(paths)
    // eslint-disable-next-line no-unused-vars
    for (const [pathId, pathName] of Object.entries(paths)) {
      //console.log('KEY: ' + pathId)
      //console.log('VALUE: ' + pathName)
      pathsText += //fix new line
        '<li><a id=Paths.' +
        pathId +
        '.' +
        pathName +
        ' >' +
        pathName +
        '</a></li>'
    }
    pathsText += '</ul>'
    return pathsText
  }

  public getSelectedNodeDisabledTabs(nodeType: string, index: number): boolean {
    //console.log('SELECTED NODE TYPE: ' + nodeType)
    //this.triggered = !this.triggered
    if (nodeType == 'modules') {
      //enable all tabs besides datasets and input tags
      for (let i = 0; i < this.disabledTabs.length; i++) {
        if (i == 4 || i == 5) this.disabledTabs[i] = true
        else this.disabledTabs[i] = false
      }
    } else if (nodeType == 'sequences') {
      for (let i = 0; i < this.disabledTabs.length; i++) {
        if (i == 4 || i == 5) this.disabledTabs[i] = true
        else this.disabledTabs[i] = false
      }
    } else if (nodeType == 'tasks') {
      for (let i = 0; i < this.disabledTabs.length; i++) {
        if (i == 4 || i == 5) this.disabledTabs[i] = true
        else this.disabledTabs[i] = false
      }
    } else if (nodeType == 'paths') {
      for (let i = 0; i < this.disabledTabs.length; i++) {
        this.disabledTabs[i] = true
      }
    } else if (nodeType == 'pset') {
      //disable all tabs besides snippet tab
      for (let i = 0; i < this.disabledTabs.length; i++) {
        if (i == 3) this.disabledTabs[i] = false
        else this.disabledTabs[i] = true
      }
    } else if (nodeType == 'esproducers') {
      //disable all tabs besides snippet tab
      for (let i = 0; i < this.disabledTabs.length; i++) {
        if (i == 3) this.disabledTabs[i] = false
        else this.disabledTabs[i] = true
      }
    } else if (nodeType == 'essources') {
      //disable all tabs besides snippet tab
      for (let i = 0; i < this.disabledTabs.length; i++) {
        if (i == 3) this.disabledTabs[i] = false
        else this.disabledTabs[i] = true
      }
    } else if (nodeType == 'services') {
      //disable all tabs besides snippet tab
      for (let i = 0; i < this.disabledTabs.length; i++) {
        if (i == 3) this.disabledTabs[i] = false
        else this.disabledTabs[i] = true
      }
    }
    return this.disabledTabs[index] as boolean
  }
  public getTextFieldValue(nodeName: string) {
    //console.log('activeTab CHANGED ' + activeTab)
    //console.log('nodeName: ' + nodeName)
    //console.log('this.previousNodeName: ' + this.previousNodeName)
    if (this.previousNodeName != nodeName) {
      this.activeTab = 3 //force snippet
      //console.log('FORCING SNIPPET')
    }

    this.previousNodeName = nodeName
    if (this.activeTab == 3) {
      return this.getSelectedNodeSnippetText
    } else if (this.activeTab == 0) {
      return this.getSelectedNodeContainedInSequences()
    } else if (this.activeTab == 6) {
      //console.log('ACTIVE TAB 6')
      return this.getSelectedNodeContainedInPaths()
    }
    return ''
  }
  public handleClick(e) {
    let array = e.target.id.split('.')
    //console.log(array[0])
    //console.log(array[1])
    this.openContainedInNode(array[0], parseInt(array[1]))
  }

  async openContainedInNode(nodeType: string, itemId: number) {
    await this.$store.dispatch('setSelectedNodeViaID', {
      selectedNodeId: itemId,
      forceOpenNode: true,
    })
  }
}
</script>

<style lang="scss" scoped></style>
