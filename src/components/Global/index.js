import KikoMessage from './packages/message/index.js'
import KikoConfirm from './packages/confirm/index.js'
import KikoLoading from './packages/loading/index.js'

const install = function(Vue) {
  Vue.component(KikoMessage.name, KikoMessage)
  Vue.component(KikoConfirm.name, KikoConfirm)
  Vue.component(KikoLoading.name, KikoLoading)

  Vue.prototype.$kiko_message = KikoMessage.installMessage
  Vue.prototype.$kiko_loading = KikoLoading.installLoading
  Vue.prototype.$Kiko_confirm = KikoConfirm.installConfirm
}
export default install
