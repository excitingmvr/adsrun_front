<template id="countdown-template">
  <strong class="num">{{ days | two_digits }}일 {{ hours | two_digits }}시 {{ minutes | two_digits }}분 {{ seconds | two_digits }}초</strong>
</template>

<script>
import Vue from 'vue'

Vue.filter('two_digits', (value) => {
  if (isNaN(value) || Number(value) < 0) {
    return '00';
  }
  if (value.toString().length <= 1) {
    return `0${value}`;
  }
  return value;
})

export default {
  mounted() {
    window.setInterval(() => {
        this.now = Math.trunc((new Date()).getTime() / 1000);
    },1000);
  },
  props: {
    date: {
      type: String
    }
  },
  data() {
    return {
      now: Math.trunc((new Date()).getTime() / 1000)
    }
  },
  computed: {
    dateInMilliseconds() {
      var cnt = isNaN(Date.parse(this.date)) ? Date.parse(this.date.replace(/\s/, 'T')) : Date.parse(this.date)
      return Math.trunc(cnt / 1000)
    },
    seconds() {
      return (this.dateInMilliseconds - this.now) % 60;
    },
    minutes() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60) % 60;
    },
    hours() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60 / 60) % 24;
    },
    days() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60 / 60 / 24);
    }
  }
}
</script>