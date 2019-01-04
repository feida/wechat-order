<template>
  <button type="button" class="weui-btn weui-btn_primary add-btn" @click="onClick">
    {{name}}
    <slot name="content"></slot>
  </button>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  methods: {
    // @listener
    onClick() {
      this.$emit('clickBtn')
    }
  }
}
</script>

<style lang="less">
  button.add-btn {
    position: fixed;
    bottom: 0;
    margin: 5%;
    padding: initial;
    width: 90%;
    box-sizing: border-box;
    background-color: #000;
    &:focus {
      background-color: #000;
    }
    &:active {
      background-color: #000 !important;
    }
    
    >.addImg {
      width: 1.4rem;
      height: 1.4rem;
      vertical-align: middle;
    }    
  }
</style>
