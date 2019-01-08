const robot = {
  state:{
    userIcon: '',
    userGroupList: [],
    userAuth: {
      admin: true
    },
    userMenu:[]
  },
  getters:{
    getUserIcon: (state)=> state.userIcon,
    getUserGroupList: (state) => state.userGroupList,
    getUserAuth: (state) => state.userAuth,
    getUserMenu: (state) => state.userMenu,
  },
  actions:{
    setUserIcon: ({commit},data)=>{
      commit('setUserIcon',data)
    },
    setUserGroupList: ({commit},data)=>{
      commit('setUserGroupList',data)
    },
    setUserAuth: ({commit},data)=>{
      commit('setUserAuth',data)
    },
    setUserMenu: ({commit},data)=>{
      commit('setUserMenu',data)
    },
  },
  mutations:{
    setUserIcon: (state,data)=>{
      state.userIcon = data
    },
    setUserGroupList: (state,data)=>{
      state.userGroupList = data
    },
    setUserAuth: (state,data)=>{
      state.userAuth = data
    },
    setUserMenu: (state,data)=>{
      state.userMenu = data
    },
  }
}

export default robot