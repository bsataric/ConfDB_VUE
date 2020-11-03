<template>
  <div>
    <h1>
      Create an Event
      <form @submit.prevent="createSequence">
        <label>Select a category</label>
        <select v-model="event.category">
          <option v-for="cat in categories" :key="cat">{{ cat }}</option>
        </select>
        <h3>Name & describe your event</h3>
        <div class="field">
          <label>Title</label>
          <input
            v-model="event.title"
            type="text"
            placeholder="Add an event title"
          />
        </div>
        <div class="field">
          <label>Description</label>
          <input
            v-model="event.description"
            type="text"
            placeholder="Add a description"
          />
        </div>
        <h3>Where is your event?</h3>
        <div class="field">
          <label>Location</label>
          <input
            v-model="event.location"
            type="text"
            placeholder="Add a location"
          />
        </div>
        <h3>When is your event?</h3>
        <div class="field">
          <label>Date</label>
          <DatePicker v-model="event.date" placeholder="Select a date" />
        </div>
        <div class="field">
          <label>Select a time</label>
          <select v-model="event.time">
            <option v-for="time in times" :key="time">{{ time }}</option>
          </select>
        </div>
        <input type="submit" class="button -fill-gradient" value="Submit" />
      </form>
    </h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DatePicker from 'vuejs-datepicker'

@Component({
  components: { DatePicker },
})
export default class EventCard extends Vue {
  //@Prop({ default: null }) event

  private times: any = []
  private categories: any = this.$store.state.categories
  private event: any = this.createFreshEventObject()

  public constructor() {
    super()
    for (let i = 1; i <= 24; i++) {
      this.times.push(i + ':00')
    }
  }

  public createSequence() {
    this.$store
      .dispatch('event/createSequence', this.event)
      .then(() => {
        this.event = this.createFreshEventObject()
      })
      .catch(() => {
        console.log('There was a problem creating your event')
      })
  }
  public createFreshEventObject() {
    const user = this.$store.state.user
    const id = Math.floor(Math.random() + 100000000)

    return {
      id: id,
      user: user,
      category: '',
      organizer: user,
      title: '',
      description: '',
      location: '',
      date: '',
      time: '',
      attendees: [],
    }
  }
}
</script>

<style scoped>
.event-card {
  padding: 20px;
  margin-bottom: 24px;
  transition: all 0.2s linear;
  cursor: pointer;
}
.event-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
}
.event-card > .title {
  margin: 0;
}
.event-link {
  color: black;
  text-decoration: none;
  font-weight: 100;
}
</style>
