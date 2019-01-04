<template>
  <div v-if="redDialogShow">    
    <redPackage 
      txt="完成评论即可领取"
      @close-redpackage="$emit('update:showComments', false)" 
      @open="redDialogShow=false"></redPackage>   <!--评论红包封面-->
  </div>
  <div v-else>
    <CommentsOld v-if="brandSetting.data.appraiseEdition == 0" :orderId="orderId" :show.sync="show" @close-comments="$emit('update:showComments', false)"></CommentsOld>
    <CommentsNew v-else :orderId="orderId"  @add-praise="addApraise" @close-comments="$emit('update:showComments', false)"></CommentsNew>
  </div>
</template>

<script>
  import CommentsNew from './commentsNew/comments.vue';
  import CommentsOld from './commentsOld/comments.vue';
  import redPackage from '../../../components/dialog/redpackage.vue'   //红包
  import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
  export default {
    props: {
      orderId: {
        type: String,
        required: true
      },
      showComments: {
        type: Boolean
      }
    },
    components: {
      CommentsNew,
      CommentsOld,
      redPackage
    },
    computed: {
      ...mapGetters([
        'brandSetting'
      ])
    },
    data() {
      return {
        redDialogShow: true,
        show: 0,          // 
      }
    },
    methods: {
      addApraise(res) {
        // this.$emit('add-praise', res);
      },
      // @listener
      // open() {
      //   this.redDialogShow=false
      // }
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
