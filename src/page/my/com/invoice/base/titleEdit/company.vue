<template>
  <!--单位-->
  <div style="height: 100%;" class="full-screen">
    <!-- <CellItemShow name="名称" value="test餐加"></CellItemShow>
    <CellItemShow name="税号" value="test餐加"></CellItemShow>
    <CellItemShow name="单位地址" value="test餐加"></CellItemShow>
    <CellItemShow name="开户银行" value="123312"></CellItemShow>
    <CellItemShow name="银行账户" value="1212221"></CellItemShow> -->

    <CellItemEdit name="抬头名称" placeholder="单位名称(必填)" maxlength="25" :formData.sync="formData.name"></CellItemEdit>
    <CellItemEdit name="税号" placeholder="单位税号(必填)" maxlength="20" :formData.sync="formData.dutyParagraph"></CellItemEdit>
    <CellItemEdit name="单位地址" placeholder="单位地址"  :formData.sync="formData.companyAddress"></CellItemEdit>
    <CellItemEdit name="电话号码" placeholder="电话号码" maxlength="11" :formData.sync="formData.mobileNo"></CellItemEdit>
    <CellItemEdit name="开户银行" placeholder="开户银行名称" :formData.sync="formData.bankOfDeposit"></CellItemEdit>
    <CellItemEdit name="银行账户" placeholder="银行账户号码" maxlength="19" :formData.sync="formData.bankNumber"></CellItemEdit>
    
    <SetDefault v-model="isDefault"></SetDefault>        

    <TitleQrCode :value="formData.name"></TitleQrCode>
    
    <BottomButton name="编辑" @clickBtn="updateReceiptTitle"></BottomButton>    
  </div>
</template>

<script>
  import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
  import { invoiceApi } from '../../../../../../fetch/api.js'
  import CellItemShow from '../../com/cell/itemShow.vue'
  import CellItemEdit from '../../com/cell/itemEdit.vue'  
  import BottomButton from '../../../../../../components/dialog/wrap/bottom-button.vue'
  import SetDefault from '../../com/setDefault.vue'
  import TitleQrCode from '../../com/titleQrCode.vue'
  export default {
    components: {
      CellItemEdit,
      CellItemShow,
      BottomButton,
      TitleQrCode,
      SetDefault
    },
    computed: {
      ...mapGetters([
        'customer',
      ]),
    },
    data() {
      return {
        formData: {},
        isDefault: false,
      }
    },
    created() {
      this.title = this.$route.query.title
      this.formData = this.title; 
      this.isDefault = Boolean(this.formData.state)
    },
    methods: {
      // @Listener 
      async updateReceiptTitle() {
        try {
          this.formData.customerId = this.customer.id;
          if (this.formData.name == '' || this.formData.dutyParagraph == '') {
            throw new Error('请填写公司名称和税号')
          }
          delete this.formData.createTime
          delete this.formData.updateTime
          this.formData.state = Number(this.isDefault)
          await invoiceApi.updateReceiptTitle($.param(this.formData))
          // goto titleList
          this.$router.push({path:'/user/invoice/titleList', query:{type:0}})
        } catch(e) {
          this.$kiko_message({
            isShow: true,
            message: e.message,
            time: 2000,
            type: 2
          })
        }
      }
    }
  };
</script>

<style lang="less">
</style>
