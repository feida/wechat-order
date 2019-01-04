<template>
  <MaskWrap @close="$emit('close')">
    <div class="weui_dialog_activity">
      <div class="activityFixed"> 
        <img class="activityImg" src="../../../assets/img/activity.png">
        <div class="activityTitle">
          <p>{{activity.svipPrice}}元办理菁英会员卡</p>
          <p>锅底终生免费吃</p>
        </div>
        <div class="activityText">
          <p>活动规则：</p>
          <p>1、活动时间：{{new Date(activity.beginTimes).format("yyyy年MM月dd日")}}至{{new Date(activity.endTimes).format("yyyy年MM月dd日")}}</p>
          <p>2、同一用户只能办理一次</p>
          <p>3、办理成功后不支持退款服务</p>
          <p>4、本次活动解释权归{{shop.brandName}}所有</p>
        </div>
      </div>
      <p class="payMemberBtn" @click="$parent.chargeMemberNow(activity.id)">立即加入</p>
    </div>
  </MaskWrap>
</template>

<script>
  import MaskWrap from '../../../components/dialog/wrap/mask-wrap.vue';
  
  export default {
    components: {
      MaskWrap
    },
    props: {
      activity: Object,
      shop: Object,
    },
    methods: {
    }
  }
</script>

<style lang="less">
.weui_dialog_activity {
  position: fixed;
  z-index: 2;
  width: 88vw;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
  >.activityFixed {
    position: relative;
    top: 1vh;
    height: 84vh;
    >img.activityImg {
      width: 88vw;
      height: 84vh;
    }
    >.activityTitle {
      position: relative;
      top: -36vh;
      color: #8ead99;
      font-size: 1rem;
    }
    >.activityText {
      position: relative;
      width: 68vw;
      top: -36vh;
      text-align: left;
      margin-left: 13vw;
      color: #8ead99;
      font-size: 12px;
    }
  }
  >p.payMemberBtn {
    position: relative;
    top: 5vh;
    margin: 0 auto;
    width: 50vw;
    height: 10vw;
    color: #fff;
    background: #8ead99;
    border-radius: 5px;
    line-height: 10vw;
  }
}
</style>
