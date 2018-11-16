const robot = {
  state:{
    robotList: [],
    selectRobot: '',
    robotNav:[]
  },
  getters:{
    getRobotList: (state)=> state.robotList,
    getSelectRobot: (state)=> state.selectRobot,
    getRobotNav: (state) => state.robotNav

  },
  actions:{
    setRobotList: ({commit},data)=>{
      commit('setRobotList',data)
    },
    setSelectRobot:({commit},data)=>{
      commit('setSelectRobot',data)
    },
  },
  mutations:{
    setRobotList: (state,data)=>{
      state.robotList = data
    },
    setSelectRobot: (state,data)=>{
      state.selectRobot = data
    }
  }
}

export default robot