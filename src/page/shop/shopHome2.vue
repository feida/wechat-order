<template lang="html">
  <!-- <div > -->
    <div class="shop-home">
      <div class="search-box">
        <div class="curr_city" @click="showCityList =!showCityList">
          {{currCity}}
          <ul class="city_list" :class="{active: showCityList == true}">
            <li @click="selectCity(city.city)" v-for="(city, index) in cityList" 
            >{{city.city}}</li>
          </ul>
        </div>
        <div class="search">
          <i class="weui-icon-search"></i>
          <input type="text" v-model="searchTxt" placeholder="请输入城市或门店名称">
        </div>
      </div>
      <div v-iscroll=getIscroll style="overflow:hidden; height:100%;">
        <div>

          <div class="box">
            <!-- <h3>门店列表</h3> -->
            <!--店铺列表-->
            <div class="content shopList" v-if="isRender==true">
              <div class="cell-box" v-for="shop in filterShopList" @click="switchShop(shop.id)">
                <img v-if="!shop.photo" class="logoImg" src="../../assets/img/resto.png"/>
                <img v-if="shop.photo" class="logoImg" :src="shop.photo" />
                <div class="desc">
                  <p class="shopName">{{shop.name}}</p>
                  <p class="distance">
                    <span>距您{{shop.distance}}</span>
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
        currCity: '选城市',         // 当前的城市名字
        isRender: false,       // 是否渲染，设置个延迟渲染
        showCityList: false,  // 是否显示城市列表下拉
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
      ...mapGetters([
        'cityList', 
        'shopList'
        ]),
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
        if (shopList.length) {
          firstShop = shopList[0];
        }
        return firstShop;
      }
    },
    async created(){
      if (process.env.NODE_ENV === 'development') {
        // todo 应该只是获取店铺列表
        this.$store.dispatch('logIn', {code: ''});
        this.isRender = true;
      }

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
            let point = new BMap.Point(result[1], result[0]);
            let bMapCoder = new BMap.Geocoder();
            bMapCoder.getLocation(point, function(res) {
              if (res) {
                // alert(res.addressComponents.city + '--')
                that.selectCity(res.addressComponents.city)
                that.isRender = true;
              }
            })

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
      selectCity(cityName) {
        let cityList = [...this.cityList];
        let cityIndex = this.cityList.findIndex(city => city.city==cityName)
        if (cityIndex !== -1) {
          this.searchTxt = cityName;
          this.currCity = cityName;
          cityList.splice(cityIndex, 1)
          cityList.unshift(this.cityList[cityIndex])
          this.$store.commit(TYPE.SET_CITY_LIST, {data: cityList})
        }
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
      },
      chooseCity(id) {
        console.log(id)
      }
    }
  }
</script>

<style scoped lang="less">
  /* @import '../../assets/css/shop.css'; */
.map() {
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0.4rem;
    display: block;
    width: 16px;
    height: 20px;
    background: url('../../assets/img/map-icon.png') 0 0 ;
    background-size: 16px 20px;     
  }
} 
.arrow(@deg: 0deg) {
  &::after {
    content: '';
    position: absolute;
    display: block;
    width: 14px;
    height: 100%;
    background: url('../../assets/img/arrow-01.png') center center no-repeat;
    background-size: 14px 7px;  
    top: 50%;
    transform: translateY(-50%) rotate(@deg);
    right: 8px;
  }
} 
.shop-home {
  // padding-top: 50px;
  height: calc(100% - 50px);
  // max-height: 100%;
  position: relative;
  // background-color: #F2F2F2;
  background-color: #fff;
  >.search-box {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    margin: 14px 0;
    padding: 0 14px;
    >.curr_city {
      flex-basis: 35%;
      box-sizing: border-box;
      border: 1px solid #E4E4E4;
      height: 2.5rem;
      line-height: 2.5rem;
      text-align: center;
      border-radius: 5px;
      position: relative;
      .map();
      .arrow();
      >.city_list {
        transition: all 1s;
        height: 0;
        width: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 10;
        background: #eee;
        box-shadow: 0 0 4px 0 rgba(114, 114, 114, 0.5);
        border-radius: 5px;
        overflow: hidden;
        &.active {
          // border: 1px solid #E4E4E4;                  
          height: auto;  
        }
        >li {
          position: relative;
        }
        >li:first-child {
          .map();
          .arrow(180deg);          
        }
      }
    }
    >.search {
      flex-basis: 61%;
      position: relative;
      box-sizing: border-box;
      > i {
        position: absolute;
        left: 6px;
        top: 50%;
        transform: translateY(-50%);
      }
      >input[type="text"] {
        display: block;
        height: 2.5rem;
        line-height: 2.5rem;
        width: 100%;
        // padding-left: 28px;
        text-indent: 2.2rem;
        outline: none;
        border: none;
        border-radius: 5px;
        background-color: #E4E4E4;
        font-size: 14px;
        &::-webkit-input-placeholder {
          color: #999;
        }
      }
    }
  }
  .box {
    >.content {
      .weui-btn {
        background-color: #E4E4E4;
      }
      .weui-btn+.weui-btn {
        margin-top: 0;
      }
      &.city-list {
        padding: 6px 15px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
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
        padding: 0 14px;
        .cell-box {
          
          position: relative;
          width: 100%;
          // height: 181px;
          height: auto;
          margin-bottom: 10px;
          overflow: hidden;
          // opacity: 0.2;
          box-shadow: 0 10x 10px 0 rgba(177,177,177,0.5);
          border-radius: 5px;
          > img {
            display: block;
            width: 96vw;
            height: 48vw;
          }
          > .desc {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-color:rgba(0, 0, 0, 0.5);
            >.shopName {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 100%;
              text-align: center;
              transform: translate(-50%, -50%);
              color: #fff;
              font-size: 1.5rem;
            }
            >.distance {
              position: absolute;
              right: 10px;
              bottom: 10px;
              color: #fff;
              font-size: 1rem;
              font-weight: normal;
            }
          }
        }
      }
    }
  }
}
</style>
