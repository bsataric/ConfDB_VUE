<template>
  <v-app>
    <section confdb>
      <section workspace ref="workspace"></section>
    </section>
  </v-app>
</template>

<script lang="ts">
import TreeView from './components/TreeView.vue'
import { default as GoldenLayout } from 'golden-layout'
import 'jquery'

export default {
  name: 'App',
  data() {
    return {
      myLayout: null,
      showPassword: false,
      config: {
        content: [
          {
            type: 'row',
            content: [
              {
                type: 'component',
                componentName: 'testComponent',
                componentState: { label: 'Config Tree' },
              },
              {
                type: 'column',
                content: [
                  {
                    type: 'component',
                    componentName: 'testComponent',
                    componentState: { label: 'Parameters' },
                  },
                  {
                    type: 'component',
                    componentName: 'testComponent',
                    componentState: { label: 'Snippet' },
                  },
                ],
              },
            ],
          },
        ],
      },
    }
  },
  mounted: function() {
    this.myLayout = new GoldenLayout(
      this.config,
      this.$refs.workspace as HTMLElement
    )
    this.myLayout.registerComponent('testComponent', function(
      container,
      componentState
    ) {
      container.getElement().html('<h2>' + componentState.label + '</h2>')
      const rootEl = container.getElement()[0]

      const mountEl = document.createElement('div')
      rootEl.appendChild(mountEl)

      let vueElInstance = new TreeView()

      vueElInstance.$mount(mountEl)
    })
    this.myLayout.init()
  },
}
</script>

<style lang="scss" scoped>
[confdb] {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  flex-direction: column;

  [workspace] {
    flex: 1;
    overflow: auto; // fixes bug where resizing to smaller size malfunctions in goldenlayout
  }
}
</style>
