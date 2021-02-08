<template>
  <div>
    <v-btn
      :loading="loading3"
      :disabled="loading3"
      color="blue-grey"
      class="ma-2 white--text"
      @click="onUpload()"
    >
      Upload Config
      <v-icon right dark>
        mdi-cloud-upload
      </v-icon>
    </v-btn>
    <v-dialog v-model="dialog" persistent width="unset" :dark="getDarkMode">
      <v-card>
        <v-card-title class="headline">
          {{ this.dialogHeader }}
        </v-card-title>
        <v-card-text v-if="!enterText">
          {{ this.dialogText }}
        </v-card-text>
        <div style="margin-left: 40px; margin-right: 40px">
          <!-- TODO: FIX THIS STYLING -->
          <v-text-field v-model="dialogValue" v-if="enterText"></v-text-field>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="cancelClicked()">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="okClicked()">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

@Component({
  computed: {
    ...mapGetters({
      getDarkMode: 'getDarkMode',
      getNodeIDToNodeObjectMap: 'getNodeIDToNodeObjectMap',
    }),
  },
})
export default class App extends Vue {
  @Watch('loader')
  // eslint-disable-next-line no-unused-vars
  onLoaderChange(val: any, oldVal: any) {
    console.log('VAL:' + val)
    console.log('OLDVAL: ' + oldVal)

    const l = this.loader
    this[l] = !this[l] //TODO: how this works??

    setTimeout(() => (this[l] = false), 3000) //TODO do this with real axios response

    this.loader = null
  }

  private getNodeIDToNodeObjectMap!: any //maybe unecessary since we have map as variable

  private loader: any = null
  private loading3: boolean = false
  private dialog: boolean = false
  private dialogHeader: string = ''
  private dialogText: string = ''
  private dialogValue: string = ''
  private enterText: boolean = false
  private actionCallBack!: () => void

  public onUpload() {
    this.dialog = true
    this.dialogHeader = 'Uploaded file name:'
    this.dialogText = ''
    this.enterText = true
    this.actionCallBack = this.uploadFile
  }

  public uploadFile() {
    this.loader = 'loading3'

    const data = JSON.stringify(this.getNodeIDToNodeObjectMap) //TODO: reparse map back to JSON
    const blob = new Blob([data], { type: 'text/plain' })
    const e = document.createEvent('MouseEvents'),
      a = document.createElement('a')
    a.download = this.dialogValue + '.json'
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
    e.initEvent('click', true, false)
    a.dispatchEvent(e)
  }

  public okClicked() {
    console.log('DIALOG VALUE: ' + this.dialogValue)
    this.actionCallBack()

    this.dialog = false
  }

  public cancelClicked() {
    this.dialog = false
    console.log('CANCEL CLICKED')
  }
}
</script>

<style></style>
