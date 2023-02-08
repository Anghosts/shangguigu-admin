<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    this.$store.commit('styles/GET_STYLE')
  }
}
</script>

<style>
  /* 深度选择器 */
  /*
    >>>       用于原生css
    /deep/    用于less
    ::v-deep  用于scss
  */
</style>
