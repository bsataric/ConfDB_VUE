<template>
  <v-app>
    <section confdb>
      <section workspace ref="workspace">
        <!--  <NotificationContainer /> -->
        <v-container class="grey lighten-5">
          <v-toolbar>
            <v-app-bar-nav-icon> </v-app-bar-nav-icon>
            <v-file-input
              v-model="file"
              label="Select config file..."
            ></v-file-input>
            <v-btn color="primary" @click="onUpload">Open</v-btn>

            <v-spacer></v-spacer>
            <v-toolbar-title>ConfDB</v-toolbar-title>

            <v-btn icon>
              <v-icon>mdi-export</v-icon>
            </v-btn>
          </v-toolbar>
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
  private file: any = null
  private fileContent: any = null

  public mounted() {}

  public onUpload() {
    //console.log(this.file)

    var reader = new FileReader()

    // Use the javascript reader object to load the contents
    // of the file in the v-model prop
    reader.readAsText(this.file)
    reader.onload = () => {
      this.fileContent = reader.result
      //console.log(this.fileContent)

      this.$store.dispatch('setOpenFileContent', this.fileContent)
    }
  }
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
