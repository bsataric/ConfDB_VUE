<template>
  <div class="text-center">
    <!-- <v-btn dark color="orange darken-2" @click="snackbar = true">
      Open Snackbar
    </v-btn> -->

    <v-snackbar
      :timeout="timeout"
      :dark="getDarkMode"
      :value="getSnackBarOpen"
      :color="getSnackBarColor"
    >
      {{ getSnackBarText }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
//import Utils from '@/lib/utils.ts'

import { mapGetters } from 'vuex'

@Component({
  components: {},
  computed: {
    ...mapGetters({
      getDarkMode: 'getDarkMode',
      getSnackBarOpen: 'getSnackBarOpen',
      getSnackBarText: 'getSnackBarText',
      getSnackBarColor: 'getSnackBarColor',
    }),
  },
})
export default class NotificationSnackBar extends Vue {
  @Watch('getSnackBarOpen')
  onIDCounterChanged(val: any, oldVal: any) {
    console.log('getSnackBarOpen VAL:' + val)
    console.log('getSnackBarOpen OLDVAL: ' + oldVal)
    /*    this.snackBarOpen = val
    Utils.sleep(this.timeout).then(() => {
      //let central store update cycle finish properly
      this.snackBarOpen = !this.snackBarOpen
    }) */
  }

  private timeout: number = 4000
  private snackBarOpen: boolean = false
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  bottom: 0;
  right: 0;
  padding-right: 40px;
}
</style>
