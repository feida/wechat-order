<template lang="html">
  <div class="weui_dialog_confirm" v-if="">
  <div class="weui-mask" @click="close"></div>
  	<div class="weui_dialog">
      <div class="register_title">欢迎注册</div>
    </div>
  </div>
</template>

<script>
  import { codeApi } from '../../fetch/api'

  export default {
    props: {
      codeDialogShow:{
        type: Boolean,
        default: false
      }
    },
    data () {
      return {

      }
    },
    created:function() {
      let _this = this;

    },
    methods:{
      close(){

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .register_title {
    text-align: center;
    padding: 10px;
    margin-bottom: -10px;
    color: #c81623;
  }
</style>
