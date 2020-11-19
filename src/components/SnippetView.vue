<template>
  <div>
    <v-tabs center-active v-model="this.activeTab">
      <v-tab key="1">Contained in Sequences</v-tab>
      <v-tab key="2">Contained in Tasks</v-tab>
      <v-tab key="3">Contained in Switch producers</v-tab>
      <v-tab key="4" @click="createAndShowSnippet()">Snippet</v-tab>
      <v-tab key="5">Assigned to Datasets</v-tab>
      <v-tab key="6">Unresolved input Tags</v-tab>
      <v-tab key="7">Contained in Paths</v-tab>
    </v-tabs>
    <v-textarea
      rows="17"
      name="input-7-4"
      label=""
      placeholder=""
      readonly
      :value="this.selectedNodeSnippet(this.getSelectedNodeType)"
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
  private getSelectedNodeType!: any
  private getModuleSnippet!: any
  private getSequenceSnippet!: any
  private getPathSnippet!: any
  private getPSetSnippet!: any

  public createAndShowSnippet() {
    console.log('AAA')
  }

  public selectedNodeSnippet(nodeType: any) {
    //console.log('SELECTED NODE TYPE: ' + nodeType)
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
}
</script>

<style lang="scss" scoped></style>
