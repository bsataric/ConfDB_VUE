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
      label="Outlined textarea"
      :value="this.getSeqSnippet"
    ></v-textarea>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

@Component({
  computed: {
    ...mapGetters({
      getModuleSnippet: 'module/getSelectedModuleSnippet',
      getSequenceSnippet: 'sequence/getSelectedSequenceSnippet',
      getPathSnippet: 'path/getSelectedPathSnippet',
    }),
    // ...mapState('sequence', ['sequences']),
  },
})
export default class SnippetView extends Vue {
  private activeTab: any = 3
  private getModuleSnippet!: any
  private getSequenceSnippet!: any
  private getPathSnippet!: any

  public createAndShowSnippet() {
    console.log('AAA')
  }

  //TODO: see how to combine this
  get getSeqSnippet() {
    return this.getSequenceSnippet
  }

  get getSnippet1() {
    return this.getSequenceSnippet
  }
}
</script>

<style lang="scss" scoped></style>
