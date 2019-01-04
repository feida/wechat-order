<template>
  <div id="app">
    
    <transition name="router-fade" mode="out-in">
      <router-view 
        ></router-view>
    </transition>
    
  </div>
</template>

<script>
  import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'

  let _this = this;
  export default {
    name: 'app',
    data () {
      return {
        // setting:{},
      }
    },
    components: {

    },
    computed: {
      ...mapGetters([
        'loadFamily',
        'customer',
      ])
    },
    watch: {
      loadFamily: function(newVal, oldVal) {
        let that = this;
        if (newVal) {
          this.$kiko_loading({
            isShow: false
          });
        }
      },
    },

    created(){
      // this.$kiko_loading();

      // this.$kiko_loading({
      //   isShow: false
      // });

    },
    mounted(){
      
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
  #app {
    position: relative;
    height: 100%;
    #content-home {
      height: calc(100% - 76px);
    }
  }
  
</style>
