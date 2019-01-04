<template lang="html">
  <div class="full-height" id="my-wrap" style="background-color: #fff;"  >
    <div >
    <!--个人信息-->
    <div class="weui-cell weui-cell_access" style="padding: 15px;" @click="toInformation">
      <div class="weui_cell_head">
        <img class="customerPhoto" :src="customer.headPhoto" />
      </div>
      <div class="weui_media_bd">
        <div class="weui_media_title">
          <span>{{customer.nickname}}</span>
          <img class="customerSexSmall" src="../../assets/img/man.png" v-if="customer.sex == 1" />
          <img class="customerSexSmall" src="../../assets/img/woman.png" v-if="customer.sex == 2" />
          <!-- 付费会员 徽章 -->
          <img v-if="customerSvip" class="superMember" src="../../assets/img/superMember.png" />
          <!-- 开通成为付费会员 -->
          <button v-if="!customerSvip && activity.activityImg" class="weui_btn weui_btn_mini charge-btn charge-btn-svip colorFix" id="getSvipNow" style="border-radius: 13px;background: #333;" @click.stop="chargeMemberNow(activity.id)">
            <span>开通会员</span>
          </button>
        </div>
        <p class="weui_media_tell" v-if="customer.isBindPhone">手机号：{{customer.telephone}}</p>
        <button class="weui-btn weui-btn_mini bind-btn colorFix" v-if="!customer.isBindPhone" @click.stop="registerNow" style="border-radius: 10px;">
          <span>立即注册</span>
        </button>
      </div>
      <div class="myCode" @click.stop="showPayCode">
        <img class="payCode" src="../../assets/img/share.png" alt="邀请码" />
        <span>邀请奖励</span>
      </div>
      <div class="weui-cell__ft"></div>
    </div>
    <!--个人账户-->
    <div class="weui-cell weui-cell_access" style="border-top: 0.82em solid #E7E7E7;" @click="showCustomerAccount">
      <div class="weui-cell__hd margin">
        <img class="iconImg" src="../../assets/img/account.png" />
      </div>
      <div class="weui-cell__bd">
        <p>账户余额</p>
      </div>
      <div class="weui-cell__ft"><span class="price">{{customer.account}}</span></div>
    </div>
    <!--账户充值-->
    <!--<chargeRules v-if="chargeList.length>0" :chargeList="chargeList"></chargeRules>-->
    <div class="weui-cell weui-cell_access" @click="showChargeDialog">
      <div class="weui-cell__hd margin">
        <img class="iconImg" src="../../assets/img/charge.png" />
      </div>
      <div class="weui-cell__bd">
        <p>账户充值</p>
      </div>
      <div class="weui-cell__ft">
        <button class="weui-btn weui-btn_mini charge-btn colorFix" v-for="c in chargeList">
          <span>{{c.labelText}}</span>
        </button>
      </div>
    </div>
    <!--优惠券-->
    <div class="weui-cell weui-cell_access" @click="showCustomerCoupon">
      <div class="weui-cell__hd margin">
        <img class="iconImg" src="../../assets/img/coupon.png" />
      </div>
      <div class="weui-cell__bd">
        <p>我的优惠券</p>
      </div>
      <div class="weui-cell__ft"></div>
    </div>
    <!--评论-->
    <div class="weui-cell weui-cell_access" @click="showMyComment">
      <div class="weui-cell__hd margin">
        <img class="iconImg" src="../../assets/img/appraise.png" />
      </div>
      <div class="weui-cell__bd">
        <p>我的评论</p>
      </div>
      <div class="weui-cell__ft"></div>
    </div>
    <!--返利-->
    <div class="weui-cell weui-cell_access" @click="showRecord">
      <div class="weui-cell__hd margin">
        <img class="iconImg" src="../../assets/img/rebate.png" />
      </div>
      <div class="weui-cell__bd">
        <p>返利足迹</p>
      </div>
      <div class="weui-cell__ft"></div>
    </div>
    <!-- 发票管理 -->
    <!-- <div class="weui-cell weui-cell_access" @click="showInvoiceTypeList=true" v-if="brandSetting.data.receiptSwitch == 1"> -->
    <div class="weui-cell weui-cell_access" @click="showInvoiceTypeList=true" >
      <div class="weui-cell__hd margin">
        <img class="iconImg" src="../../assets/img/rebate.png" />
      </div>
      <div class="weui-cell__bd">
        <p>发票管理</p>
      </div>
      <div class="weui-cell__ft"></div>
    </div>
    <!--订单列表-->
    <div class="order-list-mini">
      <div class="weui-cells" style="border-top: 0.82em solid #E7E7E7;margin-top: inherit;font-size: 1rem;">
        <div class="weui-cell">
          <div class="weui-cell__hd margin">
            <img class="iconImg" src="../../assets/img/order.png" />
          </div>
          <div class="weui-cell__bd">
            <p>我的订单</p>
          </div>
        </div>
        <div class="weui-cell item" v-for="(item, index) in listOrder" >
          <div class="weui-cell__bd order-mini-detailed" @click="showOrderInfo(item.id)">
            <p>{{item.shopName}}</p>
            <p><span>桌号:{{item.tableNumber}} </span><span class="font-mini">共计{{item.countWithChild || item.articleCount}}个餐品</span></p>
            <p><span class="font-mini">下单时间: {{item.createTime && new Date(item.createTime.time).format('yyyy-MM-dd hh:mm')}}</span></p>
          </div>
          <div>
            <span class="order-state">{{item | statusText}}</span>
            <!-- <a class="weui-btn weui-btn_mini weui_btn_main order-operator" @click.stop="getRedPackage(item.id)">领取红包</a> -->
            <orderButton :customClass="{'weui-btn_mini':true, 'weui_btn_main':true, 'order-operator':true}" :orderInfo="item"
              @receive-red-papper="receiveRedPapper"
              @jump-share="jumpShare"
            ></orderButton>
          </div>
        </div>
        <div class="weui-cell" v-if="load">
          <p>
            <img class="loadingImg" src="../../assets/img/loading.gif" alt="加载中" />
            <span>正在加载中...</span>
          </p>
        </div>
        <div class="weui-cell" v-if="over">
          <p>
            <img class="loadingImg" src="../../assets/img/gou.png" alt="加载中" />
            <span>已经全部加载完成</span>
          </p>
        </div>
      </div>
    </div>
  </div>
  <!-- <code-dialog :codeDialogShow="codeDialogShow" :customer="customer" @close-dialog="get"></code-dialog> -->
  <codeInvite v-if="codeDialogShow" :codeDialogShow.sync="codeDialogShow" :customer="customer"></codeInvite>
  <customer-account :accountShow="accountShow" :customer="customer" @close-account="closeAccount"></customer-account>
  <customer-coupon v-if="couponShow" @close-coupon="closeCoupon"></customer-coupon>
  <CustomerNewOrder v-if="showOrderState" :orderId="currOrderId" :orderInfo="currOrderInfo" @closeOrder="showOrderState=false"
    :showOrdersQueue.sync="showOrdersQueue"
    @receive-red-papper="receiveRedPapper"
    @jump-share="jumpShare"
  ></CustomerNewOrder>
  <OrdersQueue v-if="showOrdersQueue" :orderId="currOrderId" @closeOrdersQueue="showOrdersQueue=false"></OrdersQueue>
  <!-- <redPackage :redDialogShow="showRedPackage" txt="完成评论即可领取" :customer="customer" :setting="brandSetting" @close-redpackage="closePackage" @open-appraise="openCommentsDialog"></redPackage> -->
  <!-- <Comments v-if="showComments" :orderId="currOrderId" @close-comments="showComments=false" @add-praise="addPraise"></Comments>
  <CommentsMoney v-if="showCommentsMoney==true" :orderId="currOrderId" @jump-share="jumpShare" @close-comments-money="showCommentsMoney=false"></CommentsMoney>-->
  <CommentsShare v-if="showCommentsShare==true" :orderId="currOrderId" @close-comments-share="showCommentsShare=false"></CommentsShare> 
  <recharge v-if="chargeDialog" :chargeList="chargeList" ></recharge>
  <InvoiceTypeList v-if="showInvoiceTypeList"></InvoiceTypeList>
  </div>
</template>

<script>
  import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
  // import codeDialog from '../../components/dialog/code.vue'   //二维码
  import codeInvite from '../../components/dialog/codeInvite.vue'   //邀请二维码
  import customerAccount from '../../components/dialog/account.vue'   //个人账户
  import customerCoupon from '../../components/dialog/coupon.vue'   //优惠券
  import { customerApi, orderStatus, rulesList } from '../../fetch/api.js'
  import CustomerNewOrder from './com/customerNewOrder.vue'      //订单状态轮询
  import orderButton from './com/orderButton.vue'             //订单按钮
  import OrdersQueue from './com/ordersQueue.vue'             //队列中的号码
  // import redPackage from '../../components/dialog/redpackage.vue' //红包封面
  // import Comments from './com/comments.vue'                   //评论领取红包组件
  // import CommentsMoney from './com/comments-money.vue'        //评论奖励金额
  import CommentsShare from './com/comments-share.vue'        // 分享评论，红包返利
  import * as statusCfg from '../../config/statusCfg.js'      // 状态配置
  import recharge from '../../components/dialog/recharge.vue'     // 充值活动
  import InvoiceTypeList from './com/invoice/typeList.vue'     // 选择发票类型
  import Iscroll from 'iscroll'
  import activityMixin from '../order/com/activityMixin.js';              // 处理Svip，付费

  let iscrollObj = null;
  export default {
    props: {
      customer: {
        type: Object
      },
      setting: {
        type: Object
      },
      redDialogShow:{
        type: Boolean
      }
    },
    mixins: [activityMixin],
    data () {
      return {
        codeDialogShow: false,
        accountShow: false,
        couponShow: false,
        chargeList: [],           // 充值优惠列表
        showOrderState: false,   // 显示订单状态
        showOrdersQueue: false,  // 队列中号码显示
        // showRedPackage: false,   // 显示红包封面
        // showComments: false,     // 显示评论
        // showCommentsMoney: false,  // 显示评论后，获得金额
        showCommentsShare: false,  // 分享好友，
        currOrderId: '',         // 可能是路由传入或者点击订单列表
        currOrderInfo: {},       // 当前订单的信息
        listOrder: [],           // 用户订单列表
        showInvoiceTypeList: false, // 发票选择界面
        disableTouch: false,
        load:false,
        over:false,
        pageOption:{start:0,datalength:2,orderState:"1,2,10,11",},
      }
    },
    computed: {
      ...mapGetters([
        // 'customer',
        'chargeDialog',
        'shop',       // 店铺设置
        'brandSetting' // 品牌设置
      ])
    },
    components: {
      // 'code-dialog':codeDialog,
      codeInvite,
      'customer-account':customerAccount,
      'customer-coupon':customerCoupon,
      CustomerNewOrder,
      orderButton,
      OrdersQueue,
      // redPackage,
      // Comments,
      // CommentsMoney,
      CommentsShare,
      recharge,
      InvoiceTypeList
      // RedPaper
    },
    created(){
      let that = this;
      if (!this.customer || !this.customer.accountId) {
        this.$router.push({path:'/'});
      }
      // console.log(this.redDialogShow);
      this.getListOrder();
      rulesList.getRulesList().then(response => {
        that.chargeList = response.data;
      });
      // 推送逻辑
      if (this.$route.query.waitQueue) {
        this.currOrderId = this.$route.query.waitQueue;
        this.showOrdersQueue = true;      // 推送：显示队列组件
      }
      // 推送逻辑 显示余额
      if (this.$route.query.myYue) {
        this.accountShow = true;        
      }
      // 推送逻辑 显示二维码
      if (this.$route.query.scanAqrCode) {
        this.codeDialogShow = true;
      }
      // 判断是否有正在处理的订单
      this.currOrderId = this.$route.query.orderid || '';
      if (this.currOrderId.length > 0) {

        // let params = {orderId: this.currOrderId};
        // orderStatus.customerNewOrder($.param(params)).then(res => {
        //   if (res.success == true && res.data) {
        //     this.currOrderInfo = res.data;
            // if (res.data.orderState == 10 && res.data.allowAppraise==true ) {
            //   // 已消费并可评论 弹出红包
            //   this.showComments = true;
            // } else if (res.data.productionStatus == 2 && res.data.orderMode==2) {
            // // 如果打印状态为已打印且为电视叫号模式
            // // orderMode|shopMode 1:（废弃） 2:电视叫号 3:验证码 4：废弃 5：废弃 6： boss（有先付后付）
            //   this.OrdersQueue = true;
            // } else {
            //   // 弹出轮询订单状态组件
            //   this.showOrderState = true;
            // }
        //   }
        // })

      }
    },
    watch: {
      currOrderInfo(newVal, oldVal) {
        let order = newVal;
        if (order.orderState == 10 && order.allowAppraise==true ) {
          // 已消费并可评论 弹出红包
          //this.showRedPackage = true;
        } else if (order.productionStatus == 2 && order.orderMode==2) {
        // 如果打印状态为已打印且为电视叫号模式
        // orderMode|shopMode 1:（废弃） 2:电视叫号 3:验证码 4：废弃 5：废弃 6： boss（有先付后付）
          this.OrdersQueue = true;
        } else {
          // 弹出轮询订单状态组件
          this.showOrderState = true;
        }
      },
      listOrder(newVal) {
        if (newVal.length > 0 && newVal.length <= this.pageOption.datalength) {
          this.$nextTick(() => {
            this._initScroll();
          })
        }
      }
    },
    methods:{
      showChargeDialog(){
        this.$store.commit('setCharge', true);
      },
      _initScroll() {
        let options = {
          click: false,
          // preventDefault: true,
          preventDefaultException:{tagName:/.*/},
          tap: false,
          bounce: true,
          disableMouse: true,
          disablePointer: true,
          disableTouch: false,
          // probeType: 3  // scroll事件 
        }
        let that = this;
        iscrollObj = new Iscroll('#my-wrap', options);
        iscrollObj.on('scrollEnd', function() {
          if (this.y <= this.maxScrollY) {
            console.log("scrollEnd");
            that.loadNextPage();
          }
        });
      },
      // getIscroll(iscroll){
      //   let that = this;
      //   if (iscroll) {
      //     iscrollObj = iscroll;
      //     iscroll.on('scrollEnd', function() {
      //       if (this.y <= this.maxScrollY) {
      //         console.log("scrollEnd");
      //         that.loadNextPage();
      //       }
      //     });
      //   }
      // },
      loadNextPage:function(){
        let that = this;
        if(!this.load&&!this.over){
          this.load=true;
          that.pageOption.start = that.pageOption.start+that.pageOption.datalength;
          orderStatus.listOrder($.param(that.pageOption)).then(res => {
            if (res.statusCode === '200') {
              for(var i in res.data){
                that.listOrder.push(res.data[i]);
                that.listOrder = [...that.listOrder];
              }
              if(res.data.length<that.pageOption.datalength){
                that.over=true;
              }
              iscrollObj && iscrollObj.refresh();
              that.load=false;
            }
          })
        }
      },
      // 获取订单列表
      getListOrder() {
        // 获取订单列表
        orderStatus.listOrder($.param(this.pageOption)).then(res => {
          if (res.statusCode === '200') {
            this.listOrder = res.data;
            this.listOrder.forEach(orderInfo => {
              if (orderInfo.id === this.currOrderId) {
                this.currOrderInfo = orderInfo;
              }
            })
            this.listOrder = [...this.listOrder];
            iscrollObj && iscrollObj.refresh();
          }
        })
      },
      showPayCode(){
        this.codeDialogShow = true;
      },
      get(msg){
        this.codeDialogShow = msg;
      },
      showCustomerAccount(){
        this.accountShow = true;
      },
      closeAccount(state){
        this.accountShow = state;
      },
      showCustomerCoupon(){
        this.couponShow = true;
      },
      closeCoupon(state){
        this.couponShow = state;
      },
      showRecord(){
        this.$router.push({ path: '/user/record'});
      },
      showOrderInfo(orderId) {
        this.currOrderId = orderId;
        let index = this.listOrder.findIndex(item => item.id===orderId)
        // console.log(index)
        this.currOrderInfo = this.listOrder[index];
        this.showOrderState = true;
      },
      registerNow(){
        this.$emit('open-register');
      },
      showMyComment(){
        let that = this;
        this.$router.push({ path: '/user/myComment',query:{customer:that.customer}});
      },
      toInformation(){
        this.$router.push({ path: '/user/myInformation'});
      }, 
      //=============================================================
      //下面全是监听事件回调
      //=============================================================
      //领取评论红包
      receiveRedPapper(orderId) {
        // console.log(333444)
        console.log(orderId, 'my.vue-407');
        this.currOrderId = orderId;
        this.showOrderState = false;
        this.$emit('open-comments', orderId)
      },
      // @Listener分享返利
      jumpShare(orderId) {
        this.currOrderId = orderId;
        this.showOrderState = false;      // 在弹出层点击的情况
        this.showCommentsShare = true;
      }
    }
  }
</script>

<style lang="less">
  @import '../../assets/css/my.css';
  #my-wrap {
    .order-operator {
      // display: inline;
      margin-bottom: -30px;
      padding: 0 4px;
      line-height: 1.9;
      a {
        display: inline-block;
        background-color: #000;
        font-size: 1rem;
      }
    }
    .superMember {
      width: 64px;
      height: 18px;
      display: inline-block;
      vertical-align: top;
      position: relative;
      top: 3px;
    }
    .charge-btn-svip {
      transform: translateY(-2px);
      position: relative;
      // top: 3px;
      border: none;
      outline: none;
      height: 1.3rem;
      line-height: 1.3rem;
      > span {
        display: block;
        height: 1.3rem;
        line-height: 1.3rem;
      }
      // position: absolute;
      // top: 6px;
      // left: 6px;
    }
  }
</style>
