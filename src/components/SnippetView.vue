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
      getSelectedModuleSnippet: 'module/getSelectedModuleSnippet',
      getSelectedModuleSequences: 'module/getSelectedModuleSequences',
      getSelectedModulePaths: 'module/getSelectedModulePaths',
      getSelectedSequenceSnippet: 'sequence/getSelectedSequenceSnippet',
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
  private getSelectedModuleSnippet!: any
  private getSelectedSequenceSnippet!: any
  private getSelectedModuleSequences!: any
  private getSelectedModulePaths!: any
  private getPathSnippet!: any
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

  public getSelectedNodeSnippet(nodeType: any) {
    //console.log('SELECTED NODE TYPE: ' + nodeType)
    //this.triggered = !this.triggered
    if (nodeType == 'module') {
      return this.getSelectedModuleSnippet
    } else if (nodeType == 'sequence') {
      return this.getSelectedSequenceSnippet
    } else if (nodeType == 'path') {
      return this.getPathSnippet
    } else if (nodeType == 'pset') {
      return this.getPSetSnippet
    }
    return ''
  }

  public getSelectedNodeContainedInSequences(nodeType: any) {
    //console.log('SELECTED NODE TYPE: ' + nodeType)
    //this.triggered = !this.triggered
    if (nodeType == 'module') {
      return this.getSelectedModuleSnippet
    } else if (nodeType == 'sequence') {
      return this.getSelectedSequenceSnippet
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
      //console.log('AAAA')
      let sequences = this.getSelectedModuleSequences
      this.arrayOfSelectedObjects = sequences
      let sequencesText = ''
      //console.log(sequences)
      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of Object.entries(sequences)) {
        //console.log('KEY: ' + key)
        //console.log('VALUE: ' + value)
        sequencesText +=
          '<a id=Sequences.' + value + '>' + value + '</a>' + '\n'
      }
      return sequencesText
    } else if (this.activeTab == 6) {
      //console.log('AAAA')
      let paths = this.getSelectedModulePaths
      this.arrayOfSelectedObjects = paths
      let pathsText = ''
      //console.log(paths)
      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of Object.entries(paths)) {
        //console.log('KEY: ' + key)
        //console.log('VALUE: ' + value)
        pathsText += value + '\n'
      }
      return pathsText
    }
    return ''
  }
  public handleClick(e) {
    let array = e.target.id.split('.')
    //console.log(array[0])
    //console.log(array[1])
    this.openNode(array[0], array[1])
  }

  async openNode(nodeType: string, nodeName: string) {
    if (nodeType == 'Sequences') {
      await this.$store.dispatch('sequence/fetchSequenceAndSequenceId', {
        itemName: nodeName,
      }) // note the "await"
    } else if (nodeType === 'paths') {
      await this.$store.dispatch('path/fetchPathAndPathId', {
        itemName: nodeName,
      })
    } else if (nodeType === 'modules') {
      //TODO: fix params and open nodes across the store
      await this.$store.dispatch('module/fetchModuleAndModuleId', nodeName)
    } else if (nodeType === 'pset') {
      await this.$store.dispatch('pset/fetchPSetAndPSetId', nodeName)
    }
  }
}
</script>

<style lang="scss" scoped></style>
