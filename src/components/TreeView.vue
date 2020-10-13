<template>
  <div>
    {{ user.name }}
    <v-treeview
      v-model="tree"
      :open="open"
      :items="items"
      activatable
      item-key="name"
      open-on-click
    >
      <template v-slot:prepend="{ item, open }">
        <v-icon v-if="!item.file">
          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
        </v-icon>
        <v-icon v-else>
          {{ files[item.file] }}
        </v-icon>
      </template>
    </v-treeview>
    {{ getEventById(2) }}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState, mapGetters } from 'vuex'

@Component({
  computed: {
    ...mapGetters(['getEventById']),
    ...mapState(['user', 'categories']),
  },
})
export default class TreeView extends Vue {
  private open: any = ['public']
  private files: any = {
    html: 'mdi-language-html5',
    js: 'mdi-nodejs',
    json: 'mdi-code-json',
    md: 'mdi-language-markdown',
    pdf: 'mdi-file-pdf',
    png: 'mdi-file-image',
    txt: 'mdi-file-document-outline',
    xls: 'mdi-file-excel',
  }
  private tree: any = []
  private items: any = [
    {
      name: '.git',
    },
    {
      name: 'node_modules',
    },
    {
      name: 'public',
      children: [
        {
          name: 'static',
          children: [
            {
              name: 'logo.png',
              file: 'png',
            },
          ],
        },
        {
          name: 'favicon.ico',
          file: 'png',
        },
        {
          name: 'index.html',
          file: 'html',
        },
      ],
    },
    {
      name: '.gitignore',
      file: 'txt',
    },
    {
      name: 'babel.config.js',
      file: 'js',
    },
    {
      name: 'package.json',
      file: 'json',
    },
    {
      name: 'README.md',
      file: 'md',
    },
    {
      name: 'vue.config.js',
      file: 'js',
    },
    {
      name: 'yarn.lock',
      file: 'txt',
    },
  ]
}
</script>
