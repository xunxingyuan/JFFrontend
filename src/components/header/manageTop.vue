<template>
  <div class="robotTop manageTopNav">
    <section class="left flexCenter">
      <span>G1Brain</span>
    </section>

    <section class="right">
      <div class="change">
        <el-button size="small" type="primary" @click="toRobot">切换至机器人管理</el-button>
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

  export default {
    name: 'manageTop',
    methods:{
      toRobot: function () {
        this.$router.push({
          name: 'robot'
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
  .manageTopNav{
    background:@black;
    .left{
      background: @black;
    }
  }
</style>
