<template lang="html">
  <div class="weui_dialog_confirm">
    <div class="weui-mask"></div>
    <div class="weui_dialog_record">
      <div class="full-height" v-iscroll=getIscroll>
    <div>
    <!--个人信息-->
    <div class="weui-cell weui-cell_access" style="padding: 15px;border-bottom: 10px solid #e7e7e7;">
      <div class="weui_cell_head">
        <img :src="customer.headPhoto" style="width: 60px;height: 60px;display: block">
      </div>
      <div class="weui_media_bd">
        <span >{{customer.nickname}}</span>
        <img class="customerSexSmall" src="../../assets/img/man.png" v-if="customer.sex == 1" />
        <img class="customerSexSmall" src="../../assets/img/woman.png" v-if="customer.sex == 2" />
        <p class="weui_media_desc">手机号:{{customer.telephone||"未绑定"}}</p>
      </div>
    </div>
     <!--我的评论-->
    <div class="weui-cell" style="border-bottom: 2px solid #e7e7e7;">
      <div class="weui_flex_item">
        <span style="font-weight: bold;">{{appraiseCount.appraiseCount}}</span>
        <span style="color: #888888;">评论</span>
      </div>
      <div class="weui_flex_item">
        <span style="font-weight: bold;">{{appraiseCount.commentCount}}</span>
        <span style="color: #888888;">回复</span>
      </div>
      <div class="weui_flex_item">
        <span style="font-weight: bold;">{{appraiseCount.praiseCount}}</span>
        <span style="color: #888888;">点赞</span>
      </div>
    </div>
    <div class="commentListInfor">
      <ul>
        <li v-for="f in appraiseAll" style="border-bottom: 1px solid #e7e7e7;" @click="showCommentDetails(f)">
          <div class="" style="position: relative;padding-top: 0.8rem;">
            <p class="appraiseNum">{{f.allGrade}}分</p>
            <p class="appraiseDate">{{f.createTime.substr(0,10)}}</p>
            <p class="appraiseText">{{f.content}}</p>
            <p class="flex-tab" style="margin-left: 5rem;">
	            <span class="flex_item_table" v-for="(a,index) in f.appraiseGrades">
	              <i v-for="j in textList" v-if="j.grade == a.grade && index == 0">服务{{j.word}}</i>
	              <i v-for="j in textList" v-if="j.grade == a.grade && index == 1">环境{{j.word}}</i>
	              <i v-for="j in textList" v-if="j.grade == a.grade && index == 2">性价比{{j.word}}</i>
	              <i v-for="j in textList" v-if="j.grade == a.grade && index == 3">氛围{{j.word}}</i>
	              <i v-for="j in textList" v-if="j.grade == a.grade && index == 4">出品{{j.word}}</i>
	            </span>
            </p>
            <div class="flex_container_img" v-if="f.appraiseSteps.length == 1"
                 style="margin: 0.6rem 0.5rem 0 5rem;width: initial;flex-wrap: wrap;">

	            <span v-for="img in f.appraiseSteps" class="commentBigImg"
	                                :style="{backgroundImage:'url(' + img.pictureUrl + ')',backgroundSize: '100% 100%'}"
                                  v-if="img.pictureUrl">
	              <p class="bgImg">
	                <img class="zanOrCaiImg" v-if="img.state == 1" src="../../assets/img/btn_zan_selected.png"/>
	                <img class="zanOrCaiImg" v-if="img.state == 0" src="../../assets/img/btn_cai_selected.png"/>
	              </p>
	            </span>
              <span v-for="img in f.appraiseSteps" class="commentBigImg"
                    style="background:url(../../assets/img/restowechat.png) no-repeat;background-size: 100% 100%;"
                    v-if="!img.pictureUrl">
	              <p class="bgImg">
	                <img class="zanOrCaiImg" v-if="img.state == 1" src="../../assets/img/btn_zan_selected.png"/>
	                <img class="zanOrCaiImg" v-if="img.state == 0" src="../../assets/img/btn_cai_selected.png"/>
	              </p>
	            </span>
            </div>
            <div class="flex_container_img" v-if="f.appraiseSteps.length > 1"
                 style="margin: 0.6rem 0.5rem 0 5rem;width: initial;flex-wrap: wrap;">
	            <span v-for="(img,index) in f.appraiseSteps" class="commentSmallImg"
                                  :style="{backgroundImage:'url(' + img.pictureUrl + ')',backgroundSize: '100% 100%'}"
                                  v-if="img.pictureUrl && index<9">
	              <p class="bgImg">
	                <img class="zanOrCaiImg" v-if="img.state == 1" src="../../assets/img/btn_zan_selected.png"/>
	                <img class="zanOrCaiImg" v-if="img.state == 0" src="../../assets/img/btn_cai_selected.png"/>
	              </p>
	            </span>
              <span v-for="(img,index) in f.appraiseSteps" class="commentSmallImg"
                    style="background:url(../../assets/img/restowechat.png) no-repeat;background-size: 100% 100%;"
                    v-if="!img.pictureUrl && index<9">
	              <p class="bgImg">
	                <img class="zanOrCaiImg" v-if="img.state == 1" src="../../assets/img/btn_zan_selected.png"/>
	                <img class="zanOrCaiImg" v-if="img.state == 0" src="../../assets/img/btn_cai_selected.png"/>
	              </p>
	            </span>
            </div>
          </div>
          <div class="commentHeader">
            <span class="commentLeft"><img src="../../assets/img/likes.png" alt="点赞" style="left: -22px;"/>{{(f.appraisePraises && f.appraisePraises.length) || 0}}</span>
            <span class="commentRight"><img src="../../assets/img/comment.png" alt="评论" style="left: -22px;"/>{{(f.appraiseComments && f.appraiseComments.length) || 0}}</span>
          </div>
        </li>
      </ul>
      <div v-if="appraiseCount.appraiseCount">
        <div class="weui_cell font-mini" v-if="isLoad">
          <p><i class="icon-spinner icon-spin"></i>正在加载中...</p>
        </div>
        <div class="weui_cell font-mini" v-if="isOver">
          <p><i class="icon-ok"></i>已经全部加载完成</p>
        </div>
      </div>
      <!--当用户评论为空时显示-->
      <div class="emptyComment" v-if="!appraiseCount.appraiseCount">
        <img src="../../assets/img/emptyComment.png" alt="评论为空"/>
        <p>还没有收到称赞</p>
        <p>快去评论吧 !</p>
      </div>
    </div>
  </div>

  </div>
    </div>
  </div>

</template>

<script>
  import { customerApi, myAppraiseCountApi, appraiseCustomerApi } from '../../fetch/api'
  export default {
    data () {
      return {
        customer: {},
        appraiseCount: {},
        currentPage: 0,
        showCount: 3,
        appraiseAll: [],
        isLoad: false,
        isOver: false,
        myScroll: null,
        loadShow: false,
        textList: [
          {
            grade: 20,
            word: "非常差"
          },
          {
            grade: 40,
            word: "差"
          },
          {
            grade: 60,
            word: "一般"
          },
          {
            grade: 80,
            word: "满意"
          },
          {
            grade: 100,
            word: "超赞"
          }
        ],
      }
    },
    components: {
    },
    created(){
      let _this = this;
      customerApi.customer().then((response) => {
        _this.customer = response.data;
      })
      console.log(this.redDialogShow);
      myAppraiseCountApi.count().then((response) => {
        console.log('response',response)
        let data = response.data;
        _this.appraiseCount = {
          appraiseCount: data.appraiseCount,
          praiseCount: data.praiseCount,
          commentCount: data.commentCount
        }
      })
      this.loadNextPage();
    },
    methods:{
      getIscroll(iscroll){
        var that = this;
        if (iscroll) {
          iscroll.on('scrollEnd', function() {
            console.log("scrollEnd");
            if (this.y <= this.maxScrollY) {
              that.loadNextPage();
              //this.refresh();
            }
          });
        }
      },
      loadNextPage() {
        var that = this;
        if (!that.isLoad && !that.isOver) {
          that.isLoad = true;
          var option = {
            currentPage: that.currentPage,
            showCount: that.showCount
          };
          appraiseCustomerApi.appraiseList($.param(option)).then((response) => {
            console.log('response111',response)
            for (var i in response.data) {
              that.appraiseAll.push(response.data[i]);

            }
            if (that.appraiseCount.appraiseCount < that.currentPage) {
              that.isOver = true;
            }
            that.isLoad = false;
          })
          that.currentPage = that.currentPage + 1;
        }
      },
      showCommentDetails(f) {
        console.log('fffffffff',f)
        this.$router.push({ path: '/user/myCommentDetails',query:{customer:this.customer,appraiseId:f.appraiseId}});
      }
    }
  }
</script>

<style scoped>
  @import '../../assets/css/myComment.css';
</style>
