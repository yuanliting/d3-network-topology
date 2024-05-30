<template>
  <div id="app">
    <!-- <PageIndex /> -->
    <Index />
    <!-- <ReadJsonD3 /> -->
  </div>
</template>

<script>
// import PageIndex from './views/D3Index/page.vue'
import Index from './views/D3Index/index.vue'
// import ReadJsonD3 from './views/readJsonD3.vue'
export default {
  name: 'App',
  components: {
    // PageIndex
    Index,
    // ReadJsonD3
  }
}
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
