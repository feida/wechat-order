<template>
  <div class="flex-container">
    <img v-if="currentScore==20" @click="setScore(20)" class="expression_img" :score="20" src="../../../../assets/img/jicha_seltted.png">
    <img v-else @click="setScore(20)" class="expression_img" :score="20" src="../../../../assets/img/jicha_normal.png">
    <img v-if="currentScore==40" @click="setScore(40)" class="expression_img" :score="40" src="../../../../assets/img/buman_seltted.png">
    <img v-else @click="setScore(40)" class="expression_img" :score="40" src="../../../../assets/img/buman_normal.png">
    <img v-if="currentScore==60" @click="setScore(60)" class="expression_img" :score="60" src="../../../../assets/img/yiban_seltted.png">
    <img v-else @click="setScore(60)" class="expression_img" :score="60" src="../../../../assets/img/yiban_normal.png">
    <img v-if="currentScore==80" @click="setScore(80)" class="expression_img" :score="80" src="../../../../assets/img/manyi_seltted.png">
    <img v-else @click="setScore(80)" class="expression_img" :score="80" src="../../../../assets/img/manyi_normal.png">
    <img v-if="currentScore==100" @click="setScore(100)" class="expression_img" :score="100" src="../../../../assets/img/chaozan_seltted.png">
    <img v-else @click="setScore(100)" class="expression_img" :score="100" src="../../../../assets/img/chaozan_normal.png">
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: Number
    }
  },
  data() {
    return {
      currentScore: null
    }
  },
  methods: {
    setScore(score) {
      this.currentScore = score;
      this.$emit('set-score', this.type, score)
    }
  }
}
</script>

<style>

</style>
