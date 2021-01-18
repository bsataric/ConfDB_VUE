<template>
  <div>
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
      //modules
      getSelectedModuleSnippet: 'module/getSelectedModuleSnippet',
      getSelectedModuleSequences: 'module/getSelectedModuleSequences',
      getSelectedModulePaths: 'module/getSelectedModulePaths',
      //sequences
      getSelectedSequenceSnippet: 'sequence/getSelectedSequenceSnippet',
      getSelectedSequenceSequences: 'sequence/getSelectedSequenceSequences',
      getSelectedSequencePaths: 'sequence/getSelectedSequencePaths',
      //paths
      getPathSnippet: 'path/getSelectedPathSnippet',
      //psets
      getPSetSnippet: 'pset/getSelectedPSetSnippet',
    }),
    // ...mapState('sequence', ['sequences']),
  },
})
export default class SnippetView extends Vue {
  private activeTab: any = 3
  //private triggered: boolean = false
  private getSelectedNodeType!: any
  private getSelectedNodeName!: any
  //modules
  private getSelectedModuleSnippet!: any
  private getSelectedModuleSequences!: any
  private getSelectedModulePaths!: any
  //sequences
  private getSelectedSequenceSnippet!: any
  private getSelectedSequenceSequences!: any
  private getSelectedSequencePaths!: any
  //paths
  private getPathSnippet!: any
  //psets
  private getPSetSnippet!: any
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

  private disabledTabs: any = [false, false, false, false, false, false, false]

  public displayAreaText() {
    console.log(JSON.stringify(this.arrayOfSelectedObjects))
  }

  public getSelectedNodeSnippet(nodeType: string) {
    //console.log('SELECTED NODE TYPE: ' + nodeType)
    //this.triggered = !this.triggered
    if (nodeType == 'modules') {
      return this.getSelectedModuleSnippet
    } else if (nodeType == 'sequence') {
      return this.getSelectedSequenceSnippet
    } else if (nodeType == 'paths') {
      return this.getPathSnippet
    } else if (nodeType == 'pset') {
      return this.getPSetSnippet
    }
    return ''
  }

  public getSelectedNodeContainedInSequences(nodeType: string) {
    //console.log('SELECTED NODE TYPE: ' + nodeType)
    //this.triggered = !this.triggered
    if (nodeType == 'modules') {
      let sequences = this.getSelectedModuleSequences
      this.arrayOfSelectedObjects = sequences
      let sequencesText = '<ul>'
      //console.log(sequences)
      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of Object.entries(sequences)) {
        //console.log('KEY: ' + key)
        //console.log('VALUE: ' + value)
        sequencesText +=
          '<li><a id=Sequences.' +
          key +
          '.' +
          value +
          '>' +
          value +
          '</a>' +
          '</li>'
      }
      sequencesText += '</ul>'
      return sequencesText
    } else if (nodeType == 'sequence') {
      let sequences = this.getSelectedSequenceSequences
      console.log('SEQUENCESSSSS: ' + sequences)
      this.arrayOfSelectedObjects = sequences
      let sequencesText = '<ul>'
      //console.log(sequences)
      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of Object.entries(sequences)) {
        //console.log('KEY: ' + key)
        //console.log('VALUE: ' + value)
        sequencesText +=
          '<li><a id=Sequences.' +
          key +
          '.' +
          value +
          '>' +
          value +
          '</a>' +
          '</li>'
      }
      sequencesText += '</ul>'
      return sequencesText
    } else if (nodeType == 'paths') {
      return this.getPathSnippet
    } else if (nodeType == 'pset') {
      return this.getPSetSnippet
    }
    return ''
  }

  public getSelectedNodeContainedInPaths(nodeType: string) {
    //console.log('SELECTED NODE TYPE: ' + nodeType)
    //this.triggered = !this.triggered
    if (nodeType == 'modules') {
      let paths = this.getSelectedModulePaths
      this.arrayOfSelectedObjects = paths
      let pathsText = '<ul>'
      //console.log(paths)
      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of Object.entries(paths)) {
        //console.log('KEY: ' + key)
        //console.log('VALUE: ' + value)
        pathsText += //fix new line
          '<li><a id=Paths.' + key + '.' + value + ' >' + value + '</a></li>'
      }
      pathsText += '</ul>'
      return pathsText
    } else if (nodeType == 'sequence') {
      let paths = this.getSelectedSequencePaths
      this.arrayOfSelectedObjects = paths
      let pathsText = '<ul>'
      //console.log(paths)
      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of Object.entries(paths)) {
        //console.log('KEY: ' + key)
        //console.log('VALUE: ' + value)
        pathsText += //fix new line
          '<li><a id=Paths.' + key + '.' + value + ' >' + value + '</a></li>'
      }
      pathsText += '</ul>'
      return pathsText
    } else if (nodeType == 'paths') {
      return this.getPathSnippet
    } else if (nodeType == 'pset') {
      return this.getPSetSnippet
    }
    return ''
  }

  public getSelectedNodeDisabledTabs(nodeType: string, index: number) {
    //console.log('SELECTED NODE TYPE: ' + nodeType)
    //this.triggered = !this.triggered
    if (nodeType == 'modules') {
      //enable all tabs besides datasets and input tags
      for (let i = 0; i < this.disabledTabs.length; i++) {
        if (i == 4 || i == 5) this.disabledTabs[i] = true
        else this.disabledTabs[i] = false
      }
    } else if (nodeType == 'sequence') {
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
    }
    return this.disabledTabs[index]
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
    if (this.activeTab == 3)
      return this.getSelectedNodeSnippet(this.getSelectedNodeType)
    else if (this.activeTab == 0) {
      return this.getSelectedNodeContainedInSequences(this.getSelectedNodeType)
    } else if (this.activeTab == 6) {
      //console.log('ACTIVE TAB 6')
      return this.getSelectedNodeContainedInPaths(this.getSelectedNodeType)
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
    if (nodeType == 'Sequences') {
      //console.log('FORCEEEEEED: ' + itemId)
      await this.$store.dispatch('sequence/fetchSequenceViaId', {
        itemId: itemId,
        forceOpenNode: true,
      })
    } else if (nodeType === 'Paths') {
      await this.$store.dispatch('path/fetchPathViaId', {
        itemId: itemId,
        forceOpenNode: true,
      })
    } /* else if (nodeType === 'tasks') { //TODO: THIS PROBABLY WONT HAPPEN

    } else if (nodeType === 'switchProducers') {

    } */
  }
}
</script>

<style lang="scss" scoped></style>
