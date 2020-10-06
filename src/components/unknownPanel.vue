<template>
  <section unknown-panel>
    <p><img src="../assets/help_question_mark.png" alt="?" /></p>
    <p>unknown panel '{{ panelTitle }}'</p>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// eslint-disable-next-line no-unused-vars
import { Container } from 'golden-layout'

@Component
export default class extends Vue {
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
