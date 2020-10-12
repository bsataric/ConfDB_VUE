<template>
  <v-app>
    <section confdb>
      <section workspace ref="workspace"><TreeView /></section>
    </section>
  </v-app>
</template>

<script lang="ts">
import TreeView from './components/TreeView.vue'
import { Component, Vue } from 'vue-property-decorator'

import { default as GoldenLayout } from 'golden-layout'
import 'jquery'

@Component({
  components: { TreeView },
})
export default class App extends Vue {
  private name: any = 'App'
  private counter: number = 0
  private myLayout: any = null
  private showPassword: any = false
  private vueElInstance: any = null
  private config: any = {
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
                componentName: 'testComponent1',
                componentState: { label: 'Parameters' },
              },
              {
                type: 'component',
                componentName: 'testComponent2',
                componentState: { label: 'Snippet' },
              },
            ],
          },
        ],
      },
    ],
  }
  public mounted() {
    this.myLayout = new GoldenLayout(
      this.config,
      this.$refs.workspace as HTMLElement
    )
    //if (this.counter++ == 0) {
    console.log('COUNTER' + this.counter)
    this.myLayout.registerComponent('testComponent', function(
      container,
      componentState,
      vueElInstance
    ) {
      console.log('AAA')
      container.getElement().html('<h2>' + componentState.label + '</h2>')
      const rootEl = container.getElement()[0]

      const mountEl = document.createElement('div')
      rootEl.appendChild(mountEl)

      if (vueElInstance == null) {
        console.log('NEW TREEVIEW')
        vueElInstance = new TreeView()
      }
      vueElInstance.$mount(mountEl)
    })
    this.myLayout.registerComponent('testComponent1', function(
      container,
      componentState
    ) {
      console.log('BBB')
      container.getElement().html('<h2>' + componentState.label + '</h2>')
    })
    this.myLayout.registerComponent('testComponent2', function(
      container,
      componentState
    ) {
      console.log('CCC')
      container.getElement().html('<h2>' + componentState.label + '</h2>')
    })
    //this.myLayout.init()
    //}
  }
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
