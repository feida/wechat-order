<template lang="html">
  <div class="full-height">
    <!--header-->
    <!--<div class="weui-cell" id="header_search">-->
      <!--<img class="changeImg" @click="searchArticle" src="../../assets/img/search.png" />-->
      <!--<div class="weui-cell__bd">-->
        <!--<div style="text-align: right">-->
          <!--<img class="changeShopImg" src="../../assets/img/changeShop.png" />-->
          <!--<p style="display: inline-block" @click="choiceShop">切换门店</p>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <!-- 会员专属优惠 -->
    <div class="top-banner" v-if="activity.activityImg && customerSvip==false" @click="chargeSvip">
      <img style="border-radius: 5px;" :src="activity.activityImg">
    </div>
    <!--菜品区域-->
    <div class="article-container" :class="{'article-container2': (activity.activityImg && customerSvip==false)}">
      <!--菜品类型-->
      <div class="full-height article-family-list" >
        <ul class="article-family-ul">
          <li :class="{active:typeInfo.id==currentType.id}"  v-for="(typeInfo,key) in familyListType" :key="key"  @click="changeArticleType(typeInfo)">
            <span class="recommend">{{typeInfo.name}}</span>
            <span v-if="typeInfo.count > 0" class="articleCount"><i class="article-count">{{typeInfo.count}}</i></span>
          </li>
        </ul>
      </div>
      <!--菜品明细-->
      <div class="full-height article-list-wapper" >
        <div class="article-list">
          <div class="article-family-group" v-for="f in familyListType" v-if="f.articles" :data-family-id="f.id">
            <!-- <div class="weui-cell header">
              <div class="weui-cell__hd">
                <p class="type_sign"></p>
              </div>
              <div class="weui-cell__bd">
                <p>{{f.name}}</p>
              </div>
            </div> -->
            <div class="small-item article-pice-small"
              :class="{'article-pice-1':a.photoType==1, 'article-pice-4':a.photoType==4, 'article-pice-5':a.photoType==5 }" 
              :style="'background:url('+a.bgPhoto+') no-repeat;background-size: 100% 100%;'"
              v-for="a in f.articles" @click.stop="addToShopCart(a)"
            >
            <template v-if="a.photoType==2 || a.photoType==3">
              <img class="smallArticleImg" v-if="a.photoType==2" :src="a.photoLittle">
              <p class="article-describe">
								<span class="describe-name">
									<i>{{a.name}}</i>
								</span>
                <span class="describe-price">
									<i class="price" v-if="a.fansPrice">&yen;{{a.fansPrice}}/{{a.unit}}</i>
                  <i class="price" v-if="!a.fansPrice">{{a.price}}/{{a.unit}}</i>
								</span>
                <!-- <span class="describe-like">
                  <img class="heartImg" src="../../assets/img/red_heart.png" alt="点赞数">
                  <i>{{a.likes}}</i>
                </span> -->
              </p>
            </template>
            <!-- <template v-else-if="a.photoType==3">

            </template> -->
            <template v-else>
              <p class="article-describe-top" ><span>{{a.name}}</span> <span :class="{'text-through': a.fansPrice}">&yen;{{a.price}}/{{a.unit}}</span></p>
              <p class="article-describe-fans-price" v-if="a.fansPrice">粉丝价:{{a.fansPrice}}/{{a.unit}}</p>
            </template>
            
            
            <cartControl style="{color:a.controlColor}" :sceneType="1" :article.sync="a" @add="addToShopCart" @cut="cutToShopCart"></cartControl>

            </div>
          </div>
        </div>
      </div>
    </div>
    <shopCart :totalNumber.sync="totalNumber" :totalPrice="totalPrice" :priceState="priceState"
       v-if="haveDish" @show-details="showArticleDetails" @show-choice-mode="showChoiceMode"></shopCart>
    <articleDetails :cartItem="cartItem" :totalNumber="totalNumber" :priceState="priceState" :currentArticle="currentArticle"
      :totalPrice="totalPrice" @show-details="showArticleDetails" v-if="detailsShow" @show-mode="showChoiceMode" @showArticle="showArticle"></articleDetails>
    <articleDialog @close-article="closeArticleDialog" v-if="articleDialog.show" :currentArticle="currentArticle" :modeType="modeType" :cartItemIndex="cartItemIndex"></articleDialog>
    <choiceMode v-if="choiceMode.show" @close-mode="closeMode"></choiceMode>
    <!-- SVIP充值会员活动说明 -->
    <ActivitySVip v-if="showActivitySVip" :shop="shop" :activity="activity" @close="showActivitySVip=false"></ActivitySVip>
  </div>
</template>

<script>
  import cartControl from '../../components/cartControl/cartControl.vue'
  import shopCart from '../../components/shopCart/shopCart.vue'
  import articleDialog from '../../components/dialog/articles.vue'
  import choiceMode from '../../components/mode/mode.vue'
  import articleDetails from '../../components/articleDetails/articleDetails.vue'
  import * as TYPE from '../../store/actionType/shopCartType.js'
  import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
  import Utils from '../../utils/utils.js'
  import {customerApi, orderStatus} from '../../fetch/api.js'
  import * as ORDER_TYPE from '../../store/actionType/orderType'
  import Iscroll from 'iscroll/build/iscroll-probe'             //iscroll滑动版
  import ActivitySVip from './com/activity.vue'                 // 活动说明
  import activityMixin from './com/activityMixin.js';

  let artListIsc = null;
  let familyIsc = null;
  export default {
    data () {
      return {
        initScroll: false,              //是否初始化过iscroll
        currentType: {},               //当前的菜品分类
        detailsShow:false,              //购物车菜品详情
        priceState:false,
        articleDialog:{show:false},     //菜品弹窗
        choiceMode:{show:false},        //就餐模式
        foodType:null,                  //当前的菜品类型 123456
        modeType: 1,                    //1:加入购物车模式； 2：编辑模式
        cartItemIndex: -1,              //编辑模式 编辑购物车索引id
        // activity:{},			              //超级会员活动
        // customerSvip: false,            //是否已经是付费会员
        showActivitySVip: false,        //开关：是否显示付费会员活动面板
      }
    },
    mixins: [activityMixin],
    components: {
      cartControl,
      shopCart,
      articleDetails,
      articleDialog,
      choiceMode,
      ActivitySVip
      // RegisterWelcome
    },
    watch:{
      currentArticleType: {
        handler: function(val) {
          this.currentType = val;
        },
        immediate: true 
      },
      // familyListType: {
        // handler: function(val) {
        //   if (val.length > 0 && this.initScroll===false) {
        //     this.$nextTick(() => {
        //       // 调用滚动方法
        //       this.initScroll = true; //初始化只执行一次
        //       this._initScroll();
        //     })
        //   }
        // },
        // immediate: true
      // },
      // 等活动加载好，再初始化滚动条
      activity: {
        handler: function() {
          this.$nextTick(() => {
            this._initScroll();
          })
        }
      }
    },
    computed: {
      ...mapGetters([
        'customer',
        'familyListType',
        // 'familyList',
        'currentArticleType',
        'cartItem',
        'loadFamily',
        'totalPrice',
        'totalNumber',
        'currentArticle',
        'wechatImgUrl',
        'orderParams', //saveOrder参数
        'shop',        // 店铺配置
      ]),
      haveDish(){
        let hasArticle = false;
        this.cartItem.filter(function (item) {
          if(item.count > 0){
            hasArticle = true;
          }
        })
        return hasArticle;
      }
    },
    async created(){
      // console.log(1234)
      if (!this.customer || !this.customer.accountId) {
        this.$router.push({path:'/'});
      }
      
      // let res = await customerApi.selectBanner();
      // if (res.success) {
      //   this.activity = res.data;
      // }

      // res = await customerApi.getCustomerSvip();
      // this.customerSvip = res.success;
      
    },
    methods:{
      ...mapMutations([
        'addShopCart',
        'cutShopCart',
        TYPE.SET_CURRENT_ARTICLE
      ]),
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
        }
        familyIsc = new Iscroll('.article-family-list', options)
        options = {...options, probeType: 3}  // scroll事件
        artListIsc = new Iscroll('.article-list-wapper', options)
        let familyId = null;
        let _this = this;
        let domTopArr = [];
        var groupList = $(".article-family-group");
        for (var i=0; i<groupList.length; ++i) {
          let dom = groupList.eq(i);
          let position = dom.position();
          domTopArr.push({top: position.top, familyId: dom.data("family-id")});
        }
        artListIsc.on('scroll', () => {
          domTopArr.forEach(item => {
            if (Math.abs(item.top+artListIsc.y) <= 10) {
              familyId = item.familyId;
            }
          })
          _this.currentType = { id:familyId };
        });
      },
      changeArticleType(a) {
        let _this = this;
        _this.currentType = a;
        let fid = this.currentType.id;
        let dom = $(".article-list-wapper");
        if (artListIsc) {
          let fidDom = dom.find("[data-family-id='" + fid + "']");
          artListIsc.scrollToElement(fidDom.get(0),0);
        }
      },
      resetDomHeight() {
        let wrap = $('.article-container');
        let content = $(".article-list-wapper");
        let fullHeight = $(".full-height");
        let typeContent = $(".article-family-list");
        // console.log(fullHeight.height());
        wrap.height(fullHeight.height());
        // content.height(fullHeight.height() - 47);
        // typeContent.height(fullHeight.height() - 47);
      },
      choiceShop(){
        this.$router.push({ path: '/user/shop'});
      },
      searchArticle(){
        this.$router.push({ path: '/user/search'});
      },
      async showArticle(a){
        if (a.isEmpty ) {
          return;
        };
        // 没有推荐的单品直接加入购物车
        // if ( ! a.recommendId && a.foodType === 1 ) {
        //   return ;
        // }
        // this.currentArticle = a;
        if (a.modeType) {
          this.modeType = a.modeType;
          this.cartItemIndex = a.cartItemIndex >= 0 ? a.cartItemIndex : -1;
        } else {
          this.modeType = 1;
        }

        a = {...a};
        // this.$store.commit(TYPE.SET_CURRENT_ARTICLE, {currentArticle: a});
        await this.$store.dispatch(TYPE.SET_CURRENT_ARTICLE, {currentArticle: a});
        this.articleDialog.show = true;
      },
      closeArticleDialog(){
        this.articleDialog.show = false;
      },
      addToShopCart(a){
        // 纯单品 并且没有推荐配餐
        // if (a.foodType == 1 ) {
          // if (a.recommendId && a.recommendId.length>0) {
            // this.showArticle(a);
          // } else {
          //   this.addShopCart(a);
          // }
        // } else {
        //   this.showArticle(a);
        // }
        this.showArticle(a);
      },
      cutToShopCart(a){
        // 主界面 纯单品 减
        a.cartItemIndex = this.cartItem.findIndex(info => info.id == a.id);
        this.cutShopCart(a);
      },
      showArticleDetails(){
        this.detailsShow = !this.detailsShow;
        this.priceState = !this.priceState;
      },
      showChoiceMode(){
        this.choiceMode.show = true;
      },
      closeMode(){
        this.choiceMode.show = false;
      },
      // @Listener 
      // 点击，付费充值活动
      chargeSvip() {
        this.showActivitySVip = true;
      }
    }
  }
</script>

<style scoped>
  @import '../../assets/css/order.css';

</style>
