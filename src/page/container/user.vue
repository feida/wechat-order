<template>
  <div id="app">
    <div id="content-home">
      <transition name="router-fade" mode="out-in">
        <router-view
          :shop="shop"
          :customer="customer"
          @open-comments="openComments"
          @open-register="showRegister=true"
          ></router-view>
      </transition>
    </div>
  	<div class="bottom-fixed" id="main-menu">
	    <div id="ul-menu">
	      <router-link :to="{ path: '/user/'+f.routerName }" v-for="(f,index) in routerList" @click.native="linkChange(f)" class="flex-item" :class="[activeClass]" :key="index">
	        <i></i>
	        <span>{{f.name}}</span>
	      </router-link>
	    </div>
    </div>
    <!-- 注册红包 -->
    <RegisterWelcome v-if="showRegister" :showRegister.sync="showRegister" ></RegisterWelcome>
    <!-- 评论红包 -->
    <Comments v-if="showComments" :showComments.sync="showComments" :orderId="currOrderId"></Comments>
    <!-- loading -->
    <Loading v-if="requesting" :type="3"></Loading>
  </div>
</template>

<script>
  import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
  import { newPackageApi,wxConfigApi,checkApi } from '../../fetch/api'
  import RegisterWelcome from '../../components/dialog/register-welcome.vue'      //注册红包
  import Comments from '../my/com/comments.vue'                                   //评论红包
  import Loading from '../../components/Global/packages/message/src/message.vue' // 全局请求loading
  import * as CustomerType from '../../store/actionType/customerType.js'
  import Utils from '../../utils/utils.js'
  import wx from 'weixin-js-sdk'                                             // 微信sdk
  export default {
    name: 'app',
    data () {
      return {
        showRegister: false,        // 显示注册红包
        showComments: false,        // 显示评论红包
        currOrderId: null,
        activeClass: 'active2',     // css背景图icon
        routerList:[
          {
            name:"品牌故事",
            routerName:'home'
          },
          {
            name:"点餐",
            routerName:'order'
          },
          {
            name:"我的",
            routerName:'my'
          }
        ]
      }
    },
    components: {
      Loading,
      RegisterWelcome,
      Comments
    },
    computed: {
      ...mapGetters([
        'loadFamily',
        'requesting',
        'customer',
        'shop',       // 店铺设置
        'brandSetting' // 品牌设置
      ])
    },
    watch: {
      'customer': function(newVal, oldVal) {
        if (newVal && newVal.accountId) {
          // setTimeout(function () {
          //   this.resetWindow();
          // }, 3500)
        }
      },
      loadFamily: function(newVal, oldVal) {
        if (newVal) {
          this.$kiko_loading({
            isShow: false
          });
        }
      },
    },
    async created(){
      await this.showNewPackage();
      
      await Utils.wxConfig();
      wx.ready(function(){
        //批量隐藏功能
        wx.hideMenuItems({
          menuList: ['menuItem:share:weiboApp','menuItem:share:QZone','menuItem:share:email','menuItem:share:brand',
            'menuItem:copyUrl','menuItem:originPage','menuItem:editTag','menuItem:delete','menuItem:share:facebook',
            'menuItem:favorite','menuItem:share:qq','menuItem:share:appMessage','menuItem:share:timeline','menuItem:exposeArticle']
        });
      });
    },
    methods:{
      // resetWindow(){
      //   let main_menu = $("#main-menu");
      //   let content = $("#content-home");
      //   let height = $(window).height();
      //   content.height(height - main_menu.height());
      //   content.css({
      //     overflow: "hidden",
      //     position: "relative"
      //   });
      // },
      async showNewPackage() {
        let res = await checkApi.registered()
        if (res.success){
          // 是否显示注册红包
          if(this.customer.isBindPhone == false){
            this.showRegister = true;
          }
        }else{
          // 是否显示评论红包
          let response = await newPackageApi.new();
          if (response.data && response.data.id) {
            this.currOrderId = response.data.id;
            this.showComments = true;
          } 
        }
      },
      linkChange(f){
        if (f.routerName === 'home') {
          this.activeClass = 'active1'
        } else if(f.routerName === 'order') {
          this.activeClass = 'active2'
          // console.log("您还有红包未领取______");
        } else if (f.routerName === 'my') {
          this.activeClass = 'active3'
        }
      },
      // @Listener打开评论红包
      openComments(orderId) {
        this.showComments=true
        this.currOrderId = orderId;
      }
    }
  }
</script>

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
    #content-home {
      height: calc(100% - 76px);
    }
  }
  .bottom-fixed {
    left: 0;
    bottom: 0;
    width: 100%;
    display: block;
    position: fixed;
    background: linear-gradient(#fbfbfb, #e6e6e6);
    background: -webkit-linear-gradient(#fbfbfb, #e6e6e6);
  }
  .bottom-fixed #ul-menu {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    height: 76px;
    margin: 0 -22px;
  }
  .bottom-fixed #ul-menu .flex-item i {
    display: block;
    width: 12px;
    height: 12px;
    background: #ddd;
    border-radius: 50%;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    bottom: 20px;
	}
	.bottom-fixed #ul-menu .flex-item.active span {
    bottom: 40px;
  }
  .bottom-fixed #ul-menu .flex-item span {
      display: block;
      text-align: center;
      font-size: 0.875rem;
      color: #565554;
      line-height: 42px;
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      bottom: 25px;
  }
  .bottom-fixed #ul-menu .flex-item {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    height: 100%;
    float: left;
    position: relative;
  }
  .bottom-fixed .flex-item.active::before {
    content: "";
    display: block;
    height: 45px;
    width: 45px;
    border-radius: 50%;
    position: absolute;
    bottom: 3px;
    z-index: 2;
    left: 0;
    right: 0;
    margin: auto;
    // background-image: url(../../../static/img/buttom.png);
    background-size: 45px;
    font-size: 0.01vw;
    text-align: center;
    line-height: 45px;
    color: #646464;
  }
  .bottom-fixed .flex-item.active1::before {
    background-image: url(../../assets/img/icon-home.png);
  }
  .bottom-fixed .flex-item.active2::before {
    background-image: url(../../assets/img/icon-order.png);
  }
  .bottom-fixed .flex-item.active3::before {
    background-image: url(../../assets/img/icon-my.png);
  }
  .bottom-fixed #ul-menu>.flex-item:after {
    content: "";
    height: 2px;
    background: #ddd;
    display: block;
    position: absolute;
    top: 0;
    bottom: -26px;
    margin: auto;
    width: 100%;
  }
  .bottom-fixed #ul-menu>.flex-item:first-child:after {
    width: 50%;
    right: 0;
  }
  .bottom-fixed #ul-menu>.flex-item:last-child:after {
    width: 50%;
    left: 0;
  }
</style>
