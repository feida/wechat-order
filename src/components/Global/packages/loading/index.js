import Vue from 'vue'
import Loading from './src/main.vue'

Loading.installLoading = function(options) {
  let loading = Vue.extend(Loading);
  let component = new loading({
    data: options
  }).$mount();
  if (options === undefined || options === null) {
    document.querySelector('body').appendChild(component.$el)
  }else{
    var node = document.querySelector('.weui_loading_toast')
    if (node && node.parentNode) {
      node.parentNode.removeChild(node)
    }
  }
}

export default Loading
