<template lang="html">
 <div class="weui_dialog_confirm">
   <div class="weui-mask"></div>
   <div class="weui_dialog_record">
     <div class="myComment" v-iscroll=getIscroll>
     <div class="appraise-item" style="border: initial;font-family: '微软雅黑';">
       <div class="new-appraise-item">
         <div class="new-reviewListInfo">
           <div class="new-avatar">
             <img v-if="appriaseNew.headPhoto" :src="appriaseNew.headPhoto" alt="用户头像" style="border-radius: 3px;">
             <img v-if="!appriaseNew.headPhoto" src="../../assets/img/restowechat.png" alt="用户头像" style="border-radius: 3px;">
           </div>
           <p class="new-customerHead">
             <span v-if="appriaseNew.nickName">{{appriaseNew.nickName}}</span>
             <span v-if="!appriaseNew.nickName">匿名用户</span>
             <span style="font-size: 12px;color: #999;">{{appriaseNew.createTime}}</span>
             <span style="float: right;color: #ff8832;font-size: 1.2rem;">{{appriaseNew.level}}分</span>
           </p>
           <p class="new-customerHead" style="font-size: 0.9rem;margin-top: 0.5rem;">{{appriaseNew.content}}</p>
           <p class="new-flex-tab">
             <span class="new_flex_item_tab" :class="{good:appriaseNew.level==100,bad:appriaseNew.level<100}" v-for="a in appriaseNew.feedbackList" v-if="a != ''">
               <i>{{a}}</i>
             </span>
           </p>
           <!--菜品赞踩-->
           <div class="flex_container_img" v-if="appriaseNew.appraiseSteps && appriaseNew.appraiseSteps.length == 1"
                style="margin: 0.4rem 0.5rem 0 3.5rem;width:    initial;flex-wrap: wrap;">
             <span v-for="(img,index) in appriaseNew.appraiseSteps" class="commentBigImg"
                   :style="{backgroundImage:'url(' + img.pictureUrl + ')',backgroundSize: '100% 100%'}"
                   v-if="img.pictureUrl">
               <p class="bgImg">
                 <img class="zanOrCaiImg" v-if="img.state == 1" src="../../assets/img/btn_zan_selected.png" />
                 <img class="zanOrCaiImg" v-if="img.state == 0" src="../../assets/img/btn_cai_selected.png" />
               </p>
             </span>
             <span v-for="(img,index) in appriaseNew.appraiseSteps" class="commentBigImg"
                   style="background:url(../../assets/img/restowechat.png) no-repeat;background-size: 100% 100%;" v-if="!img.pictureUrl">
               <p class="bgImg">
                 <img class="zanOrCaiImg" v-if="img.state == 1" src="../../assets/img/btn_zan_selected.png" />
                 <img class="zanOrCaiImg" v-if="img.state == 0" src="../../assets/img/btn_cai_selected.png" />
               </p>
             </span>
           </div>
           <div class="flex_container_img" v-if="appriaseNew.appraiseSteps && appriaseNew.appraiseSteps.length > 1"
                style="margin: 0.4rem 0.5rem 0 3.5rem;width: initial;flex-wrap: wrap;">
             <span v-for="(img,index) in appriaseNew.appraiseSteps" class="commentSmallImg"
                   :style="{backgroundImage:'url(' + img.pictureUrl + ')',backgroundSize: '100% 100%'}" v-if="img.pictureUrl && index<9">
               <p class="bgImg">
                 <img class="zanOrCaiImg" v-if="img.state == 0" src="../../assets/img/btn_zan_selected.png" />
                 <img class="zanOrCaiImg" v-if="img.state == 1" src="../../assets/img/btn_cai_selected.png" />
               </p>
             </span>
             <span v-for="(img,index) in appriaseNew.appraiseSteps" class="commentSmallImg"
                   style="background:url(../../assets/img/restowechat.png) no-repeat;background-size: 100% 100%;"
                   v-if="!img.pictureUrl && index<9">
               <p class="bgImg">
                 <img class="zanOrCaiImg" v-if="img.state == 0" src="../../assets/img/btn_zan_selected.png" />
                 <img class="zanOrCaiImg" v-if="img.state == 1" src="../../assets/img/btn_cai_selected.png" />
               </p>
             </span>
           </div>

           <div class="commentHeader" style="margin-left: 3.5rem;margin-bottom: 24px;">
             <span class="commentLeft" @click="showComment(appriaseNew)"><img src="../../assets/img/comment.png" alt="评论" style="margin-left: -1px;"/>评论</span>
             <span class="commentRight" @click="showLike(appriaseNew,appriaseNew.isParse)">
		           <img v-if="appriaseNew.isParse"  src="../../assets/img/likes.png" alt="点赞" />
		           <img v-if="!appriaseNew.isParse"  src="../../assets/img/heart.png" alt="点赞" />
		           <span v-if="appriaseNew.isParse" >点赞</span>
		           <span v-if="!appriaseNew.isParse" >取消</span>
		         </span>
           </div>
           <div class="mainContent" v-if="appriaseNew.appraisePraises || appriaseNew.appraiseComments" style="margin-left: 3.5rem;">
             <div class="likesContent" :class="{addBorder:appriaseNew.appraiseComments.length}" v-if="appriaseNew.appraisePraises.length != 0">
               <img class="likesContent_like" src="../../assets/img/likes.png" alt="点赞" />
               <div class="likesHead">
                 <span v-for="p in appriaseNew.appraisePraises">
                   <img v-if="p.headPhoto" :src="p.headPhoto" class="avat">
                   <img v-if="!p.headPhoto" src="../../assets/img/restowechat.png" class="avat">
                 </span>
               </div>
             </div>
             <div class="commentContent" v-if="appriaseNew.appraiseComments && appriaseNew.appraiseComments.length != 0">
               <img class="likesContent_comment" src="../../assets/img/comment.png" alt="评论" />
               <div class="specificComment" v-for="c in appriaseNew.appraiseComments" >
		             <span v-if="$index < 3"  @click="showCommentReply(appriaseNew,c)">
		               <span class="commentName" v-if="!c.pid" >{{c.nickName}}</span>
		               <span class="commentName" v-if="c.pid" >{{c.nickName}}回复了{{c.replyName}}</span>
		               <span class="commentWord">: {{c.content}}</span>
		             </span>
               </div>
               <span>
		             <div class="specificComment" v-for="c in appriaseNew.appraiseComments" >
		               <span v-if="$index >= 3" @click="showCommentReply(appriaseNew,c)" >
		                 <span class="commentName" v-if="!c.pid" >{{c.nickName}}</span>
		                 <span class="commentName" v-if="c.pid" >{{c.nickName}}回复了{{c.replyName}}</span>
		                 <span class="commentWord">: {{c.content}}</span>
		               </span>
		             </div>
               </span>
               <span  class="commentName specificComment" v-if="appriaseNew.appraiseComments.length > 3" @click="displayAllComment(appriaseNew)">
		                 查看全部{{appriaseNew.appraiseComments.length}}条回复
		           </span>
             </div>
           </div>
         </div>
       </div>
     </div>
     <commentAppraise :show="commentDialog.show" :appraiseBase="commentDialog.appraiseBase"
                      :customer="commentDialog.customer" :comment="commentDialog.comment" @close-comment="closeComment"></commentAppraise>
   </div>
   </div>
 </div>

</template>

<script>
  import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
  import { getAppraiseInfo,praiseApi,cancelPraiseApi } from '../../fetch/api'
  import commentAppraise from '../../components/dialog/comment.vue'     //发表评论
  export default {
    data () {
      return {
        // customer:{},
        appraiseId:'',
        appriaseCustomer:{},
        praiseFlag:true,
        appraise:{},
        commentDialog:{show:false, appraiseBase:null, customer:null, comment:null},
        iframeDialogPhoto:{show:false,appraise:null,picindex:0},
        //loadShow : false,
        wMessage: {show: 0, message: "",type:null},
        appriaseNew:{}
      }
    },
    computed: {
      ...mapGetters([
        'customer',
      ])
    },
    components: {
      commentAppraise
    },
    created: function (){
      var that = this;
      this.loadShow = true;
      // this.customer = this.$route.query.customer;
      this.appraiseId = this.$route.query.appraiseId;
      var option = {
        appraiseId: this.appraiseId
      };
      getAppraiseInfo.detail($.param(option)).then((response) => {
        // console.log('response555555',response)
        that.appriaseNew = response.data || {};
      })
    },
    methods:{
      getIscroll(iscroll){
        var that = this;
        if (iscroll) {
          iscroll.on('scrollEnd', function() {
            console.log("scrollEnd");

          });
        }
      },
      showComment(appraise){
        this.commentDialog.show = true;
        this.commentDialog.appraiseBase = appraise;
        this.commentDialog.customer = this.customer;
        this.commentDialog.comment = null;
      },
      showLike(appraise,isParse){
        console.log('appraise',appraise,isParse)
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
      closeComment(){
        this.commentDialog.show = false;
      },
    }
  }
</script>

<style scoped>
  /*@import '../../assets/css/myComment.css';*/
  .weui_cell {
    border-bottom: 5px solid #e7e7e7;
  }
  .weui_cell_hd {
    position: relative;
    margin-right: 15px;
  }
  .weui_flex_item {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    text-align: center;
  }
  .weui_flex_item span {
    display: block;
  }
  .stopIscroll {
    position: relative;
    height: 100%;
    overflow: hidden;
  }
  .myComment {
    margin: 0px 10px;
  }
  .swiper-pagination-bullet-active {
    opacity: 1;
    background: #fff;
  }
  .new-comment {
    padding: 0 15px;
    border-top: 1px solid #E7E7E7;
  }
  .new-appraise-item {
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
  }
  .new-reviewListInfo {
    position: relative;
  }
  .new-avatar {
    position: absolute;
    height: 3rem;
    width: 3rem;
  }
  .new-customerHead {
    color: #666;
    font-size: 1rem;
    margin-left: 3.5rem;
  }
  .myComment {
    margin: 0px 10px;
  }
  .weui_dialog_record {
    position: fixed;
    z-index: 1000;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
    background: #fff;
  }
</style>
