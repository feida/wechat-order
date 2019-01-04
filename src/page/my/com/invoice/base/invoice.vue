<template>
  <div id="invoice">
  	<div class="top-fixed" >
      <router-link :to="{ path: '/user/invoice/'+f.routerName }" v-for="(f,index) in routerList" class="flex-item" :key="index">
        <i></i>
        <span>{{f.name}}</span>
      </router-link>
    </div>
    <div class="content-home">
      <transition name="router-fade" mode="out-in">
        <router-view 
          :invoiceType="invoiceType"
        ></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
  import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
  export default {
    name: 'invoice',
    data () {
      return {
        invoiceType: 0, // 0:电子发票；1：纸质发票
        routerList:[
          {
            name:"发票抬头",
            routerName:'titleList'
          },
          {
            name:"申请发票",
            routerName:'apply'
          },
          {
            name:"历史纪录",
            routerName:'history'
          }
        ]
      }
    },
    computed: {
      ...mapGetters([
      ])
    },
    
    created(){
      this.invoiceType = this.$route.query.type || this.invoiceType;
    },
    methods:{ 
    }
  }
</script>

<style scoped lang="less">
	.router-fade-enter-active, .router-fade-leave-active {
    transition: 0s;
  }
  .router-fade-enter, .router-fade-leave-active {
    opacity: 0;
  }
  #invoice {
    position: fixed;
    z-index: 10;
    width: 100%;
    height: 100%;
    background-color: #fff;
    .content-home {
      height: calc(100% - 76px);
    }
  }
  .top-fixed {
    display: flex;
    padding: 12px 0px;
    align-items: center;
    border-bottom: 1px solid #dfdfdf;
    >a {
      flex: 1;
      text-align: center;
      font-size: 1rem;
      color: #B1AEAE;
      &:nth-child(2) {
        border-left: 1px solid #b1aeae;
        border-right: 1px solid #b1aeae;
      }
      &.active {
        color: #000;
      }
    }
  }
</style>
