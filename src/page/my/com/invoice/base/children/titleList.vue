<template>
  <div class="invoice-titleList full-height" style="background-color: #f8f8f8;">
    <div v-iscroll class="scroll-wrap">
      <div>
        <ItemTitle v-for="item in titleList" :key="item.id" :title="item" :showArrow="true" @selectTitle="selectTitle"></ItemTitle>
      </div>
    </div>

    <TitleEmpty v-if="titleList.length==0"></TitleEmpty>
    <BottomButton @clickBtn="addTitle">
      <img slot="content" class="addImg" src="../../../../../../assets/img/add.png">      
    </BottomButton>
  </div>
  
</template>

<script>
  import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
  import { invoiceApi } from '../../../../../../fetch/api.js'
  import * as TYPE from '../../../../../../store/actionType/orderType.js'
  import ItemTitle from '../../com/cell/itemTitle.vue'
  import BottomButton from '../../../../../../components/dialog/wrap/bottom-button.vue'
  import TitleEmpty from './titleEmpty.vue'
  export default {
    components: {
      ItemTitle,
      BottomButton,
      TitleEmpty
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

      let defaultTitle = this.titleList.filter(item => item.state == 1).pop() || this.titleList[0] || {}
      this.$store.commit(TYPE.SET_DEFAULT_TITLE, defaultTitle)
    },
    methods: {
      // @Listener
      addTitle() {
        try {
          if (this.titleList.length >= 5) {
            throw new Error('最多可设置5条抬头')
          }
          this.$router.push({path: '/user/invoice/titleAdd/addCompany', query: {}})
        } catch(e) {
          this.$kiko_message({
            isShow: true,
            message: e.message,
            time: 2000,
            type: 2
          })
        }
      },
      // @Listener
      // setDefault(id) {
      //   // this.$router.push({path: '/user/invoice/titleEdit/company', query: {}})
      //   this.$router.push({path: '/user/invoice/titleEdit/person', query: {}})
      // },
      // @Listener
      selectTitle(title) {
        if (title.type == 1) {
          this.$router.push({path: '/user/invoice/titleEdit/company', query: {title}})
        } else if (title.type == 2) {
          this.$router.push({path: '/user/invoice/titleEdit/person', query: {title}})
        }
      }
    }
  }
</script>

<style lang="less">
.invoice-titleList {
  .scroll-wrap {
    height: calc(100% - 50px);
    overflow: hidden;
  }
  // .add-btn {
  //   position: fixed;
  //   bottom: 0;
  //   margin: 5%;
  //   padding: initial;
  //   width: 90%;
  //   box-sizing: border-box;
  //   background-color: #000;
  //   >.addImg {
  //     width: 1.4rem;
  //     height: 1.4rem;
  //     vertical-align: middle;
  //   }    
  // }
}
</style>
