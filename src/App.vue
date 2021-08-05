<template>
  <div id="app">
    <h1>App</h1>
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
Vue.extend({
  data () {
    return {
      a: 1,
      b: '2',
      c: [],
      d: {
        a: 1,
        b: '2'
      }
    }
  },
  methods: {
    test () {
      // this.b.acv()
    }
  }
})

</script>

<style lang="scss"></style>
