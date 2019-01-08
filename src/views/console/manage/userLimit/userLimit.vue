<template>
  <div class="userLimit container">
    <div class="top">
      <p class="title">用户权限</p>
    </div>
    <div class="bottom">
      <div class="content">
        <div class="innerLeft">
          <div class="innerTitle flexCenter">
            <span>用户组</span>
            <div class="ctrl">
              <i class="iconfont icon-tianjia" @click="addGroup"></i>
              <i class="iconfont icon-bianji"></i>
              <i class="iconfont icon-fangdajing"></i>
              <i class="iconfont icon-shanchu"></i>
            </div>
          </div>
          <div class="innerContent">

          </div>
        </div>
        <div class="innerRight scrollbar">
          <div class="rightTop">
            <el-button type="primary" size="small">+ 新建用户</el-button>
            <!--<el-button size="small">通用设置</el-button>-->
          </div>
          <div class="rightBottom">
            <div class="rightContent">
              <table class="gtable">
                <tr class="gheader">
                  <th>用户名</th>
                  <th>账号状态</th>
                  <th>有效期</th>
                  <th>最近操作时间</th>
                  <th>操作</th>
                </tr>
                <tr v-for="item in 5">
                  <td>admin</td>
                  <td>有效</td>
                  <td>2018年12月31日</td>
                  <td>2018年11月16日</td>
                  <td>
                    <span class="edit">编辑</span>
                    <span class="del">删除</span>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <user-group :show="showGroup" @closeBox="showGroup = false" :groupData="choseGroup" :menuData="menu" :categoryData="limitTree" :permission="permissonData" @editSuccess="getGroupList()"></user-group>
  </div>
</template>

<script>
  import UserGroup from "./userGroup/userGroup.vue";

  export default {
    components: {UserGroup},
    name: 'userLimit',
    data(){
      return {
        showGroup: false,
        choseGroup: '',
        menu: '',
        permissonData: '',
        limitTree:[]
      }
    },
    methods:{
      //增加用户组
      addGroup: function () {
        this.showGroup = true
        this.menu = JSON.parse(window.sessionStorage.getItem('menu'))

        this.permissonData = ''
        this.choseGroup = {
          groupId: '',
          groupName: '',
          note: '',
          validEndDate: '',
          validStartDate: '',
          effectType: 0,
          effectTime:[],
          edit: false
        }
      },

    },

  }
</script>

<style lang="less">
  .userLimit{
    .bottom{
      .content{
        padding-bottom: 1rem;
        display: flex;
      }
    }
  }
</style>
