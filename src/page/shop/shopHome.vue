<template lang="html">
  <!-- <div > -->
    <div class="shop-home">
      <div class="search">
        <i class="weui-icon-search"></i>
        <input type="text" v-model="searchTxt" placeholder="请输入城市或门店名称">
      </div>
      <div v-iscroll=getIscroll style="overflow:hidden; height:100%;">
        <div>
          <div class="box">
            <h3>请选择城市</h3>
            <ul class="content city-list">
              <li v-for="(city, index) in cityList" @click="selectCity(index, city.city)">
                <a href="javascript:;" class="weui-btn weui-btn_mini weui-btn_plain-default" :class="{active: city.click===true}" style="border: none;">{{city.city}}</a>
              </li>
            </ul>
          </div>
          <div class="box">
            <h3>距离您当前位置最近的门店</h3>
            <div class="content nearby" @click="switchShop(firstShop.id)">
              <a href="javascript:;" class="weui-btn weui-btn_plain-default">{{firstShop.name}}</a>
              <span>{{firstShop.distance}}</span>
            </div>
          </div>
          <div class="box">
            <h3>门店列表</h3>
            <!--店铺列表-->
            <div class="content shopList" >

              <div class="cell-box" v-for="shop in filterShopList" @click="switchShop(shop.id)">
                <img v-if="!shop.photo" class="logoImg" src="../../assets/img/resto.png"/>
                <img v-if="shop.photo" class="logoImg" :src="shop.photo" />
                <div class="desc">
                  <p class="shopName">{{shop.name}}</p>
                  <p class="shopTab">
                    <span>{{shop.city}}</span>
                    <span>{{shop.distance}}</span>
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  <!-- </div> -->
</template>

<script>
  import { mapGetters,mapMutations } from 'vuex'
  import * as TYPE from '../../store/actionType/customerType'
  import { shopListApi,switchShopInfo,wxConfigApi } from '../../fetch/api'
  import Utils from '../../utils/utils'
  import gcoord from 'gcoord'
  import wx from 'weixin-js-sdk'

  let iScrollObj = null;
  export default {
    data () {
      return {
        map: null,
        searchTxt: '',    // 搜索的地址
        stopScroll:false,
        stopScroll:false,
        mapResult: null,     //用户的经纬度
        uesrLatitude: null,
        uesrLongitude: null
      }
    },
    watch: {
      'shopList':function (newVal,oldVal) {
        // if(newVal && newVal.length > 0){
        //   let params = {"query": Utils.getUrlQuery(window.location.href)};
        //   wxConfigApi.config($.param(params)).then((response) => {
        //     if(response.success){
        //       wx.config(response.data);
        //       this.$nextTick(() => {
        //         iScrollObj.refresh();
        //       })
        //     }
        //   })
        // }
      }
    },
    computed: {
      ...mapGetters(['cityList', 'shopList']),
      filterShopList: function () {
        let key = this.searchTxt;
        let shopList = this.shopList;
        return shopList.filter(function (item) {
          return item.name.toLowerCase().indexOf(key.toLowerCase()) != -1 || item.city.toLowerCase().indexOf(key.toLowerCase()) != -1
        })
      },
      firstShop:function(){
        let firstShop = {};
        let shopList = this.shopList;
        if(shopList.length){
          firstShop = shopList[0];
        }
        return firstShop;
      }
    },
    created(){
      if (process.env.NODE_ENV === 'development') {
        // todo 应该只是获取店铺列表
        this.$store.dispatch('logIn', {code: ''});
      }
    },
    async mounted(){
      let that = this;
      await Utils.wxConfig();
      wx.ready(function () {
        wx.hideMenuItems({
          menuList: ['menuItem:share:weiboApp','menuItem:share:QZone','menuItem:share:email','menuItem:share:brand',
            'menuItem:copyUrl','menuItem:originPage','menuItem:editTag','menuItem:delete','menuItem:share:facebook',
            'menuItem:favorite','menuItem:share:qq'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
        Utils.wxGetLocation(function (r) {
          if((r.latitude == undefined || r.latitude == null)&& (r.longitude == undefined || r.longitude == null)){
            that.$kiko_message({
              message: '请打开微信授权获取地理位置信息!',
              time: 3000,
              type:1
            })
            that.$store.commit(TYPE.RESET_SHOP_LIST,[]);
          }else{
            var result = gcoord.transform(
              [ r.latitude, r.longitude ],    // 经纬度坐标
              gcoord.GCJ02,                  // 当前坐标系
              gcoord.BD09                    // 目标坐标系
            );
            that.$store.commit(TYPE.RESET_SHOP_LIST,result);
          }
        })
        
      });
    },
    methods:{
      ...mapMutations([
        'clearCartItem'
      ]),
      getIscroll(iscroll){
        if (iscroll) {
          iScrollObj = iscroll;
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
      // 选择店铺listener
      selectCity(index, cityName) {
        this.cityList.forEach((city,idx) => {
          city.click = false;
          if (idx == index) {
            city.click = true;
            this.searchTxt = cityName;
            // this.searchByName(this.searchTxt);
          }
        })
        this.cityList = [...this.cityList]
      },
      switchShop(id){
        let _this = this;
        switchShopInfo.switch(id).then((response) => {
          if(response.success){
            // 重新获取店铺数据
            this.$store.dispatch('logIn', {code: ''});
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

<style scoped lang="less">
  /* @import '../../assets/css/shop.css'; */
.shop-home {
  padding-top: 50px;
  height: calc(100% - 50px);
  // max-height: 100%;
  position: relative;
  background-color: #F2F2F2;
  >.search {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: #F0EFF5;
    display: flex;
    align-items: center;
    > i {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
    >input[type="text"] {
      margin-left: 36px;
      width: 80vw;
      height: 29px;
      padding-left: 4px;
      outline: none;
      border: none;
      border-radius: 4px;
      background-color: #fff;
      font-size: 14px;
    }
  }
  .box {
    background-color: #F2F2F2;
    >h3 {
      height: 32px;
      line-height: 32px;
      padding-left: 4px;
      font-weight: normal;
      color: #959595;
      background-color: #E4E4E4;
    }
    >.content {
      .weui-btn {
        background-color: #E4E4E4;
      }
      .weui-btn+.weui-btn {
        margin-top: 0;
      }
      &.city-list {
        padding: 6px 15px;
        // padding-left: 15px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
          // box-sizing: border-box;
        > li {
          list-style: none;
          box-sizing: border-box;
          margin: 0px;
          width: 33.3333%;
          padding: 4px 4px;
          display: flex;
          justify-content: center;
          > a {
            margin: 0;
            height: 34px;
            width: 100%;
            line-height: 34px;
            &.active {
              color: #fff;
              background: #000;
            }
          }
        }
      }
      &.nearby {
        height: 55px;
        display: flex;
        padding: 0 15px;
        justify-content: space-between;
        align-items: center;
        > a {
          margin-left: 0;
          font-size: 14px;
          border: none;
          width: 210px;
          height: 34px;
          line-height: 34px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      &.shopList {
        .cell-box {
          padding: 10px;
          display: flex;
          border-bottom: 2px solid #fff;
          &:last-child {
            border-bottom: none;
          }
          > img {
            flex: 1;
            width: 50%;

          }
          > .desc {
            flex: 1;
            padding: 4px;
            position: relative;
            >.shopName {
              font-size: 1.2rem;
            }
            >.shopTab {
              display: flex;
              justify-content: space-between;
              position: absolute;
              width: 100%;
              bottom: 0;
              left: 0;
              >span:nth-child(1) {
                margin-left: 10px;
                padding-left: 20px;
                position: relative;
                &::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  display: block;
                  width: 20px;
                  height: 20px;
                  background: url('../../assets/img/mapsign.png') 0 0 ;
                  background-size: 20px 20px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
