<template>
  <div class="weui_dialog_confirm" id="my-comments" >
    <div class="weui_mask" @click="close"></div>
    <div class="weui_dialog red_bg" style="z-index:100;background-color:#eee;">
      <div id="scrollAppraise" v-iscroll=getIscroll>
        <!-- iscroll容器 -->
        <div style="">
          <div class="expression_tab">
            <p class="header_title" :class="{orange: params.level==100}">{{title}}</p>
            <CommentsFace class="flex-container-score" :type="0" @set-score="setScore"></CommentsFace>
            <!-- 后台设置的标签 -->
            <div v-if="params.level==100">
              <!-- 最多显示9个 -->
              <div class="flex-container-tab">
                <span v-for="(item, index) in listShowPhoto" v-if="index<=8" class="flex_item_label good" :class="{'checkedgood': item.click===true}" :key="item.id" @click="checkLabel(item.id)">{{item.title}}</span>
              </div>

            </div>
            <!-- 最多显示6个 -->
            <p>你会推荐哪些菜品</p>
            <div class="flex-container-tab" v-if="params.level==100">
              <span class="flex_item_label good" :class="{'checkedgood': item.click===true}" @click="checkFood(item.id)" v-for="(item, index) in orderInfo.orderItems" v-if="index<=5">{{item.articleName}}</span>
            </div>
            <div class="flex-container-tab" v-else>
              <span class="flex_item_label bad" :class="{'checkedbad': item.click===true}" @click="checkFood(item.id)" v-for="(item, index) in orderInfo.orderItems" v-if="index<=5">{{item.articleName}}</span>
            </div>
            <div class="weui_cell appraise">
              <div class="weui_cell_primary" style="padding: 5px;height:78px;position: relative;">
                <textarea class="weui_textarea" placeholder="你说，我们在倾听..." rows="3" maxlength="100" style="background: #eee;" v-model="params.content"></textarea>
                <div class="weui_textarea_counter"><span>{{params.content.length}}</span>/100</div>
              </div>
            </div>
          </div>
          <div class="appraise_main">
            <div class="expression_tab">
              <div class="appraise_score">
                <p class="tab_text">服务</p>
                <div class="expression_content">
                  <CommentsFace :type="1" @set-score="setScore"></CommentsFace>
                </div>
              </div>
              <div class="appraise_score">
                <p class="tab_text">环境</p>
                <div class="expression_content">
                  <CommentsFace :type="2" @set-score="setScore"></CommentsFace>
                </div>
              </div>
              <div class="appraise_score">
                <p class="tab_text">性价比</p>
                <div class="expression_content">
                  <CommentsFace :type="3" @set-score="setScore"></CommentsFace>
                </div>
              </div>
              <div class="appraise_score">
                <p class="tab_text">氛围</p>
                <div class="expression_content">
                  <CommentsFace :type="4" @set-score="setScore"></CommentsFace>
                </div>
              </div>
              <div class="appraise_score">
                <p class="tab_text">出品</p>
                <div class="expression_content">
                  <CommentsFace :type="5" @set-score="setScore"></CommentsFace>
                </div>
              </div>
            </div>
            <div class="btn-wrap" style=""><button class="weui_btn receive" @click.stop="addAppraise">领取奖励</button></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { orderStatus, submitAppraise } from '../../../../fetch/api.js'
  import CommentsFace from './comments-face.vue' // 表情组件


  export default {
    props: {
      orderId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        title: '本次消费满意度',
        //{"content":"good","allGrade":80,"appraiseGrades":[{"type":1,"grade":80},{"type":2,"grade":80},{"type":3,"grade":80},{"type":4,"grade":80},{"type":5,"grade":80}],"appraiseSteps":[{"articleId":"147ce3b6e6ef4c4fb558ff99f7b79f43","state":1}],"orderId":"e13af224093c4b3d938c299711b7d27f","level":100,"feedback":"口味好,环境好,口味真棒,"}
        params: {orderId: '',content: '', appraiseGrades: [], appraiseSteps: [], feedback: ''},
        listShowPhoto: [],      // 后台设置评论标签
        orderInfo: {},          // 订单的信息
      }
    },
    components: {
      CommentsFace,
    },
    created() {
      submitAppraise.listShowPhoto().then(res => this.listShowPhoto = res.goodList);
      // 查询订单信息
      let params = {orderId: this.orderId};
      orderStatus.customerNewOrder($.param(params)).then(res => {
        if (res.success == true && res.data) {
          this.orderInfo = res.data;
        }
      })
    },
    mounted() {
        $("#my-comments").bind("touchstart", function(event){
          event.stopPropagation();
        })
    },
    methods: {
      getIscroll(iscroll){
        if (iscroll) {
          iscroll.on('scrollEnd', function() {
            console.log("scrollEnd");
          });
        }
      },
      close(){
        this.$emit('close-comments');
      },
      addAppraise() {
        this.params.orderId = this.orderId;
        // this.params.allGrade = 100;
        this.params.appraiseSteps = [];
        this.orderInfo.orderItems.forEach(item => {
          if (item.click === true) {
            this.params.appraiseSteps.push({articleId: item.id, state: 1});
          }
        })
        if (! this.params.level) {
          return this.$kiko_message({
            isShow: true,
            message: '亲，请勾选所有评分项~',
            time: 2000,
            type: 2
          })
        }
        if (this.params.content.length === 0) {
          return this.$kiko_message({
            isShow: true,
            message: '亲，评论不能为空哦~',
            time: 2000,
            type: 2
          })
        }
        if (this.params.appraiseGrades.length !== 5) {
          return this.$kiko_message({
            isShow: true,
            message: '亲，请勾选所有评分项~',
            time: 2000,
            type: 2
          })
        }
        // 平均分
        let total = 0;
        this.params.appraiseGrades.forEach(item => {
          total += item.grade;
        })
        this.params.allGrade = total/5;

        // 标签
        this.listShowPhoto.forEach(item => {
          if (item.click === true) {
            this.params.feedback += item.title;
          }
        })
        submitAppraise.addPraise(this.params).then((res)=> {
          // 跳转到红包金额提示页
          this.$emit('add-praise');
        }).catch(() => {
        })
      },
      checkLabel(id) {
        // console.log(id)
        this.listShowPhoto.forEach(item => {
          if (item.id == id) {
            item.click = !!!item.click;
            item = {...item};
          }
        })
        this.listShowPhoto = [...this.listShowPhoto];
      },
      checkFood(id) {
        this.orderInfo.orderItems.forEach(item => {
          if (item.id === id) {
            item.click = !!!item.click;
            item = {...item};
          }
        })
        this.orderInfo = {...this.orderInfo};
      },
      setScore(type, score) {
        let cfg = {
          20: '极差',
          40: '较差',
          60: '一般',
          80: '待改进',
          100: '超赞'
        }
        if (type == 0) {    // 总分
          this.params.level = score;
          this.title = cfg[score];
        } else {            // 分项得分
          let item = {type: type, grade: score};
          if (this.params.appraiseGrades && this.params.appraiseGrades.length > 0) {
            let typeIndex = this.params.appraiseGrades.findIndex(item => item.type==type);
            if (typeIndex !== -1) {
              this.params.appraiseGrades[typeIndex] = item;
            } else {
              this.params.appraiseGrades.push(item);
            }
          } else {
            this.params.appraiseGrades = [];
            this.params.appraiseGrades.push(item);
          }
        }
      }
    }
  }
</script>

<style lang="less">
  #my-comments {
    .weui_mask {
      position: fixed;
      z-index: 1;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.6);
    }
    .red_bg {
      z-index: 100;
      background-color: #eee;
      height: 120vw;
      #scrollAppraise {
        position: relative;
        overflow: hidden;
        border-radius: 10px;
        height: 100%;
        .expression_tab {
          position: relative;
          width: 74vw;
          left: 3vw;
          top: 3vw;
          background-color: #fff;
          border-radius: 5px;
          padding-bottom: 3vw;
          .header_title {
            text-align: center;
            padding-top: 10px;
            font-size: 1rem;
            &.orange {
              color: #ff8932;
            }
          }
          .flex-container-tab {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            width: 66vw;
            padding: 3vw 4vw 3vw 4vw;
            >.flex_item_label {
              padding: 5px 6px;
              width: 13vw;
              text-align: center;
              border-radius: 5px;
              font-size: 0.8rem;
              white-space: nowrap;
              margin: 1vw 2vw;
              text-overflow: ellipsis;
              overflow: hidden;
              &.good {
                color: #ff8932;
                border: 1px solid #ff8932;
                &.checkedgood {
                  background-color: #ff8932;
                  color: #fff;
                }
              }
              &.bad{
                color: #000;
                border: 1px solid #000;
                &.checkedbad {
                  background-color: #000;
                  color: #fff;
                }
              }
            }

          }
          .flex-container-score {
            display: flex;
            justify-content: space-between;
            width: 64vw;
            padding: 10px 5vw 10px 5vw;
            .expression_img {
              width: 1.6rem;
              height: 1.6rem;
              vertical-align: middle;
            }
          }
          .weui_cell.appraise {
            padding: initial;
            bottom: 9px;
            width: 68vw;
            margin: 3vw;
            background: #eee;
            textarea {
              display: block;
              width: 100%;
              height: 100%;
              font-size: 1rem;
              border: none;
              outline: none;
              resize: none;
            }
            .weui_textarea_counter {
              position: absolute;
              right: 4px;
              bottom: 6px;
              color: #B2B2B2;
            }
          }
        }
        .appraise_main {
          position: relative;
          background: #eee;
          .expression_tab {
            position: relative;
            width: 74vw;
            left: 3vw;
            top: 3vw;
            background-color: #fff;
            border-radius: 5px;
            padding-bottom: 3vw;
            >.appraise_score {
              display: flex;
              justify-content: space-around;
              padding: 10px 5px 0px 5px;
              >p.tab_text {
                vertical-align: middle;
                display: inline-block;
                width: 20%;
                text-align: left;
                padding-left: 6px;
              }
              >.expression_content {
                display: inline-block;
                width: 72%;
                vertical-align: middle;
                padding-top: 0;
                margin: 0;
                >.flex-container {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  height: 100%;
                  width: 100%;
                  >.expression_img {
                    width: 1.6rem;
                    height: 1.6rem;
                    vertical-align: middle;
                  }
                }
              }
            }
          }
          .btn-wrap {
            position: relative;
            top: 1.5vw;
            padding: 4vw 0;
            >.weui_btn.receive {
              position: relative;
              color: #fff;
              background-color: #ff8832;
              width: 68vw;
              font-size: 1rem;
              line-height: 2.3;
              border-radius: 3px;
              border: none;
            }
          }
        }
      }
    }
    .dialog-close {
      position: absolute;
      bottom: -20px;
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
