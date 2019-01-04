<template>
  <!-- 老版本评论组件 -->
  <CloseWrap v-if="show===0" @close-dialog="$emit('close-comments')">
    <div class="comments-old" slot="content">
      
      <h4 class="shop-name-money"> <span>{{brandSetting.data.brandName}}-{{shop.name}}</span> <span class="c-gray">账单消费{{orderInfo.orderMoney || orderInfo.amountWithChildren}}元</span> </h4>
      
      <transition name="initbox-fade" mode="out-in">
        <div v-if="!showMain" class="text-left appraise-dialog no-appraise">
          <div class="scoreCircle" style="margin:0px auto;">
            <div id="myBoomsakalaka"></div>
          </div>
          <CommentsStar 
            :title="starTitle" 
            :customClass="customClass" 
            @selectLevel="selectLevel"></CommentsStar>
          <div class="bottom-button">
            <div class="weui_dialog_ft margin-top-0">
              <a class="weui_btn_dialog defult order" style="color: #C81624;white-space: nowrap;">请评价您的订单,领取{{brandSetting.data.brandName}}1红包</a>
            </div>
          </div>
        </div>
      </transition>
      <transition name="mainbox-fade" mode="out-in">
        <div v-if="showMain">
          <div class="comments-box">
            <CommentsStar  
              :title="starTitle" 
              :customClass="customClass" 
              :currentSelect="level" 
              @selectLevel="selectLevelSmall"></CommentsStar>
            <div class="mainAppraise">
              <FormGroup :title="formTitle" :customClass="customClass">
                <template slot="content">
                  <CommentsTag 
                    :customClass="customClass" 
                    :list="listShowPhoto.badList"
                    @selectOne="selectTag"
                    ></CommentsTag>
                    <CommentsTag 
                    :customClass="customClass"
                    :list="listShowPhoto.goodList"
                    @selectOne="selectTag"
                    ></CommentsTag>
                  <div class="dash-line"><!--虚线分割--></div>
                  <CommentsTag 
                    :customClass="customClass"
                    :list="orderInfo.orderItems"
                    @selectOne="selectArticle"
                    ></CommentsTag>
                </template>
              </FormGroup>
              <FormGroup title="消费评价" :customClass="customClass">
                <template slot="content">
                  <div class="weui_cell_bd weui_cell_primary"> 
                    <textarea class="weui_textarea" placeholder="请输入评论~" rows="3" v-model="content"></textarea> 
                    <span v-if="content.length<3" id="RemainingTextBad" style="font-size:12px;position:absolute;right:6px;color:#bdbdbd;bottom:56px;">还差{{3-content.length}}个字哟</span> 
                  </div>                  
                </template>
              </FormGroup>
            </div>
            <div class="bottom-button">
              <div class="weui_dialog_ft margin-top-0" @click="saveAppraise"> 
                <a class="weui_btn_dialog primary">领取红包</a> 
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </CloseWrap>
  <CommentsMoney v-else-if="show===1" 
    :orderId="orderId" 
    @jump-share="$emit('update:show', 2)" @close-comments-money="$emit('close-comments')"></CommentsMoney>
  <CommentsShare v-else-if="show===2" 
    :orderId="orderId" @close-comments-share="$emit('close-comments')"></CommentsShare>
</template>

<script>
  import 'jquery-circliful'
  import CommentsMoney from '../comments-money.vue'
  import CommentsShare from '../comments-share.vue'
  import CloseWrap from "../../../../components/dialog/wrap/close.vue";
  import FormGroup from "../../../../components/dialog/wrap/form-group.vue"
  import CommentsStar from './comments-star.vue'
  import CommentsTag from './comments-tag.vue'
  import {orderStatus, submitAppraise} from '../../../../fetch/api.js'
  import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
  
  let txtCfg = {
    0: { txt: '满意度'},
    1: { txt: '非常不满意,各方面都很差'},
    2: { txt: '不满意，比较差'},
    3: { txt: '一般体验，还需改进'},
    4: { txt: '基本满意，仍可改进'},
    5: { txt: '非常满意，五星体验'}
  }
  let formTitleCfg = {
    1: {txt: '我要投诉'},
    2: {txt: '我要投诉'},
    3: {txt: '我要投诉'},
    4: {txt: '需要改进'},
    5: {txt: '我要点赞'}
  }
  export default {
    props: {
      orderId: {
        type: String,
        required: true
      },
      show: {
        type: Number,
        default: 0      // 0:评论组件；1：显示金额组件；2：显示分享组件
      }
    },
    data() {
      return {
        // show: 0,             // 0:评论组件；1：显示金额组件；2：显示分享组件
        level: 0,            // 1-5
        personalScore: 0,    // 得分
        showMain: false,     // 是否显示隐藏的评论组件
        starTitle: txtCfg[0].txt,      // 星星的文字
        formTitle: '',       // 点赞标题
        customClass: 'bad',  // css类
        listShowPhoto: {},   // 评论标签
        content: '',         // 评论文字
        orderInfo: {},       // 订单信息
        tagList: [],         // 标签列表
        articleList: [],     // 菜品列表
      }
    },
    computed: {
      ...mapGetters([
        'shop',
        'brandSetting'
      ]),
    },
    components: {
      CommentsMoney,
      CommentsShare,
      CloseWrap,
      FormGroup,
      CommentsStar,
      CommentsTag
    },
    async mounted() {
      // 初始化图表
      $("#myBoomsakalaka").circliful({
        foregroundBorderWidth: 10,
        backgroundBorderWidth: 10,
        noPercentageSign: true,
        foregroundColor: '#C81624',
        backgroundColor: '#F2F2F2',
        percent: 0,
        text: '请选择评分',
        textAdditionalCss: 'display:none', // 0不显示
        textStyle: 'font-size:1.2rem;',
        textY: 105 // bug不起作用
      });
      // 获取评论标签
      this.listShowPhoto = await submitAppraise.listShowPhoto();
      // 获取订单信息
      
      let res = await orderStatus.customerNewOrder($.param({orderId: this.orderId}));
      this.orderInfo = res.data;
    },
    methods: {
      //@selectLevel
      selectLevel(level) {
        this.__selectLevel(level);
        //console.log(this.personalScore)
        this.$nextTick(() => {
          $("#myBoomsakalaka").html('');
          $("#myBoomsakalaka").circliful({
            animation: 1,
            animationStep: 18,
            foregroundBorderWidth: 10,
            backgroundBorderWidth: 10,
            noPercentageSign: true,
            percentageTextSize: 24,
            foregroundColor: '#C81624',
            backgroundColor: '#F2F2F2',
            decimals: 2,
            percent: this.personalScore,
            percentageY: 100, // bug，不起作用
            fontColor: '#000'
          }, () => {
            this.showMain = true;
          });
        })
      },
      //@selectLevel
      selectLevelSmall(level) {
        this.__selectLevel(level);
        
      },
      __selectLevel(level) {
        this.level = level;
        let cfg = {
          1: 20,
          2: 40,
          3: 60,
          4: 80,
          5: 100
        }
        this.personalScore = cfg[level];
        this.customClass = this.level<=4? 'bad': 'good';
        this.starTitle = txtCfg[level].txt;
        this.formTitle = formTitleCfg[level].txt;
      },
      // 
      async saveAppraise() {
        try {
          if (this.content.length < 3) {
            throw new Error('请输入3字以上的评论~');
          }

          let photoIds = [];
          let articleId = [];
          let feedback = [];
          let feedbackArticle = [];
          this.tagList.forEach((item, index) => {
            if (item.click === true) {
              photoIds.push(item.id)
              feedback.push(item.title)
            }
          })
          this.articleList.forEach(item => {
            if (item.click === true) {
              articleId.push(item.id)   // 
              feedback.push(item.articleName)
              feedbackArticle.push(item.articleName)
            }
          })
          let params = {
            mediaIds: '',
            type: this.level,
            articleId: articleId.join(','),
            photoIds: photoIds.join(','),
            feedback: feedback.join(','),
            feedbackArticle: feedbackArticle.join('  '), 
            level: this.level,
            orderId: this.orderId,
            content: this.content
          }
          let res = await submitAppraise.saveAppraise($.param(params));
          //
          this.isShow = false;
          // this.$emit('add-praise', res);
          this.$emit('update:show', 1)
        } catch(e) {
          return this.$kiko_message({
            isShow: true,
            message: e.message,
            time: 2000,
            type: 2
          })
        }
      },
      // @Listener
      closeDialog() {
        this.isShow = false;
      },
      // @Listener
      selectTag(checkList) {
        this.tagList = checkList;
      },
      // @Listener
      selectArticle(checkList) {
        this.articleList = checkList;
      },
      // @Listener
      // jumpShare() {
      //   this.$emit('update:show', 2)
      // }
    }
  };
</script>

<style lang="less">
  .initbox-fade-enter-active,
  .initbox-fade-leave-active {
    transition: 0s;
  }
  .initbox-fade-enter,
  .initbox-fade-leave-to {
    // margin-top: -120vw;
    opacity: 0;
  }
  .appraise-level {
    transition: all .8s;
  }
  .mainbox-fade-enter-active,
  .mainbox-fade-leave-active {  
  }
  .mainbox-fade-enter,
  .mainbox-fade-leave-to {
    .appraise-level {
      transform: scale(1.5);
      opacity: 0;      
    }
  }
  .comments-old {
    >.shop-name-money {
      padding-top: 0.6rem;
      >.c-gray {
        color: #868686;
      }
    }
    >.appraise-dialog {
      padding: 5px 10px;
      >.scoreCircle {
        margin: 0 auto;
        #myBoomsakalaka {
          >.circliful {
            position: relative;
          }
        }
      }
      .bottom-button {
        position: absolute;
        bottom: 0px;
        width: calc(100% - 20px);
        text-align: center;
        a {
          display: block;
          height: 2.6rem;
          line-height: 2.6rem;
          border-top: 1px solid #D5D5D6;
        }
      }
    }
  }
  .comments-box {
    padding: 5px 10px;
    box-sizing: border-box;
    .mainAppraise {
      .dash-line {
        height: 0;
        border-bottom: 1px dashed #C5C4C4;
      }
      .comments {
        .good {
          color: #c81623;
        }
      }
      .weui_textarea {
        display: block;
        border: 0;
        resize: none;
        width: 100%;
        color: inherit;
        font-size: 1em;
        line-height: inherit;
        outline: 0;
      }
    }
      .bottom-button {
        position: absolute;
        bottom: 6px;
        width: calc(100% - 20px);
        text-align: center;
        .weui_dialog_ft a {
          // margin: 10px;
          display: block;
          width: 100%;
          height: 2rem;
          line-height: 2rem;
          border-radius: 5px;
          position: relative;
          &.primary {
            background-color: #000;
            color: #fff;
            text-align: center;
          }
        }
      }
  }
</style>
