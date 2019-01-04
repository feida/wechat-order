<template>
  <PlaceFirst v-if="show == 'first'"></PlaceFirst>
  <PlaceAfter v-else-if="show == 'after'"></PlaceAfter>
  <PayAfter v-else-if="show == 'afterpay'"></PayAfter>
</template>

<script>
import { mapGetters,mapActions,mapMutations } from 'vuex'
import PlaceFirst from './placeFirst.vue'
import PlaceAfter from './placeAfter.vue'
import PayAfter from './payAfter.vue'       //后付的‘立即支付’
export default {
  components: {
    PlaceFirst,
    PlaceAfter,
    PayAfter
  },
  data() {
    return {
      show: 'first',  // first:先付；after：后付； pay：后付的立即支付
      orderBossId: null,  // 后付‘立即支付’会传入
    }
  },
  computed: {
    ...mapGetters([
      'shop',
      'customer'
    ])
  },
  created() {
    if (!this.customer || !this.customer.accountId) {
      this.$router.push({path:'/'});
    }
    // orderBossId
    this.orderBossId = this.$route.query.orderBossId || null;
    
    //shopMode 2:电视叫号 3:验证码 6:boss模式 超级模式 先付 后付
    if (this.shop.shopMode == 2) {
      this.show = 'first'
    } else if (this.shop.shopMode == 3) {
      this.show = 'first'
    } else if (this.shop.shopMode == 6) {
      this.show = 'after'
      if (this.orderBossId) {
        this.show = 'afterpay'
      }
    }
  }
}
</script>

<style lang="less">
  .place-order-wrap {
    position: fixed;
    z-index: 1;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
    background: #fff;

    .weui-cell.header_table {
      position: relative;
      background-color: #e0e0e0;
      padding: 6px 15px;
      box-sizing: border-box;
      text-align: center;
    }
    .group-wrap {
      border-bottom: 1px solid #e7e7e7;
      .groupCartItem {
        &.total-price {
          border-top: 1px solid #e7e7e7;
        }
        .food-count {
          color: #7D8080;
        }
        .food-price {
          color: #7f7f7f;
        }
      }
    }
    .bottom-box {
      margin-bottom: 60px;
      a.js_item {
        height: 41px;
        box-sizing: border-box;
        &:active {
          background-color: #fff;
        }
      }
      a.events-none {
        pointer-events: none;
      }
      .weui-cell__bd {
        font-size: 1.1rem;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;

        select {
          padding-left: 0;
        }
        p.prefer {
          color: #7D8080;
        }
        span.table-number {
          color: #7D8080;
          margin-left: 15px;
        }
        p.remark-txt {
          margin-left: 15px;
          display: inline-block;
          width: 200px;
          text-align: left;
          color: #878989;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        p>span.balance {
          margin-left: 15px;
        }
        p>span.origin-price {
          margin-left: 15px;
          color: #7D8080;
          font-size: 0.9rem;
          text-decoration: line-through;
        }

        p.final-price {
          color: #C81623;
        }
        p.mode-type {
          color: green;
        }

        span.weui-badge {
          border-radius: 4px;
          margin-right: 4px;
          vertical-align: baseline;
          line-height: normal;
          background-color: #FFBF34;

        }
        .charge-btn-box {
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          align-items: center;
          .charge-btn {
            margin-top: 0px;
            padding: 0px 4px;
            border-radius: 3px;
            font-size: 14px;
            line-height: 1.9;
            &:nth-child(2) {
              margin-left: 5px;
            }
          }

          .colorFix {
            background: #DF5548;
            color: #fff;
          }
          // .weui-btn {
          //   font-size: 0.8rem;
          //   line-height:34px;
          //   margin-top: 0;
          //   &:nth-child(2) {
          //     margin-left: 6px;
          //   }
          // }
        }
      }

      .weui-switch-cp__input:checked~.weui-switch-cp__box, .weui-switch:checked {
        border-color: #000;
        background-color: #000;
      }

      > .weui-dialog__ft {
        position: fixed;
        bottom: 0;
        right: 0;
        .weui-dialog__btn {
          margin: 0.82em 15px;
          line-height:40px;
        }
      }
    }
    .weui-dialog__ft {
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;
      .weui-dialog__btn {
        margin: 10px 15px;
        line-height:40px;
      }
    }
  }
</style>

