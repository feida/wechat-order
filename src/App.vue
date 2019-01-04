<template>
  <div id="app">
    <!-- <transition name="router-fade" mode="out-in"> -->
      <router-view ></router-view>
    <!-- </transition> -->
  </div>
</template>

<style scoped lang="less">
	.router-fade-enter-active, .router-fade-leave-active {
    transition: 0s;
  }
  .router-fade-enter, .router-fade-leave-active {
    opacity: 0;
  }
  #app {
    position: relative;
    height: 100%;
    // #content-home {
    //   height: calc(100% - 76px);
    // }
  }
</style>
