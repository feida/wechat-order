<template>
  <div class="starList">
  <span class="starLevel">
    <img src="../../assets/img/star_red.png" v-if="level==5" v-for="i of level" class="starImg" />
    <img src="../../assets/img/star_black.png" v-if="level<=4" v-for="i of level" class="starImg" />
    <img src="../../assets/img/star_empty.png" v-for="i of 5-level" class="starImg" style="margin-left: -3px;" />
  </span>
  </div>
</template>

<script>
export default {
  props: {
    level:Number
  },
  data () {
    return {

    }
  },
  created(){
    console.log(this.level);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .starList {
    display: inline-block;
    vertical-align: middle;
  }
  .starImg {
    width:16px;
    height:16px;
  }
</style>
