<template lang="html">
  <div class="weui_dialog_confirm">
    <div class="weui-mask" @click="close"></div>
    <div class="weui_dialog red_bg">
      <div class="topcontent">
        <div class="red_avatar">
          <img :src="brandSetting.data.redPackageLogo">
          <span class="close" @click="close">+</span>
        </div>
        <h2>{{brandSetting.data.brandName}}</h2>
        <span class="text">发了一个红包</span>
        <div class="red_description">{{txt}}</div>
      </div>
      <div class="chai">
        <span @click="open">開</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'

  export default {
    props: {
      txt: {
        type: String,
        default: '完成注册即可领取'
      }
    },
    data () {
      return {

      }
    },
    computed: {
      ...mapGetters([
        'brandSetting' // 品牌设置
      ])
    },
    methods:{
      close(){
        this.$emit('close-redpackage');
        // this.$emit()
      },
      open() {
        // console.log(this.showRegister);
        // if(this.showRegister){
        //   this.$emit('close-redpackage');
        //   this.$router.push({ path: '/user/register'});
        // }else{ //打开评论
        //   this.$emit('open-appraise');
        // }
        this.$emit('open')
      }
    }
  }
</script>

<style scoped>
  .red_bg {
    background: #d55041;
    color: #ffb896;
  }
  .topcontent {
    height: 280px;
    border: 1px solid #df5548;
    background: #df5548;
    border-radius: 10px 10px 50% 50%/10px 10px 15% 15%;
    box-shadow: 0 2px 0 -1px rgba(0, 0, 0, 0.2);
  }
  .red_avatar {
    position: relative;
  }
  .red_avatar img {
    width: 80px;
    height: 80px;
    border: 1px solid #df5548;
    border-radius: 50%;
    overflow: hidden;
    margin-top: 5%;
  }
  .red_avatar .close {
    position: absolute;
    top: 5px;
    left: 15px;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    font-size: 2em;
  }
  .topcontent h2 {
    font-size: 1em;
  }
  .text {
    font-size: 1.2em;
  }
  .red_description {
    margin: 20px 0;
    font-size: 1.6em;
    font-weight: 600;
    color: #dbeeac;
  }
  .chai {
    width: 110px;
    height: 110px;
    border: 2px solid #cfae78;
    background-color: #dcbb85;
    border-radius: 50%;
    display: inline-block;
    margin-top: -50px;
    box-shadow: 0 4px 0 0 rgba(0, 0, 0, 0.2);
  }
  .chai span {
    width: 100px;
    height: 100px;
    border: 2px solid #cfae78;
    background-color: #dcbb85;
    border-radius: 50%;
    color: #383a35;
    font-size: 3.5em;
    font-weight: bold;
    line-height: 100px;
    margin-top: 3px;
    display: inline-block;
  }
</style>
