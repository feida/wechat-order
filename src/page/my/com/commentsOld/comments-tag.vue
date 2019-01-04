<template>
  <div v-iscroll class="scroll" id="scrollComment">
    <ul class="appraise-content">
      <li v-for="item,index in checkList" @click="select(index, item)">
        <span class="appraise-name" :class="[customClass, item.click===true?'active':'']">{{item.title || item.articleName}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    customClass: {
      type: String,
      default: 'bad'
    },
    list: {
      type: Array
    }
  },
  created() {
    this.checkList = this.list;
  },  
  data() {
    return {
      checkList: []   // 判断勾选状态
    }
  },
  methods: {
    select(index, item) {
      this.checkList[index].click = !this.checkList[index].click;
      this.checkList = [...this.checkList];
      this.$emit('selectOne', this.checkList);
    }
  }
}
</script>

<style lang="less">
.scroll {
  position: relative;
  max-height: 62px;
  overflow: hidden;
  text-align: left;
  margin-top: 3px;
  // border-bottom: 1px dashed #C5C4C4;
  padding-bottom: 5px;
  >.appraise-content {
    list-style: none;
    display: flex;
    justify-content: flex-start;
    width: 100%;
    flex-wrap: wrap;
    box-sizing: border-box;
    > li {
          width: 33.3333%;
        }
        .appraise-name {
          display: block;
          padding: 0px 5px;
          // margin: 1%;
          margin: 0.4rem 0.4rem;
          border-radius: 5px;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 12px;
          box-sizing: border-box;
          &.bad {
            color: #565656;
            border: 1px solid #565656;
            &.active {
              background: #565656;
              color: #fff;
            }
          }
          &.good {
            color: #C81624;
            border: 1px solid #C81624;
            &.active{
              background: #C81624;
              color: #fff;
            }
          }
        }
  }
}
</style>
