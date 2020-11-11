<template>
  <v-app>
    <section confdb>
      <section workspace ref="workspace">
        <!--  <NotificationContainer /> -->
        <v-container class="grey lighten-5">
          <v-row>
            <v-col>
              <v-card class="v-card-treeview" outlined tile>
                <TreeView />
              </v-card>
            </v-col>
            <v-col>
              <v-card class="pa-2, v-card-tableview" outlined tile>
                <TableView />
              </v-card>
              <v-divider></v-divider>
              <v-card class="pa-2, v-card-snippetview" outlined tile>
                <SnippetView />
              </v-card>
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
import EventCard from './components/EventCard.vue'
import NotificationContainer from './components/NotificationContainer.vue'

import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    TreeView,
    TableView,
    SnippetView,
    EventCard,
    NotificationContainer,
  },
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
.v-card-treeview {
  overflow: auto;
  max-height: 1000px;
  height: 1000px;
  //max-width: 750px;
}
.v-card-tableview {
  overflow: auto;
  max-height: 500px;
  height: 500px;
  //max-width: 750px;
}
.v-card-snippetview {
  overflow: auto;
  max-height: 490px;
  height: 490px;
  margin-top: 10px;
  //max-width: 750px;
}
</style>
