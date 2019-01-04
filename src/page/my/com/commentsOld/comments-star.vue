<template>
  <FormGroup :title="title" :customClass="customClass" :class="['form-group-transition']">
    <template slot="content">
      <!-- <div class="appraise-level"> 
        <span v-for="n in 5" @click="selectLevel(n)" :class="{'bad':txtKey>0 && txtKey<=4 && n<=txtKey, 'good':txtKey===5}"><i class="iconfont icon-star-full"></i></span>      
      </div> -->
      <Star :currentSelect="currentSelect" @selectLevel="selectLevel"></Star>
    </template>
  </FormGroup>
</template>

<script>
  import FormGroup from "../../../../components/dialog/wrap/form-group.vue"
  import Star from '../../../../components/star/star.vue'
  
  export default {
    props: {
      title: {
        type: String,
        default: '满意度'
      },
      customClass: {
        type: String,
        default: 'bad'
      },
      currentSelect: {
        type: Number,
        default: 0
      }
    },
    components: {
      FormGroup,
      Star
    },
    data() {
      return {
        // txtKey: 0,
      }
    },
    created() {
      // this.txtKey = this.currentSelect;
    },
    methods: {
      selectLevel(index) {
        // this.txtKey = index;
        this.$emit('selectLevel', index);
      }
    }
  };
</script>

<style lang="less">
.comments-old {
  // .form-group {
  //   text-align: center;
  //   >p {
  //     color: #6e6e6e;
  //     position: relative;
  //     &::before {
  //       content: "";
  //       display: block;
  //       border-top: 1px solid #a4a7b1;
  //       position: absolute;
  //       top: 50%;
  //       width: 100%;
  //       z-index: -1;
  //     }
  //     >span {
  //       background-color: #fff;
  //       padding: 0px 10px;
  //     }
  //   }
  // }

  // .appraise-level {
  //   font-size: 35px;
  //   margin-bottom: -10px;
  //   > span {
  //     // width: 40px;
  //       color: #f2f2f2;
  //     > i {
  //       font-size: 35px;
  //     }
  //     &.bad {
  //       color: #565656;
  //     }
  //     &.good {
  //       color: #C81624;
  //     }
  //   }
  // }
}
</style>
