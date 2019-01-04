<template lang="html">
  <div class="weui_dialog_confirm">
    <div class="weui-mask"></div>
    <div class="weui_dialog_shop">
      <!--店铺列表-->
      <div class="scrollShopList" v-iscroll=getIscroll>
        <div class="flex-container">
          <div class="weui_flex_item" v-for="shop in shopList" @click="switchShop(shop.id)">
            <img v-if="!shop.photo" class="logoImg" src="../../assets/img/resto.png"/>
            <img v-if="shop.photo" class="logoImg" :src="shop.photo" />
            <span class="shopName">{{shop.name}}</span>
            <p class="shopTab" style="text-align: center;" v-if="shop.shopTags != null">
              <span v-for="f in shop.shopTags">{{f}}</span>
            </p>
          </div>
        </div>
      </div>
      <transition name="slide">
        <div class="returnBack" @click="back" v-if="stopScroll">
          <img class="returnImg" src="../../assets/img/return.png" alt="返回">
          <span>返回主场</span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import { mapGetters,mapMutations } from 'vuex'
  import { shopListApi,switchShopInfo } from '../../fetch/api'

  export default {
    data () {
      return {
        shopList:[],
        stopScroll:false
      }
    },
    created(){
      let _this = this;
      let param={
        name:null
      };
      shopListApi.shopList($.param(param)).then((response) => {
        _this.shopList = response.data;
      });
    },
    methods:{
      ...mapMutations([
        'clearCartItem'
      ]),
      getIscroll(iscroll){
        if (iscroll) {
          let _this = this;
          iscroll.on('scrollEnd', function() {
            _this.stopScroll = true;
          });
          iscroll.on('scrollStart', function() {
            _this.stopScroll = false;
          });
        }
      },
      back(){
        this.$router.push({ path: '/user/order'});
      },
      switchShop(id){
        let _this = this;
        switchShopInfo.switch(id).then((response) => {
          if(response.success){
            _this.$router.push({ path: '/user/order'});
            // _this.clearCartItem();
            // window.location.reload();
          }
        });
        console.log(JSON.stringify(id));
      }
    }
  }
</script>

<style scoped>
  @import '../../assets/css/shop.css';
</style>
