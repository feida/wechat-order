/**
 * Created by Administrator on 2018/9/11.
 */

import Vue from 'vue'
import Ali from './aliPay.vue'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#ali',
  template: '<Ali/>',
  components: { Ali },
  // render: h => h(Ali)
})
