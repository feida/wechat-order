<template>
  <div class="weui_type">
    <div class="weui-cell__hd"><label class="weui-label">{{name}}</label></div>
    <div class="weui-cell__bd">
        <input class="weui-input" type="text" v-model="val" :placeholder="placeholder" :maxlength="maxlength" >
    </div>
    <span v-if="chooseTitle==true" class="chooseTitle" @click.stop="$emit('chooseTitle')">请选择抬头</span>
  </div>
</template>

<script>
export default {
  props: {
    chooseTitle: {
      type: Boolean,
      defalut: false
    },
    name: {
      type: String
    },
    placeholder: {
      type: String
    },
    maxlength: {
      type: Number|String
    },
    formData: {
      type: Number|String
    }
  },
  data() {
    return {
      val: ''
    }
  },
  watch: {
    "val": function(val) {
      if (val) {
        this.$emit('update:formData', this.val)
      }
    }
  },
  created() {
    this.val = this.formData
  },
  methods: {
  }
}
</script>

<style lang="less">
.weui_type {
  padding: 10px 15px;
  position: relative;
  display: flex;
  align-items: center;
  background-color: #fff;
  font-size: 1rem;
  &::before {
    border-top: 1px solid #dfdfdf;
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 15px;
    height: 1px;
    color: #D9D9D9;
    transform-origin: 0 0;
    transform: scaleY(0.5);
    left: 15px;
  }
  &:nth-child(1)::before {
    border: none;
  }
  span.chooseTitle {
    position: absolute;
    right: 14px;
    color: #1AAD19;
  }
}
</style>
