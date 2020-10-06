<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue'
//import * as GoldenLayout from 'golden-layout
import { default as GoldenLayout, ItemConfigType } from 'golden-layout'
import 'jquery'

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
  },
  setup() {
    const workspaces: {
      [groupname: string]: { [key: string]: ItemConfigType[] }
    } = {
      Generic: {
        'Manual editor': [
          {
            type: 'row',
            content: [panel('Manual Editor')],
          },
        ],
        'Table editor': [
          {
            type: 'row',
            content: [panel('Fancy Table')],
          },
        ],
      },
    }
    onMounted(() => {
      // create a new GL instance.
      let layout = new GoldenLayout(workspaces['layout A']) //TODO: do it like Glen
      // now register the components dynamically.
      layout.registerComponent('testComponent', function(
        container,
        componentState
      ) {
        container.getElement().html('<h2>' + componentState.label + '</h2>')
      })
      layout.init()
    })

    return workspaces
  },
  methods: {
    makeConfigFromLayout(layout: ItemConfigType[]): GoldenLayout.Config {
      return {
        settings: {
          selectionEnabled: false, //disable selection of panels for custom adding
        },
        content: layout,
      }
    },
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
