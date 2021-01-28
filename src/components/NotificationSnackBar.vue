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
        <v-btn color="blue" text v-bind="attrs" @click="closeSnackbar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
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
  private timeout: number = 4000

  async closeSnackbar() {
    await this.$store.dispatch('setSnackBarOpen', false)
  }
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
