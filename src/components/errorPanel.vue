<template>
  <section unknown-panel>
    <p><img src="../assets/msg_error.png" alt="error" /></p>
    <p>cannot load panel '{{ panelTitle }}'</p>
  </section>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
// eslint-disable-next-line no-unused-vars
import { Container } from 'golden-layout'
@Options({})
export default class ErrorPanel extends Vue {
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
