<template>
  <div class="flexCenter loginContain">
    <div class="loginBox animated bounceInDown flex">
      <div class="logoBox">
        <span class="logo flexCenter">G1Brain</span>
      </div>
      <p class="title"></p>
      <div class="inputItem" :class="{'error':userInfo.username.tips!==''}">
        <div class="inputBox" >
          <input v-model="userInfo.username.value" type="text"/>
          <span class="inputTitle">
            <i class="fa fa-user-o" aria-hidden="true"></i> 账户
          </span>
        </div>
        <span class="tips">{{userInfo.username.tips}}</span>
      </div>
      <div class="inputItem" :class="{'error':userInfo.password.tips!==''}">
        <div class="inputBox" >
          <input v-model="userInfo.password.value" @keyup.enter="login()" type="password" />
          <span class="inputTitle">
            <i class="fa fa-lock" aria-hidden="true"></i> 密码
          </span>
        </div>
        <span class="tips">{{userInfo.password.tips}}</span>
      </div>
      <span class="btn" @click="login()">登录</span>
      <!--<p class="registerTips" @click="register()">没有账户，立即注册</p>-->
    </div>
    <div class="bg">

    </div>
  </div>
</template>

<script>
  import md5 from 'js-md5'

  export default {
    name: 'login',
    data(){
      return{
        userInfo:{
          username: {
            value: '',
            tips: ''
          },
          password: {
            value: '',
            tips: ''
          }
        },

      }
    },
    methods:{
      login: function () {

        let data = {
          username: this.userInfo.username.value.trim(),
          password: md5.base64(this.userInfo.password.value.trim())
        }


        if(this.userInfo.username.value.trim()===''){
          this.userInfo.username.tips = '用户名不能为空'
        }else if(this.userInfo.password.value.trim()===''){
          this.userInfo.password.tips = '密码不能为空'
        }else{
          this.userInfo.username.tips = ''
          this.userInfo.password.tips = ''

          this.$api.user.login(data).then((res)=>{
            if(res.status === 200){
              window.sessionStorage.setItem('user',this.userInfo.username.value)
              window.sessionStorage.setItem('userInfo',JSON.stringify(res.data))
              window.sessionStorage.setItem('userId',this.userInfo.userId)
              if(res.data.pid === '0'){
                window.sessionStorage.setItem('userRole','admin')
                this.$router.push({
                  name: 'totalView'
                })
              }else{
                window.sessionStorage.setItem('userRole','user')
                this.$router.push({
                  name: 'robot'
                })
              }
            }else{
              console.log(res)
              this.$message({
                message: res.msg,
                type: 'error',
                duration: 1000
              });
            }
          })
        }
      },
      register: function () {
        this.$router.push({
          name: 'register'
        })
      }
    }
  }
</script>

<style lang="less">

</style>
