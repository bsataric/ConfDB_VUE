<template>
  <section waiting>
    <!-- <img src="/img/hourglass_color.gif" alt="working..." /> -->
  </section>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'

@Options({})
export default class Waiting extends Vue {}
</script>

<style scoped lang="scss">
[waiting] {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
