<template>
  <div>
    <v-tabs center-active v-model="activeTab">
      <v-tab
        v-for="(item, index) in items"
        :key="item"
        :disabled="getSelectedNodeDisabledTabs(getSelectedNodeType, index)"
      >
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-textarea
      rows="17"
      name="input-7-4"
      label=""
      placeholder=""
      readonly
      :value="getTextFieldValue(this.getSelectedNodeName)"
    ></v-textarea>
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
      getModuleSnippet: 'module/getSelectedModuleSnippet',
      getSequenceSnippet: 'sequence/getSelectedSequenceSnippet',
      getPathSnippet: 'path/getSelectedPathSnippet',
      getPSetSnippet: 'pset/getSelectedPSetSnippet',
    }),
    // ...mapState('sequence', ['sequences']),
  },
})
export default class SnippetView extends Vue {
  private activeTab: any = 3
  private triggered: boolean = false
  private getSelectedNodeType!: any
  private getSelectedNodeName!: any
  private getModuleSnippet!: any
  private getSequenceSnippet!: any
  private getPathSnippet!: any
  private getPSetSnippet!: any
  private previousNodeName: string = ''

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

  public createAndShowSnippet() {
    console.log('AAA')
  }

  public getSelectedNodeSnippet(nodeType: any) {
    //console.log('SELECTED NODE TYPE: ' + nodeType)
    //this.triggered = !this.triggered
    if (nodeType == 'module') {
      return this.getModuleSnippet
    } else if (nodeType == 'sequence') {
      return this.getSequenceSnippet
    } else if (nodeType == 'path') {
      return this.getPathSnippet
    } else if (nodeType == 'pset') {
      return this.getPSetSnippet
    }
    return ''
  }

  public getSelectedNodeDisabledTabs(nodeType: any, index: any) {
    //console.log('SELECTED NODE TYPE: ' + nodeType)
    //this.triggered = !this.triggered
    if (nodeType == 'module') {
      //enable all tabs besides datasets and input tags
      for (let i = 0; i < this.disabledTabs.length; i++) {
        if (i == 4 || i == 5) this.disabledTabs[i] = true
        else this.disabledTabs[i] = false
      }
    } else if (nodeType == 'sequence') {
      for (let i = 0; i < this.disabledTabs.length; i++) {
        this.disabledTabs[i] = true
      }
    } else if (nodeType == 'path') {
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
  public getTextFieldValue(nodeName: any) {
    //console.log('activeTab CHANGED ' + activeTab)
    console.log('nodeName: ' + nodeName)
    //console.log('this.previousNodeName: ' + this.previousNodeName)
    if (this.previousNodeName != nodeName) {
      this.activeTab = 3 //force snippet
      console.log('FORCING SNIPPET')
    }

    this.previousNodeName = nodeName
    if (this.activeTab == 3)
      return this.getSelectedNodeSnippet(this.getSelectedNodeType)
    else if (this.activeTab == 0) return 'NOTHING'
  }
}
</script>

<style lang="scss" scoped></style>
