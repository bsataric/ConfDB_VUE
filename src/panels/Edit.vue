<template>
  <section edit>
    <input type="text" v-model="message" placeholder="edit me" />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class extends Vue {
  get message() {
    //return this.$store.state.message;
    return 'MESSAGE'
  }
  set message(m: string) {
    //this.$store.commit("setMessage", m);
  }
}
</script>

<style scoped lang="scss"></style>
