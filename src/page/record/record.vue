<template lang="html">
  <div class="weui_dialog_confirm">
    <div class="weui-mask"></div>
    <div class="weui_dialog_record">
      <div class="full-height">
        <!--个人信息-->
        <div class="person_infor">
          <div class="headerPhoto">
            <img class="headerImg" :src="customer.headPhoto" alt="" />
          </div>
          <div class="personName">
            <div class="middle">
              <span>{{customer.nickname}}</span>
            </div>
          </div>
          <div class="weui-cell-record">
            <div class="weui_flex_item">
              <span class="headerCount">{{record.count ? record.count : 0}}</span>
              <span class="headerText">邀请人数</span>
            </div>
            <div class="weui_flex_item">
              <span class="headerCount">{{record.number ? record.number : 0}}</span>
              <span class="headerText">返利次数</span>
            </div>
            <div class="weui_flex_item">
              <span class="headerCount">￥{{record.sumMoney ? record.sumMoney : 0}}</span>
              <span class="headerText">返利金额</span>
            </div>
          </div>
        </div>
        <!--没有足迹-->
        <div class="noRecord" v-if="!record.count">
          <img src="../../assets/img/noRecord.png" style="width: 8rem;height: 8rem;" />
          <div class="recordText">邀请好友,领取分享返利</div>
          <button class="btn btn-blue" style="width: inherit;" @click="inviteFriend">邀请好友</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { customerApi,shareCountApi } from '../../fetch/api'
  import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
  export default {
    data () {
      return {
        // customer:{},
        record:{}
      }
    },
    computed: {
      ...mapGetters([
        'customer',
        'shop',
      ]),

    },
    async created() {
      // let _this = this;
      // customerApi.customer().then((response) => {
      //   _this.customer = response.data;
      //   let param = {
      //     customerId:_this.customer.id
      //   };
      //   shareCountApi.share($.param(param)).then((response) => {
      //     _this.record = response.data;
      //   })
      // })

      let result = await shareCountApi.share($.param({customerId: this.customer.id}))
      // this.count = result.count;
      // if (result.sumMoney != null) {
      //   this.sumMoney = result.sumMoney;
      // }
      this.record = result;
    },
    methods:{
      inviteFriend(){
        this.$router.push({ path: '/user/my', query: {scanAqrCode: true}});
      }
    }
  }
</script>

<style scoped>
  @import '../../assets/css/record.css';
</style>
