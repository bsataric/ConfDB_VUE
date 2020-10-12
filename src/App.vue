<template>
  <v-app>
    <section confdb>
      <section workspace ref="workspace">
        <v-container class="grey lighten-5">
          <v-row>
            <v-col>
              <v-card class="pa-2" outlined tile>
                <TreeView />
              </v-card>
            </v-col>
            <v-col cols="7">
              <v-card class="pa-2" outlined tile>
                <TableView />
              </v-card>
              <v-row no-gutters>
                <v-col cols="15">
                  <SnippetView />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </section>
    </section>
  </v-app>
</template>

<script lang="ts">
import TreeView from './components/TreeView.vue'
import TableView from './components/TableView.vue'
import SnippetView from './components/SnippetView.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: { TreeView, TableView, SnippetView },
})
export default class App extends Vue {
  private name: any = 'App'
  private counter: number = 0
  private myLayout: any = null
  private showPassword: any = false
  private vueElInstance: any = null

  public mounted() {}
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
