<template>
  <div class="userGroup container">
    <div class="top">
      <p class="title">用户权限</p>
    </div>
    <div class="bottom">
      <div class="content">
        <div class="flex">
          <el-button type="primary" @click="newGroup">+新增用户组</el-button>
          <el-button type="primary" @click="viewAllUser">所有用户</el-button>
        </div>
        <div>
          <table class="gtable">
            <tr class="gheader">
              <th>用户组名称</th>
              <th>用户数量</th>
              <th>创建时间</th>
              <th>有效期</th>
              <th>最近操作时间</th>
              <th>备注</th>
              <th>操作</th>
            </tr>
            <tr v-for="item in groupList">
              <td>{{item.groupName}}</td>
              <td>{{item.userCount}}</td>
              <td>{{new Date(item.createdTime).toLocaleString()}}</td>
              <td>
                <span v-if="item.permanent === '1'">永久</span>
                <span v-else>{{new Date(item.ineffectiveTime).toLocaleString()}}</span>
              </td>
              <td>{{new Date(item.updatedTime).toLocaleString()}}</td>
              <td>{{item.remark}}</td>
              <td>
                <div class="ctrl">
                  <span class="view" @click="editGroup(item)">编辑</span>
                  <span class="view" @click="viewGroup(item)">查看</span>
                  <span class="view" @click="deleteGroup(item)">删除</span>
                </div>

              </td>
            </tr>
          </table>
          <p v-if="groupList.length===0" style="font-size: 14px;color: #666;margin-top: 2rem;">暂无相关用户组</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'userGroup',
    computed:{
      ...mapGetters({
        groupList: 'getUserGroupList',
      })
    },
    methods:{
      newGroup: function () {
        this.$router.push({
          name: 'newGroup'
        })
      },
      editGroup: function (item) {
        this.$router.push({
          name: 'newGroup',
          query:{
            type: 'edit',
            groupId: item.groupId
          }
        })
      },
      viewGroup: function (item) {
        this.$router.push({
          name: 'groupDetail',
          query:{
            groupId: item.groupId
          }
        })
      },
      viewAllUser: function () {
        this.$router.push({
          name: 'allUser',
        })
      },
      _initData: function () {
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
        this.$api.user.userGroup.groupList({
          userId: userInfo.userId
        }).then((res)=>{
          if(res.status === 200){
            this.$store.dispatch('setUserGroupList',res.data)
          }
        })
      },
      deleteGroup: function (item) {
        this.$confirm('用户组'+item.groupName+'包含'+ item.userCount+'个用户，此操作将永久删除该用户组以及用户在该用户组的权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$api.user.userGroup.deleteGroup({
            groupId: item.groupId
          }).then((res)=>{
            if(res.status === 200){
              this.$message({
                type: 'success',
                duration: 1000,
                message: '删除成功!'
              });
              this._initData()
            }else{
              this.$message({
                type: 'error',
                duration: 1000,
                message: res.msg
              });
            }
          })
        })
      }
    },
    mounted(){
      this._initData()
    },
    watch:{
      '$route': function () {
        if(this.$route.name === 'userGroup'){
          this._initData()
        }
      }
    }
  }
</script>

<style lang="less">
  .userGroup{
    .bottom{
      padding: 0 1rem;
      .content{
        background: #fff;
        padding: 1rem;
      }
    }
  }
</style>
