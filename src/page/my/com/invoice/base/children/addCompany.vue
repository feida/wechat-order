<template>
  <div class="invoice-addCompany">
    <CellItemEdit name="抬头名称" placeholder="单位名称(必填)" maxlength="25" :formData.sync="formData.name"></CellItemEdit>
    <CellItemEdit name="税号" placeholder="单位税号(必填)" maxlength="20" :formData.sync="formData.dutyParagraph"></CellItemEdit>
    <CellItemEdit name="单位地址" placeholder="单位地址"  :formData.sync="formData.companyAddress"></CellItemEdit>
    <CellItemEdit name="电话号码" placeholder="电话号码" maxlength="11" :formData.sync="formData.mobileNo"></CellItemEdit>
    <CellItemEdit name="开户银行" placeholder="开户银行名称" :formData.sync="formData.bankOfDeposit"></CellItemEdit>
    <CellItemEdit name="银行账户" placeholder="银行账户号码" maxlength="19" :formData.sync="formData.bankNumber"></CellItemEdit>

    <BottomButton name="保存" @clickBtn="insertReceiptTitle"></BottomButton>
  </div>
</template>

<script>
  import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
  import { invoiceApi } from '../../../../../../fetch/api.js'
  import CellItemEdit from '../../com/cell/itemEdit.vue'
  import BottomButton from '../../../../../../components/dialog/wrap/bottom-button.vue'
  export default {
    components: {
      CellItemEdit,
      BottomButton
    },
    computed: {
      ...mapGetters([
        'customer',
      ]),
    },
    data() {
      return {
        formData: {
          state: 0,
          customerId: '',
          type: 1,
          name: '',
          dutyParagraph: '',
          companyAddress: '',
          mobileNo: '',
          bankOfDeposit: '',
          bankNumber: ''
        },
        from: ''// 'apply'则跳回到申请页
      }
    },
    created() {
      this.from = this.$route.query.from || ''
    },
    methods: {
      // @Listener 添加抬头
      async insertReceiptTitle() {
        try {
          this.formData.customerId = this.customer.id;
          if (this.formData.name == '' || this.formData.dutyParagraph == '') {
            throw new Error('请填写公司名称和税号')
          }
          await invoiceApi.insertReceiptTitle($.param(this.formData))
          // goto 显示添加后的抬头页
          if (this.from === 'apply') {
            this.$router.push({path: '/user/invoice/titleApply/applyCompany', query: {title: this.formData}})
          } else {
            this.$router.push({path: '/user/invoice/infoCompany', query: {}})
          }
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
  }
</script>

<style lang="less">

</style>
