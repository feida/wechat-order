<template>
  <div>    
    <CellItemEdit name="姓名" placeholder="姓名(必填)" :formData.sync="formData.name"></CellItemEdit>
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
        type: 2,  //个人
        name: ''
      }
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
        if (this.formData.name == '') {
          throw new Error('请填写姓名')
        }
        await invoiceApi.insertReceiptTitle($.param(this.formData))
        // goto 显示添加后的抬头页
        if (this.from === 'apply') {
          this.$router.push({path: '/user/invoice/titleApply/applyPerson', query: {title: this.formData}})
        } else {
          this.$router.push({path: '/user/invoice/infoPerson', query: {}})
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

<style>

</style>
