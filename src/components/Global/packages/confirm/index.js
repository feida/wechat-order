import Vue from 'vue'
import Confirm from './src/main.vue'

Confirm.installConfirm = function(options) {
  let confirm = Vue.extend(Confirm);
  let component = new confirm({
    data: options
  }).$mount();
  if (options === undefined || options === null) {
    document.querySelector('body').appendChild(component.$el)
  }else{
    var node = document.querySelector('.weui_confirm_toast')
    if (node && node.parentNode) {
      node.parentNode.removeChild(node)
    }
  }
}

export default Confirm

