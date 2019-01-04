<template>
  <!-- 公司抬头列表页面 -->
  <div class="full-screen" style="background-color: #f8f8f8;">
    <ItemTitle v-if="item.type==1" v-for="item in titleList" :key="item.id" :title="item" @selectTitle="selectTitle"></ItemTitle>
    <ListEmpty v-if="titleList.length == 0" tips="暂未有任何单位发票抬头"></ListEmpty>
    <BottomButton name="添加抬头" @clickBtn="addTitle()"></BottomButton>    
  </div>
</template>

<script>
  import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
  import { invoiceApi } from '../../../../../fetch/api.js'
  import ItemTitle from '../com/cell/itemTitle.vue'
  import BottomButton from '../../../../../components/dialog/wrap/bottom-button.vue'
  import ListEmpty from './listEmpty.vue'
  export default {
    components: {
      ItemTitle,
      BottomButton,
      ListEmpty
    },
    computed: {
      ...mapGetters([
        'customer',
      ]),
    },
    data() {
      return {
        titleList:[]  //抬头列表
      }
    },
    async created() {
      let ret = await invoiceApi.receiptTitleList($.param({customer_id: this.customer.id})) || []
      this.titleList = ret.data || []
      this.titleList = this.titleList.filter(item => item.type == 1) 
    },
    methods: {
      // @Listener
      selectTitle(title) {
        this.$router.push({path: '/user/invoice/titleApply/applyCompany', query: {title}})
      },
      // @Listener
      addTitle() {
        this.$router.push({path: '/user/invoice/titleAdd/addCompany', query: {from: 'apply'}})
      }
    }
  }
</script>

<style lang="less">
  .successInfo {
    position: relative;
    top: 35%;
    text-align: center;
    color: #848484;
  }
</style>
