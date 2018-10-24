import Vue from 'vue'
import Vuex from 'vuex'
import robot from './modules/robot'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    robot
  }
})

export default store