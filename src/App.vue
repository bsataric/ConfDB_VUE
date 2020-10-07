<template>
  <section pstools>
    <section workspace ref="workspace"></section>
  </section>
</template>

<style lang="scss" scoped>
[pstools] {
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

<script lang="ts">
import { default as GoldenLayout } from 'golden-layout'
import 'jquery'

let config = {
  content: [
    {
      type: 'row',
      content: [
        {
          type: 'component',
          componentName: 'testComponent',
          componentState: { label: 'A' },
        },
        {
          type: 'column',
          content: [
            {
              type: 'component',
              componentName: 'testComponent',
              componentState: { label: 'B' },
            },
            {
              type: 'component',
              componentName: 'testComponent',
              componentState: { label: 'C' },
            },
          ],
        },
      ],
    },
  ],
}

export default {
  setup() {
    let myLayout = null
    myLayout = new GoldenLayout(config)
    myLayout.registerComponent('testComponent', function(
      container,
      componentState
    ) {
      container.getElement().html('<h2>' + componentState.label + '</h2>')
    })
    myLayout.init()
    return myLayout
  },
}
</script>
