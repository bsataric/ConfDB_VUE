<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="parameters"
      :items-per-page="8"
      class="elevation-1"
    >
      <template v-slot:[`item.dft`]="{ item }">
        <v-simple-checkbox v-model="item.dft"></v-simple-checkbox>
      </template>
      <template v-slot:[`item.trkd`]="{ item }">
        <v-simple-checkbox v-model="item.trkd"></v-simple-checkbox>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

@Component({
  computed: {
    ...mapGetters({
      getModuleByName: 'module/getModuleByName',
    }),
    // ...mapState('sequence', ['sequences']),
  },
  watch: {
    '$store.state.drawer': function() {
      console.log(this.$store.state.drawer)
    },
  },
})
export default class TableView extends Vue {
  private headers: any = [
    {
      text: 'Name',
      align: 'start',
      sortable: true,
      value: 'name',
    },
    { text: 'Type', value: 'type' },
    { text: 'Value', value: 'value' },
    { text: 'Dft', value: 'dft' },
    { text: 'Trkd', value: 'trkd' },
  ]
  private parameters: any = [
    {
      name: 'allHadPtCut',
      type: 'double',
      value: 380,
      dft: true,
      trkd: true,
    },
    {
      name: 'semiE_dRMin',
      type: 'double',
      value: 0.5,
      dft: true,
      trkd: true,
    },
    {
      name: 'allHadRapidityCut',
      type: 'double',
      value: 16.0,
      dft: true,
      trkd: true,
    },
    {
      name: 'elecSelect',
      type: 'string',
      value:
        'pt > 45.0 & abs(eta)<2.5 & abs(gsfTrack.d0)<1 & abs(gsfTrack.dz)<20',
      dft: true,
      trkd: true,
    },
    {
      name: 'muonSrc',
      type: 'InputTag',
      value: 'muons',
      dft: true,
      trkd: true,
    },
    {
      name: 'jetLabels',
      type: 'VInputTag',
      value:
        'ak4PFJets, ak4PFJetsPuppi, ak8PFJetsPuppi, ak8PFJetsPuppiSoftDrop',
      dft: true,
      trkd: true,
    },
    {
      name: 'semiE_LepJetPtCut',
      type: 'double',
      value: 30,
      dft: true,
      trkd: true,
    },
    {
      name: 'Honeycomb',
      type: 408,
      value: 3.2,
      dft: true,
      trkd: true,
    },
    {
      name: 'Donut',
      type: 452,
      value: 25.0,
      dft: true,
      trkd: true,
    },
    {
      name: 'KitKat',
      type: 518,
      value: 26.0,
      dft: true,
      trkd: true,
    },
  ]
}
</script>

<style></style>
