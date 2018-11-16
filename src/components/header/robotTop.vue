<template>
  <div class="robotTop">
    <section class="left flexCenter">
      <span>G1Brain</span>
    </section>
    <section class="mid scrollbar">
      <div class="robotItem flexCenter" v-for="robot in robotList" :class="{'active': choseRobot.robotId === robot.robotId }" @click="chose(robot)">
        <span :class="[robot.status==='2'?'open':'close']"></span>
        <p>{{robot.robotName}}</p>
      </div>
      <!--<div class="addRobot flex" @click="createRobot">-->
        <!--+ 添加机器人-->
      <!--</div>-->
    </section>
    <section class="right">
      <div class="change">
        <el-button size="small" type="success" @click="toManage">切换至控制台</el-button>
      </div>
      <div class="icon">
        <i class="icons_user_new"></i>
      </div>
      <div class="userInfo">
        <span>{{user}}</span>
        <i class="fas fa-sort-down"></i>
        <div class="hoverBox">
          <div class="hoverItem">个人信息</div>
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
          this.$router.push({
            path: '/console/robot/'+ data.robotId +'/robotService'
          })
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
      logout: function () {
        this.$api.user.logout().then((res)=>{
          if(res.msg === 'ok'){
            window.sessionStorage.removeItem('user')
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
        choseRobot: 'getSelectRobot'
      })
    },
    data(){
      return {
        user: ''
      }
    },
    mounted(){
      this.user = window.sessionStorage.getItem('user')
    }
  }
</script>

<style lang="less">
  @import "../../../src/styles/common";

</style>
