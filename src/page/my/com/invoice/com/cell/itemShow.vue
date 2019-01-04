<template>
  <div class="weui_type">
    <div class="weui-cell__hd"><label class="weui-label">{{name}}</label></div>
    <div class="weui-cell__bd">{{value}}</div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String
    },
    value: {
      type: String|Number
    }
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
  font-size: 0.9rem;
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
  &::nth-child(1)::before {
    border: none;
  }
}
</style>
