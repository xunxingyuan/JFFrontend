<template>
  <div class="robotTop">
    <section class="left flexCenter">
      <span>G1Brain</span>
    </section>
    <section class="mid scrollbar">
      <div class="robotItem flexCenter" v-for="robot in robotList" :class="{'active': choseRobotId === robot.robotId }" @click="chose(robot)">
        <span :class="[robot.status==='2'?'open':'close']"></span>
        <p>{{robot.robotName}}</p>
      </div>
      <!--<div class="addRobot flex" @click="createRobot">-->
        <!--+ 添加机器人-->
      <!--</div>-->
    </section>
    <section class="right">
      <div class="change" v-if="role==='admin'">
        <button class="changeManage" @click="toManage">切换至控制台</button>
        <!--<el-button size="small"  type="success" @click="toManage">切换至控制台</el-button>-->
      </div>
      <div class="icon">
        <i class="icons_user_new" v-if="!userIcon"></i>
        <img v-else  :src="userIcon"/>
      </div>
      <div class="userInfo">
        <span>{{user}}</span>
        <i class="fas fa-sort-down"></i>
        <div class="hoverBox">
          <div class="hoverItem" @click="viewInfo">个人信息</div>
          <div class="hoverItem" @click="logout">退出登录</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'robotTop',
    methods:{
      chose: function (data) {
        this.$store.dispatch('setSelectRobot',data)
        window.sessionStorage.setItem('robotId',data.robotId)
        if(data.hasOwnProperty('recordPath')){
          this.$router.push(data.recordPath)
        }else{
          let flag = ''
          this.userNav.forEach((e)=>{
            if(e.url){
              flag = flag ? flag : e.url
            }else{
              e.child.forEach((ele)=>{
                if(ele.url){
                  flag = flag ? flag : ele.url
                }
              })
            }
          })
          if(flag){
            this.$router.push({
              path: '/console/robot/'+ data.robotId +'/' + flag
            })
          }else{
            this.$message({
              message: '当前用户无任何权限！',
              type: 'info',
              duration: 1000
            });
            this.$router.go(-1)
          }

//          this.$router.push({
//            path: '/console/robot/'+ data.robotId +'/scene'
//          })
        }
      },
      createRobot: function () {
        this.$emit('createRobot')
      },
      toManage: function () {
        this.$router.push({
          name: 'robotManage'
        })
      },
      viewInfo: function () {
        this.$router.push({
          name: 'robotUserInfo'
        })
      },
      logout: function () {
        this.$api.user.logout().then((res)=>{
          if(res.msg === 'ok'){
            window.sessionStorage.removeItem('user')
            window.sessionStorage.removeItem('robotId')
            window.sessionStorage.removeItem('userEdit')
            window.sessionStorage.removeItem('userId')
            window.sessionStorage.removeItem('userInfo')
            window.sessionStorage.removeItem('userRole')
            this.$router.push({
              name: 'login'
            })
          }else{
            this.$message({
              message: res.msg,
              type: 'error',
              duration: 1000
            });
          }
        })
      }
    },
    computed:{
      ...mapGetters({
        robotList: 'getRobotList',
        userIcon: 'getUserIcon',
        userNav: 'getUserMenu'
      })
    },
    data(){
      return {
        user: '',
        choseRobotId: '',
        role: 'admin'
      }
    },
    mounted(){
      this.user = window.sessionStorage.getItem('user')
      this.choseRobotId = window.sessionStorage.getItem('robotId')
      this.role = window.sessionStorage.getItem('userRole')
    },
    watch:{
      '$route': function () {
        this.choseRobotId = window.sessionStorage.getItem('robotId')
      }
    }
  }
</script>

<style lang="less">
  @import "../../../src/styles/common";
  .robotTop{
    .changeManage{
      height: 32px;
      font-size: 12px;
      padding: 0 1rem;
      border-radius: 3px;
      outline: none;
      background: #24589B;
      border: none;
      color: #fff;
      cursor: pointer;
    }
    .right{
      margin-left: 2rem;
    }
  }
</style>
