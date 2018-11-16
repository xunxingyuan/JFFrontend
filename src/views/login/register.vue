<template>
  <div class="flexCenter register loginContain ">
    <div class="loginBox animated bounceInDown flex">
      <div class="logoBox">
         <span class="logo flexCenter">G1Brain<!--<img src="../../assets/logo.png"/>--></span>
      </div>

      <p class="title"></p>
      <div class="inputItem" v-for="item in userRegister" :class="{'error':item.tips!==''&&check(item.value)}">
        <div class="inputBox" >
          <input v-model="item.value" type="text"/>
          <span class="inputTitle">
            <i class="fa" :class="item.icon" aria-hidden="true"></i> {{item.name}}
          </span>
        </div>
        <span class="tips">{{item.tips}}</span>
      </div>

      <span class="btn" @click="register()">注册</span>
    </div>
    <div class="bg">

    </div>
  </div>
</template>

<script>
  export default {
    name: 'register',
    data(){
      return{
        userRegister:[{
          id: 1,
          name: '账户',
          value: '',
          tips: '',
          icon: 'fa-user-o'
        },{
          id: 2,
          name: '密码',
          value: '',
          tips: '',
          icon: 'fa-lock'
        },{
          id: 3,
          name: '重复密码',
          value: '',
          tips: '',
          icon: 'fa-lock'
        },{
          id: 4,
          name: '手机号码',
          value: '',
          tips: '',
          icon: 'fa-phone'
        },{
          id: 5,
          name: '邮箱',
          value: '',
          tips: '',
          icon: 'fa-address-card'
        }]
      }
    },
    methods:{
      register: function () {
        if(this.registerCheck()){
          let req = {}
          this.userRegister.forEach((e)=>{
            if(e.id===1){
              req.username = e.value
            }else if(e.id === 2){
              req.password= e.value
            }else if(e.id === 4){
              req.mobile = e.value
            }else if(e.id === 5){
              req.email = e.value
            }
          })
          this.$api.user.register(req).then((res)=>{
            console.log(res)
            if(res.result === '0'){
              this.$message({
                type: 'success',
                message: '注册成功',
                duration: 1000
              });
              this.$router.push({
                name: 'login'
              })
            }else{
              this.$message({
                type: 'info',
                message: res.data.msg,
                duration: 1000
              });
            }
          })
        }
      },
      check: function (value) {
        if(value===''){
          return true
        }else {
          return false
        }
      },
      registerCheck: function () {
        let flag = true
        this.userRegister.forEach((e)=>{
          if(e.value === ''&&(e.id===1||e.id===2||e.id === 3)){
            e.tips = '该项不能为空'
            flag = false
          }
        })
        if(this.userRegister[1].value!==this.userRegister[2].value){
          this.$message({
            type: 'info',
            message: '两次密码输入不一致',
            duration: 1000
          });
          flag = false
        }

        return flag
      }
    }
  }
</script>

<style lang="less">
  .register{
    .loginBox{
      height: 30rem;
      width: 25rem;
      .inputItem{
        .inputBox{
          input{
            padding-left: 100px;
          }
          .inputTitle{
            width: 100px;
            text-align: left;
            padding-left: 1rem;
          }
        }
      }
    }
  }
</style>
