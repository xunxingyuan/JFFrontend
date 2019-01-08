import http from './methods'

const base = '/api/userGroup'

export default {
  login:(data)=>{
    return http.postForm('/api/authentication/login',data)
  },
  logout: ()=>{
    return http.get('/api/authentication/logout')
  },
  register: (data)=>{
    return http.postForm('/api/authentication/register',data)
  },
  updateUser:(data)=>{
    return http.putMethod('/api/authentication/account',data)
  },
  userGroup:{
    //获取用户组
    groupList: (data)=>{
      return http.get(base,data)
    },
    //删除用户组
    deleteGroup: (data)=>{
      return http.deleteMethod(base,data)
    },
    //新增
    addGroup: (data)=>{
      return http.postForm(base,data)
    },
    //更新
    updateGroup: (data)=>{
      return http.putMethod(base,data)
    },
    //分配用户至用户组
    changeUserGroup: (data)=>{
      let url = base + '/assignUserGroupsToUsers'
      return http.postForm(url,data)
    },
    //获取子用户用户组
    getUserGroupMsg: (data)=>{
      let url = base + '/getSubUserGroup'
      return http.get(url,data)
    },
    //删除组中用户
    delGroupUser: (data)=>{
      let url = base + '/disassociate'
      return http.deleteMethod(url,data)
    },
    //给用户组分配权限
    updateGroupAuth: (data)=>{
      let url = base + '/setAuthorityToUserGroup'
      return http.postForm(url,data)
    },
    //获取用户组的子用户
    getGroupUserList:(data)=>{
      let url = base + '/user'
      return http.get(url,data)
    },
    //获取用户组权限
    getGroupAuth:(data)=>{
      let url = base + '/getGroupAuthority'
      return http.get(url,data)
    },
    //获取所有用户
    getALLUser: (data)=>{
      let url = '/api/subUser'
      return http.get(url,data)
    },
    //创建子用户
    createGroupUser: (data)=>{
      let url = '/api/subUser'
      return http.postForm(url,data)
    },
    //删除子用户
    delUser: (data)=>{
      let url = '/api/subUser'
      return http.deleteMethod(url,data)
    },
    //更新用户
    updateUser: (data)=>{
      let url = '/api/subUser'
      return http.putMethod(url,data)
    },
    //获取用户权限
    getUserAuth: (data)=>{
      let url = '/api/subUser/authority'
      return http.get(url,data)
    }
  },
  menu:{
    getAllMenu: (data)=>{
      let url = '/api/conversationCategory'
      return http.get(url,data)
    },
    getUserMenu: (data)=>{
      let url = '/api/conversationCategory/subUserCategoryTree'
      return http.get(url,data)
    }
  }
}