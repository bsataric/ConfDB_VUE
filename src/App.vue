<template>
  <v-app>
    <section pstools>
      <Header ref="header" />
      <!-- this is where golden-layout gets mounted -->
      <section workspace ref="workspace"></section>
      <Notifications />
      <footer>
        <component
          v-for="name in footerElements"
          :key="name"
          v-bind:is="name"
        ></component>
      </footer>
    </section>
  </v-app>
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
import { Component, Vue, Watch } from 'vue-property-decorator'

//import Header from './components/header.vue'
//import Notifications from './components/notifications.vue'
import * as mainLayout from './lib/goldenlayout/mainLayout'

@Component({
  components: {
    // Header,
    // Notifications,
  },
})
export default class extends Vue {
  @Watch('themename')
  private themeChanged(themename: string) {
    document.body.setAttribute('theme', themename)
    localStorage['theme'] = themename
  }

  /*   get footerElements() {
    return this.$store.state.footer.footerElements
  } */

  /*   get themename() {
    return this.$vuetify.theme.dark ? 'dark' : 'light'
  } */

  public mounted() {
    //const t = localStorage['theme']
    /*   if (t) {
      this.$vuetify.theme.dark = t == 'dark'
    }
    this.themeChanged(t || this.themename) */
    mainLayout.init(this.$refs.workspace as HTMLElement)
    //;(this.$refs.header as Header).mountDraggers()
  }
}
</script>
