import Vue from 'vue'
import Vuex from 'vuex'
import vuexAlong from 'vuex-along'
import shopCartStore from './modules/shopCartStore'
import customerStore from './modules/customerStore'
import orderStore from './modules/orderStore'

Vue.use(Vuex)

vuexAlong.onlySession (true)    // store只落地到sessionStorage

const state = {
	requesting: false,
	error: {},
  chargeDialog: false
};

const getters = {
  requesting(state) {
    return state.requesting;
  },
  chargeDialog(state) {
    return state.chargeDialog;
  },
  error(state) {
    return state.error;
  }
};

const mutations = {
  SetRequesting(state, flag) {
    state.requesting = flag;
  },
  setCharge(state, flag){
    state.chargeDialog = flag;
  }
}

export default new Vuex.Store({
	state,
  getters,
  mutations,
	modules: {
    shopCartStore,
    customerStore,
    orderStore
  },
  plugins: [vuexAlong]
})
