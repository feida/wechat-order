<template>
  <!--个人-->
  <div style="height: 100%;" class="full-screen">
    <CellItemEdit name="姓名" placeholder="单位名称(必填)" maxlength="25" :formData.sync="formData.name"></CellItemEdit>

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
          if (this.formData.name == '' ) {
            throw new Error('请填写姓名')
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
