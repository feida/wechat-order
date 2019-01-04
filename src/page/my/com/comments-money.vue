<template>
  <!-- 评论红包奖励金额页面 -->
  
  <div class="weui_dialog red-money">
    <div class="weui_mask"></div>
    <div class="red_bag_open">
      <div class="red_open">
        <div class="red_open_topcontent"><span class="red_avatar_close" @click="$emit('close-comments-money')">+</span></div>
        <div class="red_open_avatar"><img src="http://106.14.44.167/group1/M00/04/63/ag4sp1tIHiqAWVwvAAAaCnvsO_E304.png"></div>
        <h2>{{shop.name}}的红包</h2>
        <div class="red_open_description">恭喜发财，大吉大利！</div>
        <div class="red_open_get"> <span>{{comment.redMoney}}</span>元</div><a class="pocket_money">红包将于60分钟后到账</a></div>
      <div class="weui_cells red_open_people"></div><a class="weui_btn_ShareRebate" @click.stop="jumpShare">分享评价，再送红包</a></div>
  </div>
</template>

<script>
  import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
  import { submitAppraise } from '../../../fetch/api.js'
  export default {
    props: {
      orderId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        comment: {}   // 
      }
    },
    computed: {
      ...mapGetters([
        'shop',       // 店铺设置
        'brandSetting' // 品牌设置
      ])
    },
    async created() {
      let params = {orderId: this.orderId}
      let res = await submitAppraise.getAppraiseByOrderId($.param(params));
      if (res.success === true) {
        this.comment = res.data;
      }
    },
    methods: {
      jumpShare() {
        this.$emit('jump-share', this.orderId);
        //let params = {orderId: this.orderId};
        //submitAppraise.getAppraiseByOrderId($.param(params)).then(res => {
          //window.location.href = this.brandSetting.data.wechatWelcomeUrl+"?shopId="+this.order.shopDetailId+"&subpage=home&dialog=share&appraiseId="+ res.id;
        //})
      }
    }
  };
</script>

<style  lang="less">
.red-money {
    .weui_mask {
      position: fixed;
      z-index: 1;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.6);
    }
    height: 120vw;
    .red_bag_open {
      width: 100%;
      height: 100%;
      background-color: #faf7f2;
      text-align: center;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
      z-index: 10;
      .red_open {
        background: #fdfaf5;
        height: 100%;
        >.red_open_topcontent {
          height: 80px;
          border: 1px solid #df5548;
          background: #df5548;
          border-radius: 0px 0px 50% 50%/0px 0px 30% 30%;
          box-shadow: 0px 2px 0px -1px rgba(0, 0, 0, 0.2);
          color: #fff2bf;
          >.red_avatar_close {
            position: absolute;
            top: 5px;
            left: 15px;
            transform: rotate(45deg);
            font-size: 2em;
            color: rgba(0, 0, 0, 0.5);
          }
        }
        >.red_open_avatar {
          img {
            width: 80px;
            height: 80px;
            margin-top: -50px;
            border-radius: 50%;
            overflow: hidden;
          }
        }
        >h2 {
          font-size: 1.2em;
        }
        >.red_open_description {
          color: #928d89;
        }
        >.red_open_get {
          >span {
            font-size: 3.5em;
          }
        }
        >a.pocket_money {
          color: #546ea7;
          font-size: 1em;
          margin-bottom: 20px;
        }
      }
      .red_bag_open .red_open_people {
        margin-top: 0;
        background: #fdfaf5;
      }
      a.weui_btn_ShareRebate {
        margin: 10px;
        border-radius: 5px;
        position: relative;
        background-color: #000;
        color: #fff;
        text-align: center;
        bottom: 55px;
        line-height: 35px;
        display: block;
        flex: 1;
      }
    }

    .dialog-close {
      position: absolute;
      bottom: -80px;
      display: block;
      color: #fff;
      padding-top: 10px;
      width: 100%;
      z-index: 100;
      text-align: center;
    }
    .dialog-close i {
      font-size: 4em;
    }
}
</style>
