<template lang="html">
  <div class="full-height" v-iscroll=getIscroll>
  	<!--轮播图-->
    <div>
    <div class="swiper-container banner">
      <div class="swiper-wrapper">
        <div class="swiper-slide banner" v-for="p in bannerlist" :style="{ backgroundImage: 'url(' + p.pictureUrl + ')' }">
        </div>
      </div>
    </div>
	  <!--店铺信息-->
		<div class="weui-cell">
			<div class="weui-cell__bd">
        <p>{{shop.name}}</p>
	   	</div>
      <div class="weui-cell__ft">
        <iconScore :level="monthStar"></iconScore>
        <span>{{monthScore}}分</span>
      </div>
		</div>
    <div class="weui-cell weui-cell_access" @click="openshoplocation">
      <div class="weui-cell__hd">
        <img class="markImg" src="../../assets/img/address.png" />
      </div>
      <div class="weui-cell__bd">
        <p>{{shop.address}}</p>
      </div>
      <div class="weui-cell__ft"></div>
    </div>
    <div class="weui-cell weui-cell_access">
      <img class="markImg" src="../../assets/img/clock.png" />
      <div class="weui-cell__bd">
        <p>营业时间 : {{shop.openTime && new Date(shop.openTime.time).format("hh:mm")}} - {{shop.closeTime && new Date(shop.closeTime.time).format("hh:mm")}}</p>
      </div>
    </div>
    <a class="weui-cell weui-cell_access" @click="call">
      <img class="markImg" src="../../assets/img/phone.png" />
      <div class="weui-cell__bd">
        <p style="color: #000;">{{shop.phone}}</p>
      </div>
      <div class="weui-cell__ft"></div>
    </a>
    <!--店铺最新公告-->
    <div class="weui-cell weui-cell_access" style="border-top:0.82em solid #E7E7E7;margin-top: inherit;" @click="showNotice" v-if="noticeList.length > 0">
      <div class="weui-cell__hd"><img class="markImg" src="../../assets/img/notice.png" /></div>
      <div class="weui-cell__bd">
        <p style="color: #c41e24;">点击查看最新公告</p>
      </div>
      <div class="weui-cell__ft"></div>
    </div>
    <!--店铺介绍-->
    <div class="weui-cells description" v-if="advert.description" v-html="advert.description"></div>
    <!--评论列表-->
      <div class="weui_cell_comment">
        <!--评价总数-->
        <div class="weui-cell" @click="showFilter">
          <div class="weui-cell__bd">
            <p>
              <span>全部评价</span>
              <span class="appraise-count-span">
                (共{{appraiseCount.COUNT ? appraiseCount.COUNT : 0}}条  {{!appraiseCount.COUNT == 0 ? appraiseCount.AVG_SCORE.toFixed(2) : 0}}分)
              </span>
            </p>
          </div>
        </div>
        <!--评论列表-->
        <ul class="comment">
          <li class="appraise-item" v-for="a in appraiseList">
            <div class="reviewListInfoTitle" style="position: relative;">
              <div class="avatar">
                <img v-if="a.headPhoto" :src="a.headPhoto" alt="用户头像" style="border-radius: 50%;">
                <img v-if="!a.headPhoto" src="../../assets/img/restowechat.png" alt="用户头像" style="border-radius: 50%;">
              </div>
              <div class="customerHead" style="padding-bottom: 18px;">
                <span v-if="a.nickName" style="vertical-align: middle;">{{a.nickName}}</span>
                <span v-if="!a.nickName" style="vertical-align: middle;">匿名用户</span>
                <img class="customerSex" src="../../assets/img/man.png" v-if="a.sex == 1" />
                <img class="customerSex" src="../../assets/img/woman.png" v-if="a.sex == 2" />
                <!--<span style="font-size: 12px;color: #999;">{{new Date(a.createTime.time).format("yyyy-MM-dd")}}</span>-->
                <div class="appraise_expression" v-if="a.level == 1">
                  <img class="express_img" src="../../assets/img/jicha_seltted.png">
                  <p>极差</p>
                </div>
                <div class="appraise_expression" v-if="a.level == 2">
                  <img class="express_img" src="../../assets/img/buman_seltted.png">
                  <p>不满</p>
                </div>
                <div class="appraise_expression" v-if="a.level == 3">
                  <img class="express_img" src="../../assets/img/yiban_seltted.png">
                  <p>一般</p>
                </div>
                <div class="appraise_expression" v-if="a.level == 4">
                  <img class="express_img" src="../../assets/img/manyi_seltted.png">
                  <p>满意</p>
                </div>
                <div class="appraise_expression" v-if="a.level == 5">
                  <img class="express_img" src="../../assets/img/chaozan_seltted.png">
                  <p>超赞</p>
                </div>
              </div>
              <Star :currentSelect="5" :scene="1" :customClass="'home'" ></Star>
              <p class="customerHead">{{a.content}}</p>
              <div class="flex-tab" v-if="a.level == 5 && a.appraiseMessage.length > 0">
                <span class="flex_item_tab" v-for="m in a.appraiseMessage">{{m.fileName}}</span>
              </div>
              <div class="backArticle" v-if="a.level == 5 && a.feedbackArticle">
                <span style="font-size: 12px;">推荐：{{a.feedbackArticle}}</span>
              </div>
              <!--评论图片-->
              <div class="flex_container_img" v-if="a.appraiseFiles.length == 1" v-for="f in a.appraiseFiles">
                <p class="commentBigImg" :style="{ backgroundImage: 'url(' + f.fileUrl + ')' }" v-if="f.fileUrl"></p>
                <p class="commentBigImg" style="background:url(../../assets/img/resto.png) no-repeat;background-size: 100% 100%;" v-if="!f.fileUrl"></p>
              </div>
              <div class="flex_container_img" v-if="a.appraiseFiles.length > 1" >
                <span class="commentSmallImg" v-for="f in a.appraiseFiles" :style="{ backgroundImage: 'url(' + f.fileUrl + ')' }"></span>
              </div>
              <div class="commentHeader">
                <span style="color: #636363;">{{new Date(a.createTime.time).format("yyyy-MM-dd hh:mm")}}</span>
                <span class="commentLeft" @click="commentNow(a)"><img src="../../assets/img/comment.png" alt="评论" style="margin-left: -1px;"/>评论</span>
                <span class="commentRight" @click="showLike(a,a.isParse)">
                  <img v-if="a.isParse" src="../../assets/img/likes.png" alt="点赞" />
                  <img v-if="!a.isParse" src="../../assets/img/heart.png" alt="点赞" />
                  <i v-if="a.isParse">点赞</i>
                  <i v-if="!a.isParse">取消</i>
                </span>
              </div>

              <div class="mainContent" v-if="a.appraisePraises.length || a.appraiseComments.length">
                <!--点赞人数-->
                <div class="likesContent" :class="{addBorder:a.appraiseComments.length}" v-if="a.appraisePraises.length != 0">
                  <img class="likesContent_like" src="../../assets/img/likes.png" alt="点赞" />
                  <div class="likesHead">
                    <span v-for="p in a.appraisePraises"><img class="avat" :src="p.headPhoto"></span>
                  </div>
                </div>
                <!--评论回复-->
                <div class="commentContent" v-if="a.appraiseComments.length != 0">
                  <img class="likesContent_comment" src="../../assets/img/comment.png" alt="评论" />
                  <div class="specificComment" v-for="c in a.appraiseComments" >
                    <span>
                      <span class="commentName" v-if="c.pid.length == 0" >{{c.nickName}}</span>
                      <span class="commentName" v-if="c.pid.length > 0" >{{c.nickName}}回复了{{c.replyName}}</span>
                      <span class="commentWord">: {{c.content}}</span>
                    </span>
                  </div>
                  <!--<span style="display: none" id="{{a.id}}span">-->
                    <!--<div class="specificComment" v-for="c in a.appraiseComments" >-->
                      <!--<span v-if="$index >= 3" @click="showCommentReply(a,c)" >-->
                        <!--<span class="commentName" v-if="c.pid.length == 0" >{{c.nickName}}</span>-->
                        <!--<span class="commentName" v-if="c.pid.length > 0" >{{c.nickName}}回复了{{c.replyName}}</span>-->
                        <!--<span class="commentWord">: {{c.content}}</span>-->
                      <!--</span>-->
                    <!--</div>-->
                  <!--</span>-->
                  <!--<span id="{{a.id}}info" class="commentName specificComment" v-if="a.appraiseComments.length > 3" @click="displayAllComment(a)">-->
                      <!--查看全部{{a.appraiseComments.length}}条回复-->
                  </span>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <!--当用户评论为空时-->
        <div class="emptyComment" style="padding-top: 5rem;;" v-if="appraiseCount.COUNT == 0">
          <img src="../../assets/img/noComment.png" alt="评论为空" />
          <p style="margin-top: 10px;">暂无数据,快来评论吧~</p>
        </div>
        <div class="weui-cell" v-if="isLoad">
          <p>
            <img class="loadingImg" src="../../assets/img/loading.gif" alt="加载中" />
            <span>正在加载中...</span>
          </p>
        </div>
        <div class="weui-cell" v-else="isOver && appraiseCount.Count != 0">
          <p>
            <img class="loadingImg" src="../../assets/img/gou.png" alt="加载中" />
            <span>已经全部加载完成</span>
          </p>
        </div>
      </div>
  </div>
  <appraiseMonth :appraiseFilterDialog="appraiseFilterDialog" :countList="countList" @close-filter="closeFilter" @filter-appraise="reloadAppraise"></appraiseMonth>
  <notice :noticeDialog.sync="noticeDialog" :noticeList="noticeList" @addNoticeHistory="addNoticeHistory"></notice>
  <commentAppraise :show="commentDialog.show" :appraiseBase="commentDialog.appraiseBase"
     :customer="commentDialog.customer" :comment="commentDialog.comment" @close-comment="closeComment"></commentAppraise>

  </div>
</template>

<script>
  import gcoord from 'gcoord'
  import utils from '../../utils/utils'
  import iconScore from '../../components/icon/iconScore'               //评分组件
  import appraiseMonth from '../../components/appraise/appraiseMonth'   //评论月报表
  import notice from '../../components/dialog/notice'                   //店铺广告
  import commentAppraise from '../../components/dialog/comment.vue'     //发表评论
  import Star from '../../components/star/star.vue'    //5颗星星
  import { mapState,mapGetters,mapActions } from 'vuex'
  import { wxConfigApi, bannerApi,advertApi,appraiseCountApi,listAppraiseApi,praiseApi,cancelPraiseApi,shopApi } from '../../fetch/api'
  import Utils from '../../utils/utils.js'
  import wx from 'weixin-js-sdk'                                             // 微信sdk

  export default {
    props: {
      customer: {
        type: Object
      },
      shop: {
        type: Object
      }
    },
    data () {
      return {
        bannerlist:[],                //轮播图
        advert:{},                    //广告
        appraiseCount:{},             //评论总数
        appraiseFilterDialog:false,   //评论筛选
        noticeDialog:false,           //店铺广告
        noticeList: [],               //店铺公告列表
        commentDialog:{show:false,appraiseBase:null, customer:null, comment:null},         //评论
        countList:[],                 //评论月报表
        appraiseList:[],               //评论列表
        currentPage:0,
        showCount:3,
        maxLevel:5,
        minLevel:5,
        isLoad:false,                 //加载中
        isOver:false,                  //加载完成
        praiseFlag:true
      }
    },
    components: {
      iconScore,
      appraiseMonth,
      notice,
      commentAppraise,
      Star
    },
    computed: {
      monthStar(){
        let star = 5;
        if(this.countList.length>0){
          star = this.countList[0].AVG_SCORE/100*5;
        }
        return Math.ceil(star);
      },
      monthScore(){
        let score = 100;
        if(this.countList.length>0){
          score = this.countList[0].AVG_SCORE.toFixed(2);
        }
        return score;
      }
    },
    mounted() {
      let _this = this;
      bannerApi.banner().then((response) => {
        _this.bannerlist = response.data;
        if(this.bannerlist.length>1){
          this.$nextTick(function () {
            let mySwiper = new Swiper('.swiper-container', {
              direction : 'horizontal',
              loop : true,
              autoplay : true
            })
          })
        }
      })
      this.loadNextPage();
    },
    async created(){
      // 处理分享链接逻辑 user.vue组件处理
      // let searchParam = sessionStorage.getItem('searchParam') || '';
      // let params = Utils.urlToObj(searchParam);
      // // params.isShareLink = true;
      // this.$emit('fromWhere', params);

      if (!this.customer || !this.customer.accountId) {
        this.$router.push({path:'/'});
      }
      let _this = this;
      advertApi.advert().then((response) => {
       if(response.data.length){
        _this.advert = response.data[0];
       }
      })
      appraiseCountApi.count().then((response) => {
        _this.appraiseCount = response.data.appraiseCount;
        _this.countList = response.data.appraiseMonthCount;
      })
      let params = {noticeType: null}
      let res = await shopApi.noticeList($.param(params))
      this.noticeList = res.data && res.data.filter(item => item.isRead===false); //过滤出未读的
    },
    methods:{
      async openshoplocation(){
        let result = gcoord.transform(
          [ this.shop.latitude, this.shop.longitude ],    // 经纬度坐标
          gcoord.BD09,    // 当前坐标系
          gcoord.GCJ02    // 目标坐标系
        );
        await Utils.wxConfig();
        wx.ready(() => {
          utils.wxOpenLocation(parseFloat(result[0]), parseFloat(result[1]),this.shop.name, this.shop.address);
        })
      },
      call(){
        window.location.href = `tel:${this.shop.phone}`;
      },
      reloadAppraise(min,max){
        this.isLoad=false;
        this.isOver=false;
        this.currentPage=0;
        this.minLevel=min;
        this.maxLevel=max;
        this.appraiseList=[];
        this.loadNextPage();
      },
      commentNow(a){
        this.commentDialog.show = true;
        this.commentDialog.appraiseBase = a;
        this.commentDialog.customer = this.customer;
        this.commentDialog.comment = null;
        // console.log(JSON.stringify(a));
      },
      closeFilter(){
        this.appraiseFilterDialog = false;
      },
      showFilter(){
        this.appraiseFilterDialog = true;
      },
      closeNotice(){
        this.noticeDialog = false;
      },
      async showNotice(){
        this.noticeDialog = true;
        let params = {noticeId: this.noticeList[0].id}
        await shopApi.addNoticeHistory($.param(params))
      },
      closeComment(){
        this.commentDialog.show = false;
      },
      // @Listener
      async addNoticeHistory(index) {
        let params = {noticeId: this.noticeList[index].id}
        await shopApi.addNoticeHistory($.param(params))
      },
      loadNextPage(){
        let that = this;
        if(!that.isLoad&&!that.isOver){
          that.isLoad = true;
          let option = {
            currentPage:that.currentPage,
            showCount:that.showCount,
            minLevel:that.minLevel,
            maxLevel:that.maxLevel
          };
          listAppraiseApi.appraise($.param(option)).then((response) => {
            for(let i in response.data){
              that.appraiseList.push(response.data[i]);
              if(that.appraiseList.length>0){
                that.hasAppraise = false;
              }
              response.data[i].isParse = true;
              for(let j in response.data[i].appraisePraises){
                let ap = response.data[i].appraisePraises[j];
                if(ap.customerId == that.customer.id){
                  response.data[i].isParse = false;
                }
              }
            }
            if(response.data.length<that.showCount){
              that.isOver=true;
            }
            that.isLoad = false;
          },option)
          that.currentPage = that.currentPage+that.showCount;
        }
      },
      showLike(appraise,isParse){
        let that = this;
        if(that.praiseFlag){
          if(isParse == true){
            that.praiseFlag = false;
            let param = {
              appraiseId:appraise.id
            };
            praiseApi.praise($.param(param)).then((response) => {
              if(response.success){
                let res = {};
                res.headPhoto = that.customer.headPhoto;
                let flag = true;
                for(let i=0;i<appraise.appraisePraises.length;i++){
                  if(that.customer.headPhoto == appraise.appraisePraises[i].headPhoto){
                    flag = false;
                  }
                }
                if(flag){
                  appraise.appraisePraises.push(res);
                }
                appraise.isParse = false;
                that.praiseFlag = true;
                this.$kiko_message({
                  isShow:true,
                  message: '点赞成功',
                  time: 2000,
                  type:1
                })
              }
            })
          }else{
            that.praiseFlag = false;
            let param = {
              appraiseId:appraise.id
            };
            cancelPraiseApi.cancel($.param(param)).then((response) => {
              if(response.success){
                let res = {};
                res.headPhoto = that.customer.headPhoto;
                for(let i=0;i<appraise.appraisePraises.length;i++){
                  if(that.customer.headPhoto == appraise.appraisePraises[i].headPhoto){
                    appraise.appraisePraises.splice(i,1);
                  }
                }
                appraise.isParse = true;
                that.praiseFlag = true;
                this.$kiko_message({
                  message: '取消点赞',
                  time: 2000,
                  type:1
                })
              }
            });
          }
        }
      },
      getIscroll(iscroll){
        let _this = this;
        if (iscroll) {
          iscroll.on('scrollEnd', function() {
            console.log("scrollEnd");
            _this.loadNextPage();
          });
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../../assets/css/home.css';
</style>
