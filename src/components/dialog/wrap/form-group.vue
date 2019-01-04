<template>
  <div class="form-group">
    <p>
      <span class="comments" :class="[customClass]">{{title}}</span>
    </p>
    <slot name="content"><!--弹出层具体内容--></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    customClass: {
      type: String,
      default: 'bad'
    }
  }
}
</script>

<style lang="less">
.form-group {
  text-align: center;
  >p {
    color: #6e6e6e;
    position: relative;
    &::before {
      content: "";
      display: block;
      border-top: 1px solid #a4a7b1;
      position: absolute;
      top: 50%;
      width: 100%;
      z-index: -1;
    }
    >span {
      background-color: #fff;
      padding: 0px 10px;
      &.bad {
        color: #565656;
        // border: 1px solid #565656;
      }
      &.good {
        color: #C81624;
        // border: 1px solid #C81624;
      }
    }
  }
}
</style>
