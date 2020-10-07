<template>
  <section unknown-panel>
    <p>unknown panel '{{ panelTitle }}'</p>
  </section>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
// eslint-disable-next-line no-unused-vars
import { Container } from 'golden-layout'
@Options({})
export default class UnknownPanel extends Vue {
  private container?: Container

  get panelTitle() {
    if (!this.container) {
      return ''
    } else {
      return this.container.getState().title
    }
  }

  public setGLContainer(c: Container) {
    this.container = c
  }
}
</script>

<style scoped lang="scss">
[unknown-panel] {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
