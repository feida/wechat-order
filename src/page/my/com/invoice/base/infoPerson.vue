<template>
  <!-- 添加完title info页面 -->
  <!--单位-->
  <div style="height: 100%;" class="full-screen">
    <CellItemShow name="姓名" value="张三"></CellItemShow>
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
