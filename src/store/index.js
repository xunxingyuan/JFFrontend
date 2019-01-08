import Vue from 'vue'
import Vuex from 'vuex'
import robot from './modules/robot'
import sceneEdit from './modules/sceneEdit'
import ontology from './modules/ontology'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    robot,
    sceneEdit,
    ontology,
    user
  }
})

export default store