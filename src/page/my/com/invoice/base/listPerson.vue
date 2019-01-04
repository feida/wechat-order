<template>
  <!-- 个人抬头列表页面 -->
  <div class="full-screen" style="background-color: #f8f8f8;">
    <ItemTitle v-if="item.type==2" v-for="item in titleList" :key="item.id" :title="item" @selectTitle="selectTitle"></ItemTitle>
    <ListEmpty v-if="titleList.length == 0" tips="暂未有任何个人发票抬头"></ListEmpty>
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
      ListEmpty,
      BottomButton
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
      this.titleList = this.titleList.filter(item => item.type == 2)
    },
    methods: {
      // @Listener 
      selectTitle(title) {
        this.$router.push({path: '/user/invoice/titleApply/applyPerson', query: {title}})
      },
      // @Listener
      addTitle() {
        this.$router.push({path: '/user/invoice/titleAdd/addPerson', query: {from: 'apply'}})
      }
    }
  }
</script>

<style>

</style>
