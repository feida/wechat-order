<template>
  <div>
    <a class="weui-cell weui-cell_access js_item" href="javascript:;" style="border-top: 1px solid #e7e7e7;" @click="openRecharge">
      <div class="weui-cell__bd">
        <p>充值赠送</p>
        <p class="charge-btn-box">
          <a v-for="(item,key) in chargeList" v-if="key <= 1" href="javascript:;" class="weui_btn weui_btn_mini charge-btn colorFix" >{{item.labelText}}</a>
        </p>
      </div>
      <div class="weui-cell__ft"></div>
    </a>
  </div>
</template>

<script>
  import { mapGetters,mapActions,mapMutations } from 'vuex'

  export default {
    props: {
      chargeList: {
        type: Array,
      }
    },
    data() {
      return {

      }
    },
    computed: {
      ...mapGetters([
        'chargeDialog',
      ])
    },
    mounted() {

    },
    methods: {
      openRecharge(){
        this.$store.commit('setCharge', true);
      }
    }
  }
</script>

<style scoped lang="less">
  a.js_item {
    height: 41px;
    box-sizing: border-box;
    &:active {
       background-color: #fff;
     }
    .weui-cell__bd {
      font-size: 1.1rem;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
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
  }
  }
</style>
