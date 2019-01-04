<template>
  <div class="invoice-titleAdd weui_success_toast" style="font-size: 16px;">
    <div class="weui-cell title-box">
      <!-- <div class="weui-cell__bd"> -->
        <span style="vertical-align: middle;">发票类型</span>
        <router-link :to="{ path: '/user/invoice/titleApply/'+f.routerName }" v-for="(f,index) in routerList" class="flex-item" :key="index">
          <span>{{f.name}}</span>
        </router-link>
        <!-- <span class="weuiBtn weui_btn_mini active">单位</span>
        <span class="weuiBtn weui_btn_mini">个人</span> -->
      <!-- </div> -->
    </div>
    <!-- router-view -->
    <router-view></router-view>
    
  </div>
</template>

<script>
  export default {
    data () {
      return {
        routerList:[
          {
            name:"单位",
            routerName:'applyCompany'
          },
          {
            name:"个人",
            routerName:'applyPerson'
          }
        ]
      }
    }
  }
</script>

<style lang="less">
.invoice-titleAdd {
  position: fixed;
  z-index: 10;
  width: 100%;
  height: 100%;
  background-color: #fff;
  >.title-box {
    border-bottom: 1px solid #dfdfdf;
    display: flex;
    >span {
      flex: 2;
    }
    >a {
      flex: 1;
      text-decoration: none;
      padding: 0 1em;
      line-height: 2.3;
      font-size: 13px;
      color: #000;
      vertical-align: middle;
      margin-left: 10%;
      border: 1px solid #848484;
      border-radius: 5px;
      text-align: center;
      &.active {
        background-color: #000;
        color: #fff;
      }

    }
  }
}
</style>
