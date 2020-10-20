<template>
  <!-- change key into some computed key or something and not name since they can be same-->
  <div max-height="600px" overflow-y="scroll">
    {{ user.name }}
    <v-treeview
      v-model="tree"
      :open="open"
      :items="items"
      activatable
      item-key="name"
      open-on-click
    >
      <template v-slot:prepend="{ item, open }">
        <v-icon v-if="!item.iconType && item.globalType != 'parameter'">
          {{ open ? 'mdi-minus-thick' : 'mdi-plus-thick' }}
        </v-icon>
        <v-icon v-else :style="{ color: item.iconColor }">
          {{ iconTypes[item.iconType] }}
        </v-icon>
      </template>
    </v-treeview>
    <!--     {{ getEventById(2) }}
 -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component({
  computed: {
    /*     ...mapGetters(['getEventById']),
     */ ...mapState(['user', 'categories']),
  },
})
export default class TreeView extends Vue {
  private open: any = ['public']
  private iconTypes: any = {
    sequence: 'mdi-view-sequential',
    module: 'mdi-view-module',
    path: 'mdi-filmstrip',
  }
  private tree: any = []
  private items: any = [
    {
      name: 'Sequences',
      type: 'seqs',
      children: [
        {
          type: 'sequence',
          name: 'HLTPFClusteringForEgammaUnseeded',
          iconType: 'sequence',
          iconColor: 'red',
          children: [
            {
              type: 'modules',
              name: 'hltParticleFlowRecHitECALUnseeded',
              iconType: 'module',
            },
            {
              type: 'modules',
              name: 'hltParticleFlowRecHitPSUnseeded',
              iconType: 'module',
            },
          ],
        },
        {
          type: 'sequence',
          name: 'HLTDoLocalPixelSequence',
          iconType: 'sequence',
          iconColor: 'red',
          children: [
            {
              type: 'modules',
              name: 'hltSiPixelDigis',
              iconType: 'module',
            },
            {
              type: 'modules',
              name: 'hltSiPixelClusters',
              iconType: 'module',
            },
          ],
        },
      ],
    },
    {
      name: 'Paths',
      type: 'paths',
      children: [
        {
          type: 'paths',
          name: 'HLTriggerFirstPath',
          iconType: 'path',
          iconColor: 'green',
          children: [
            {
              type: 'modules',
              name: 'hltGetConditions',
              iconType: 'module',
            },
            {
              type: 'modules',
              name: 'hltGetRaw',
              iconType: 'module',
            },
            {
              type: 'modules',
              name: 'hltBoolFalse',
              iconType: 'module',
            },
          ],
        },
        {
          type: 'paths',
          name: 'HLT_Ele5_Open_v1',
          iconType: 'path',
          iconColor: 'green',
          children: [
            {
              type: 'sequences',
              name: 'HLTBeginSequence',
              iconType: 'sequence',
              iconColor: 'red',
            },
            {
              type: 'modules',
              name: 'hltL1sSingleEGor',
              iconType: 'module',
            },
            {
              type: 'modules',
              name: 'hltPreEle5',
              iconType: 'module',
            },
            {
              type: 'sequences',
              name: 'HLTEle5OpenSequence',
              iconType: 'sequence',
              iconColor: 'red',
            },
            {
              type: 'sequences',
              name: 'HLTEndSequence',
              iconType: 'sequence',
              iconColor: 'red',
            },
          ],
        },
      ],
    },
    {
      name: 'Modules',
      type: 'mods',
      children: [
        {
          type: 'modules',
          name: 'hltIter1ClustersRefRemoval',
          iconType: 'module',
          children: [
            {
              type: 'cms.string',
              globalType: 'parameter',
              ctype: 'TrackClusterRemover',
              pytype: 'EDProducer',
              value: 'highPurity',
              name: 'string = highPurity', //this will have to be computed (maybe coloured)
            },
          ],
        },
        {
          type: 'modules',
          name: 'hltParticleFlowSuperClusterECALUnseeded',
          iconType: 'module',
          children: [
            {
              type: 'cms.string',
              globalType: 'parameter',
              ctype: 'PFECALSuperClusterProducer',
              pytype: 'EDProducer',
              value: 'hltParticleFlowSuperClusterECALEndcapWithPreshower',
              name:
                'string = hltParticleFlowSuperClusterECALEndcapWithPreshower',
            },
          ],
        },
        {
          type: 'modules',
          name: 'hltDoubletRecoveryPFlowPixelSeeds',
          iconType: 'module',
          children: [
            {
              type: 'cms.double',
              globalType: 'parameter',
              ctype: 'SeedCreatorFromRegionConsecutiveHitsEDProducer',
              pytype: 'EDProducer',
              value: 1.0,
              name: 'double = 1.0',
            },
          ],
        },
        {
          type: 'modules',
          name: 'hltFEDSelector',
          iconType: 'module',
          children: [
            {
              type: 'cms.vuint32',
              globalType: 'parameter',
              ctype: 'SiPixelClusterShapeCacheProducer',
              pytype: 'EDProducer',
              value: [1023, 1024],
              name: 'vuint32 = [1023, 1024]',
            },
          ],
        },
        {
          type: 'modules',
          name: 'hltEgammaElectronPixelSeedsUnseeded',
          iconType: 'module',
          children: [
            {
              type: 'cms.InputTag',
              globalType: 'parameter',
              ctype: 'ElectronNHitSeedProducer',
              pytype: 'EDProducer',
              value: 'hltElePixelSeedsCombinedUnseeded',
              name: 'InputTag = hltElePixelSeedsCombinedUnseeded',
            },
          ],
        },
        {
          type: 'modules',
          name: 'hltParticleFlowRecHitECALUnseeded',
          iconType: 'module',
          children: [
            {
              type: 'cms.VPSet',
              globalType: 'parameter',
              ctype: 'PFRecHitProducer',
              pytype: 'EDProducer',
              name: 'VPSet',
              children: [
                {
                  type: 'cms.VPSet',
                  globalType: 'parameter',
                  name: 'VPSet',
                  children: [
                    {
                      type: 'cms.bool',
                      globalType: 'parameter',
                      value: true,
                      name: 'bool = true1',
                    },
                    {
                      type: 'cms.double',
                      globalType: 'parameter',
                      value: 2.0,
                      name: 'double = 2.02',
                    },
                  ],
                },
                {
                  type: 'cms.VPSet',
                  globalType: 'parameter',
                  name: 'VPSet',
                  children: [
                    {
                      type: 'cms.bool',
                      globalType: 'parameter',
                      value: true,
                      name: 'bool = true',
                    },
                    {
                      type: 'cms.double',
                      globalType: 'parameter',
                      value: 2.0,
                      name: 'double = 2.0',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'modules',
          name: 'hltFEDSelector',
          iconType: 'module',
          children: [
            {
              type: 'cms.vstring',
              globalType: 'parameter',
              ctype: 'ClassifierMerger',
              pytype: 'EDProducer',
              value: [
                'hltIter1PFlowTrackCutClassifierPrompt',
                'hltIter1PFlowTrackCutClassifierDetached',
              ],
              name:
                'vstring = [hltIter1PFlowTrackCutClassifierPrompt, hltIter1PFlowTrackCutClassifierDetached]',
            },
          ],
        },
      ],
    },
    {
      name: 'PSets',
      type: 'psets',
      children: [
        {
          type: 'pset', //TODO: check this
          name: 'HLTPSetPixelLessStepTrajectoryFilter',
          children: [
            {
              type: 'cms.double',
              globalType: 'parameter',
              value: -1.0,
              name: 'double = -1.0', //this will have to be computed (maybe coloured)
            },
          ],
        },
        {
          type: 'pset', //TODO: check this
          name: 'HLTPSetInitialStepTrajectoryFilterPreSplittingForDmesonPPOnAA',
          children: [
            {
              type: 'cms.VPSet',
              globalType: 'parameter',
              name: 'VPSet',
              children: [
                {
                  type: 'cms.string',
                  globalType: 'parameter',
                  value:
                    'HLTPSetInitialStepTrajectoryFilterBasePreSplittingForDmesonPPOnAA',
                  name:
                    'string = HLTPSetInitialStepTrajectoryFilterBasePreSplittingForDmesonPPOnAA',
                },
                {
                  type: 'cms.string',
                  globalType: 'parameter',
                  value:
                    'HLTPSetInitialStepTrajectoryFilterShapePreSplittingPPOnAA',
                  name:
                    'string = HLTPSetInitialStepTrajectoryFilterShapePreSplittingPPOnAA',
                },
              ],
            },
          ],
        },
      ],
    },
  ]
}
</script>
