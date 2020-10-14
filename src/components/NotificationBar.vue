<template>
  <div class="notification-bar" :class="notificationTypeClass">
    <p>
      {{ notification.message }}
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapActions } from 'vuex'

@Component({
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
  computed: {
    notificationTypeClass() {
      return '-text-${this.notification.type}'
    },
  },
  methods: {
    ...mapActions('notification', ['remove']),
  },
})
export default class NotificationBar extends Vue {
  private timeout: any = null

  mounted() {
    //this.timeout = setTimeout(() => this.remove(this.notification), 5000) //this is difficult in TS
  }

  beforeMount() {
    clearTimeout(this.timeout)
  }
}
</script>

<style scoped>
.notification-bar {
  margin: 1em 0 1em;
}
</style>
