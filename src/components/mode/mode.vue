<template>
  <div class="weui_dialog_confirm">
  	<div class="weui-mask" @click="close"></div>
  	<div class="weui_dialog_mode">
    		<a class="weui-btn" @click="choiceMode(3)" style="background-color: #868686;color: #fff;">外带</a>
    		<a class="weui-btn weui-btn_primary" @click="choiceMode(1)" style="margin-top: 30px;">堂吃</a>
    	</div>
  </div>
</template>

<script>
import * as TYPE from '../../store/actionType/orderType'
import {
  mapGetters,
  mapActions,
  mapMutations
} from 'vuex'
export default {
  props: {

  },
  data(){
    return {

    }
  },
  computed: {
    ...mapGetters([
      'orderParams'
    ])
  },
  methods:{
    close(){
      this.$emit("close-mode");
    },
    choiceMode(distributionModeId){
      this.$store.commit(TYPE.SET_ORDER_PARAMS, {...this.orderParams, distributionModeId});
      this.$router.push({ path: '/user/placeOrder'});
    }
  }
}
</script>

<style scoped>
  .weui_dialog_mode {
    position: fixed;
    z-index: 1000;
    width: 80%;
    top: 60vh;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
    border-radius: 10px;
  }
</style>
