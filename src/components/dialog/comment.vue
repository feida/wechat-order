<template lang="html">
  <div class="weui_dialog_confirm" v-if="show">
    <div class="weui-mask" @click="close"></div>
    <div class="weui_dialog_comment">
      <div class="full-height">
        <div class="weui-cell" style="padding: 15px;border-bottom: 1px solid #bdbdbd;">
          <div class="weui-cell_comment">
            <textarea class="weui-textarea" placeholder="亲,请留下您的评论吧!" style="background-color: #eee;" rows="4" maxlength="120" v-model="appraise"></textarea>
            <div class="weui-textarea-counter"><span>{{appraise.length}}</span>/{{remainWord}}</div>
          </div>
        </div>
        <div class="flex-container_comment">
          <span class="comment_btn" @click="close">取消</span>
          <span class="comment_btn" style="background-color: #d8433d;color:#fff;" @click="confirmComment(appraise,customer,comment)">确定</span>
        </div>
      </div>
     </div>
  </div>
</template>

<script>
  import { submitAppraise } from '../../fetch/api'

  export default {
    props: {
      show:{
        type: Boolean,
        default: false
      },
      appraiseBase:{
        type: Object,
        default: {}
      },
      customer:{
        type: Object,
        default: {}
      },
      comment:{
        type: Object,
        default: {}
      }
    },
    data () {
      return {
        appraise:'',
        remainWord:120,
      }
    },
    watch: {
      'appraise': function (newVal, oldVal) {
        if(newVal){
          this.remainWord = 120 - newVal.length;
        }
      }
    },
    created(){

    },
    methods:{
      close(){
        this.$emit("close-comment");
      },
      confirmComment(appraise,customer,comment){
        let that = this;
        appraise = this.appraiseBase;
        customer = this.customer;
        comment = this.comment;
        let pid = null;
        if(!this.appraise){
          this.$kiko_message({
            message: '请输入评论！',
            time: 3000,
            type:2
          });
          return false
        }
        if(comment != null ){
          pid = comment.customerId;
        }
        this.$kiko_message({
          message: '评论发送中……,请稍候！',
          type:3
        });
        let option = {
          content:this.appraise,
          appraiseId:appraise.id,
          customerId:customer.id,
          pid:pid
        };
        submitAppraise.submit($.param(option)).then((response) => {
          if(response.success){
            let res = {};
            res.nickName = customer.nickname;
            res.content = that.appraise;
            if(comment != null){
              res.pid = comment.customerId;
              res.replyName = comment.nickName;
            }else{
              res.pid = "";
            }
            appraise.appraiseComments.push(res);
            that.$kiko_message({
              message: '评论成功！',
              time: 3000,
              type:1
            });
            that.appraise = ''; //评论之后清空内容
            that.$emit("close-comment");
          }
        })
      }
    }
  }
</script>

<style scoped>
  .weui_dialog_comment {
    position: fixed;
    z-index: 1000;
    width: 80%;
    /*height: 15rem;*/
    top: 18%;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
    background: #fff;
    border-radius: 10px;
  }
  .weui-cell_comment {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    padding: 5px;
    background-color: #eeeeee;
  }
  .flex-container_comment {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-around;
    justify-content: space-around;
    width: 90%;
    margin: 0 5%;
    padding: 12px 0;
  }
  .comment_btn {
    font-size: 1.1rem;
    padding: 8px 30px;
    display: inline-block;
    border-radius: 3px;
    background-color: #d8d8d8;
    color: #666;
  }
</style>
