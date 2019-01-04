<template>
  <div class="weui-cell weui-cell_switch">
    <div class="weui-cell__bd">设为默认</div>
    <div class="weui-cell__ft">
        <label for="switchCP" class="weui-switch-cp">
            <input id="switchCP" class="weui-switch-cp__input" 
              type="checkbox" 
              :checked="checked"
              v-on:change="$emit('change', $event.target.checked)"
            >
            <div class="weui-switch-cp__box"></div>
        </label>
    </div>
  </div>
</template>

<script>
// 这个组件可以使用v-model指令
export default {
  props: {
    checked: Boolean
  },
  model: {
    prop: 'checked',
    event: 'change'
  },
}
</script>

<style>

</style>
