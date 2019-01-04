<template>
  <!-- 添加完title info页面 -->
  <!--单位-->
  <div style="height: 100%;" class="full-screen">
    <CellItemShow name="名称" value="test餐加"></CellItemShow>
    <CellItemShow name="税号" value="test餐加"></CellItemShow>
    <CellItemShow name="单位地址" value="test餐加"></CellItemShow>
    <CellItemShow name="开户银行" value="123312"></CellItemShow>
    <CellItemShow name="银行账户" value="1212221"></CellItemShow>
    
    <!-- <SetDefault></SetDefault>         -->

    <TitleQrCode value="test餐加"></TitleQrCode>
    
    <BottomButton name="返回" @clickBtn="goTitleList()"></BottomButton>    
  </div>
</template>

<script>
  import CellItemShow from '../com/cell/itemShow.vue'
  import BottomButton from '../../../../../components/dialog/wrap/bottom-button.vue'
  import SetDefault from '../com/setDefault.vue'
  import TitleQrCode from '../com/titleQrCode.vue'
  export default {
    components: {
      CellItemShow,
      BottomButton,
      TitleQrCode,
      SetDefault
    },
    methods: {
      goTitleList() {
        this.$router.push({path: '/user/invoice/titleList?type=0'})
      }
    }
  };
</script>

<style lang="less">
</style>
