<template>
  <div class="weui_dialog_confirm coupon-wrap" >
    <div class="weui-mask" @click="close"></div>
    <div class="weui_dialog">
      <div class="full-height">
        <!--tab切换-->
        <div class="content">
          <div class="tabnav" style="border-radius: 10px 10px 0px 0px;">
            <div class="tabnav-item" :class="{active:nowState == a.state}" @click="changeTabItem(a)" v-for="a in couponTitleList">
              {{a.name}}<span>{{a.number}}</span>
            </div>
          </div>
        </div>

        <div id="scroll-wapper" v-iscroll=getIscroll>
          <ul class="CouponList" v-for="a in couponTitleList" v-if="nowState == a.state">
            <li v-for="f in a.couponList">
              <div class="pepper-w">
                <div class="pepper pepper-blue">
                  <div class="pepper-l">
                    <p class="pepper-l-num"><i>¥</i><span>{{f.value}}</span><span style="font-size:12px">{{f.name}}</span></p>
                    <p class="pepper-l-con">使用条件：
                      <span v-if="f.distributionModeId == 1">堂食</span>
                      <span v-if="f.distributionModeId == 2">外带</span>
                      <span> 消费满{{f.minAmount}}元可使用</span>
                    </p>
                    <p class="pepper-l-tim">使用时间：<span>{{new Date(f.beginTime.time).format("hh:mm:ss")}} - {{new Date(f.endTime.time).format("hh:mm:ss")}}</span></p>
                  </div>
                  <div class="pepper-r">
                    <span>有效期限</span>
                    <div style="padding: 5px 0;">{{new Date(f.beginDate.time).format("yyyy.MM.dd")}}<p class="pepper-line">至</p>{{new Date(f.endDate.time).format("yyyy.MM.dd")}}</div>
                  </div>
                </div>
                <div class="pepper-product" v-if="f.couponShopArticlesList && f.couponShopArticlesList.length>0">
                  <p>产品券所属：<span>{{brandSetting.brand.brandName}}-{{f.shopName}}</span></p>
                  <p>可用菜品：
                    <span v-for="article in f.couponShopArticlesList" style="margin: 0 3px;">{{article.articleName}}</span>
                  </p>						
                </div>
                <div class="pepper-b pepper-blue">
                  <div class="pb-con"></div>
                  <div class="pb-border"></div>
                </div>
              </div>
            </li>
            <li style="position: relative;top: 6rem;" v-if="a.couponList.length == 0">
              <img class="noTicket" src="../../assets/img/noTicket.png" alt="暂无优惠券">
              <p class="noTicketText">暂无此类型的优惠券</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { couponApi } from '../../fetch/api'
  import { mapGetters } from 'vuex'

  export default {
    // props: {
    //   couponShow:{
    //     type: Boolean,
    //     default: false
    //   }
    // },
    computed: {
      ...mapGetters([
        'brandSetting'
      ])
    },
    mounted() {
      // close-dialog-wrap
      // 阻止滑屏冒泡
      this.$nextTick(() => {
        $(".coupon-wrap").bind("touchstart", function(event){
          event.stopPropagation();
        })
      })
    },
    data () {
      return {
        nowState:1,
        couponTitleList:[
          {
            name:'未使用',
            state:1,
            status:0,
            number:0,
            couponList:[]
          },
          {
            name:'已过期',
            state:2,
            status:2,
            number:0,
            couponList:[]
          },
          {
            name:'已使用',
            state:3,
            status:1,
            number:0,
            couponList:[]
          }
        ],
        listCoupon:{},
      }
    },
    created(){
      let _this = this;
      // this.$watch("couponShow", function () {
      //   if (this.couponShow) {
          _this.couponTitleList.forEach(function (list) {
            let param = {
              status:list.status
            };
            couponApi.coupon($.param(param)).then((response) => {
              list.number = response.data.length;
              list.couponList = response.data.concat(list.couponList);
              _this.resetDomHeight();
            })
          })
      //   }
      // })
    },
    methods:{
      close(){
        this.$emit('close-coupon',false);
        this.couponTitleList.forEach(function (list) {
          list.couponList = [];
        })
      },
      changeTabItem(a){
        this.nowState = a.state;
      },
      resetDomHeight() {
        let mainHeight = $(".weui_dialog");
        let header = $(".content");
        let content = $("#scroll-wapper");
        content.height(mainHeight.height() - header.height());
      },
      getIscroll(iscroll){
        if (iscroll) {
          iscroll.on('scrollEnd', function() {
            console.log("scrollEnd");
          });
        }
      }
    }
  }
</script>

<style>
  /* 优惠券coupon */
  #scroll-wapper {
    position: relative;
    overflow: hidden;
    border-radius: 10px;
  }
  .tabnav {
    width: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    box-sizing: border-box;
    background: #FFFFFF;
    border-bottom: 1px solid #ccc;
    box-shadow: 0 1px 2px #ccc;
  }
  .tabnav .tabnav-item {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    text-align: center;
    height: 42px;
    line-height: 42px;
    font-size: 14px;
  }
  .tabnav .tabnav-item.active {
    border-bottom: 2px solid #c81623;
    color: #c81623;
    font-weight: 700;
  }
  .tabnav .tabnav-item >span:before {
    content: "(";
  }
  .tabnav .tabnav-item >span:after {
    content: ")";
  }
  .CouponList {
    background: #fff;
  }
  .CouponList >li {
    position: relative;
    background: #fff;
    margin: 0 10px 0;
  }
  .CouponList >li.pepper-w {
    width: 94.375%;
    margin: 0 auto;
  }
  .pepper {
    width: 100%;
    overflow: hidden;
    margin-top: -10px;
    color: #686868;
    border: 1px solid #bfbfbf;
    border-bottom: 0px;
    background: #fff;
    box-sizing: border-box;
  }
  .pepper-blue {
    background: #fff url(../../assets/img/quan.png) no-repeat;
    background-position: -16px -16px;
  }
  .pepper-product {
    width: 100%;
    box-sizing: border-box;
    position: relative;
    background-position: -16px -16px;
    border: 1px solid #bfbfbf;
    /* width: 98%; */
    font-size: 12px;
    color: #686868;
    padding: 10px 0 10px 2%;
    text-align: left; 
  }
  .pepper-b .pb-con {
    background: #ee7a77;
    color: #fff;
    min-height: 8px;
    padding: 7px 0 6px 8px;
    font-size: 12px;
  }
  .pepper-blue .pb-con {
    background: #c81623;
  }
  .pepper-b .pb-border {
    width: 100%;
    height: 3px;
    background: #f5f5f5;
    background: url(../../assets/img/couponbg.png) repeat-x;
    background-size: 10px;
  }
  .pepper .pepper-l {
    float: left;
    text-align: left;
    width: 66%;
    box-shadow: 2px 2px 4px #f5f5f5;
    position: relative;
    padding-bottom: 10px;
    padding-left: 0.4em;
  }
  .pepper-blue .pepper-r {
    background: #fff;
  }
  .pepper .pepper-r {
    font-size: 13px;
    float: left;
    width: 28%;
    height: 100%;
    text-align: center;
    padding-left: 5px;
  }
  .pepper .pepper-l .pepper-l-num {
    font-size: 12px;
  }
  .pepper-blue .pepper-l-num {
    border-bottom: 1px solid #efefef;
    color: #c81623;
  }
  .pepper .pepper-l .pepper-l-con {
    font-size: 12px;
    padding-top: 6px;
    line-height: 16px;
  }
  .pepper .pepper-l .pepper-l-tim {
    font-size: 12px;
  }
  .pepper .pepper-l .pepper-l-num i {
    font-size: 21px;
    font-style: normal;
  }
  .pepper .pepper-l .pepper-l-num span {
    display: inline-block;
    padding-bottom: 6px;
    padding-top: 10px;
    font-size: 35px;
  }
  .pepper-blue .pepper-r span {
    color: #c81623;
    font-weight: bold;
  }
  .pepper .pepper-r span {
    display: block;
    padding: 0.2em 0;
    margin: 10px auto 0;
    background: #fff;
    text-align: center;
    font-size: 14px;
  }
  .noTicket {
    width: 6rem;
    height: 6rem;
  }
  .noTicketText {
    text-align: center;
    color: #c1c1c1;
  }
</style>
