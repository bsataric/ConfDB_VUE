<template>
  <div class="notification-container">
    <NotificationBar
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
    />
  </div>
</template>

<script lang="ts">
import NotificationBar from '@/components/NotificationBar.vue'
import { Component, Vue } from 'vue-property-decorator'

import { mapState } from 'vuex'

@Component({
  components: {
    NotificationBar,
  },
  computed: {
    ...mapState(['notifications']),
  },
})
export default class NotificationContainer extends Vue {}
</script>

<style scoped>
.notification-container {
  position: fixed;
  bottom: 0;
  right: 0;
  padding-right: 40px;
}
</style>
