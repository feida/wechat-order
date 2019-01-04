<template>
  <!-- 带向右箭头，点入设置默认抬头 -->
  <div class="weui-cell weui-cell_access" @click="$emit('selectTitle', title)">
    <div class="weui-cell__bd">
      <p>{{title.name}}</p>
      <p class="weui-btn weui-btn_mini" :class="{'btn-person': title.type==2, 'btn-company': title.type == 1}">{{title.type | typeName}}</p>
      <p v-if="title.state==1" class="weui-btn weui-btn_mini" style="color: #000;">默认</p>
    </div>
    <div v-if="showArrow" class="weui-cell__ft"></div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: Object
    },
    showArrow: {
      type: Boolean,
      defalut: false
    }
  },
  filters: {
    typeName(type) {
      return type==1?'单位':'个人'
    }
  }
}
</script>

<style lang="less">
.btn-person {
  background-color: #ff7421;
  margin-top: 10px;
}
.btn-company{
  background-color: #0398ff;
  margin-top: 10px;
}    
</style>
