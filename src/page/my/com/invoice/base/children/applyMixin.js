import { invoiceApi } from '../../../../../../fetch/api.js'
let mixin = {
  methods: {
    // 电子发票申请
    async applyElec(type=1) {
      try {
        let receipt = {
          "payTimeStr": new Date(this.receipt.payTime.time).format('yyyy-MM-dd hh:mm:ss'),
          "orderNumber": this.receipt.orderNumber,
          "orderMoney": this.receipt.orderMoney,
          "receiptMoney": this.receipt.receiptMoney,
          "receiptTitleId": this.formData.id
        }
        let title = {
          type: type, //1：单位； 2：个人
          name: this.formData.name,
          dutyParagraph: this.formData.dutyParagraph,
          companyAddress: this.formData.companyAddress,
          mobileNo: this.formData.mobileNo,
          bankOfDeposit: this.formData.bankOfDeposit,
          bankNumber: this.formData.bankNumber,
          customerId: this.formData.customerId,
          state: this.formData.state
        }
        let params = {
          "receipt": receipt,
          "title": title
        }
        let res = await invoiceApi.TicketToMany(params)
        if (res.success == true) {
          this.$router.push({path: '/user/invoice/history'})        
        } else {
          throw new Error('申请发票失败')
        }
      } catch (e) {
        this.$kiko_message({
          isShow: true,
          message: e.message,
          time: 2000,
          type: 2
        })
      }
    },
    // 纸质发票申请
    async applyPaper() {
      try {
        let order = this.receipt;
        let params = {
          orderNumber: order.orderNumber,
          payTime: new Date(order.payTime.time).format('yyyy-MM-dd hh:mm:ss'),
          orderMoney: order.orderMoney,
          receiptMoney: order.receiptMoney,
          receiptTitleId: this.formData.id,
          shopId: this.shop.id,
          state: this.formData.state
        }
        let res = await invoiceApi.insertReceipt($.param(params))
        if (res.success == true) {
          this.$router.push({path: '/user/invoice/history'})
        } else {
          throw new Error('申请发票失败')
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
export default mixin