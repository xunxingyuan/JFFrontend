<template>
  <div class="newGroupAndUser container">
    <div class="top">
      <p class="title" v-if="!edit"><i class="fas fa-arrow-left" @click="back" ></i> 新建用户</p>
      <p class="title" v-else><i class="fas fa-arrow-left" @click="back" ></i> 编辑用户</p>

    </div>
    <div class="bottom">
      <div class="content">
        <div class="msgPart">
          <p class="intro">基本信息</p>
          <div class="formItem">
            <p class="itemName">用户名称（必填）</p>
            <el-input class="itemContent" v-model="userData.subUsername"></el-input>
          </div>
          <!--<div class="formItem">-->
            <!--<p class="itemName">有效时间（必填）</p>-->
            <!--<el-radio-group v-model="activeTime" style="margin-right: 10px">-->
              <!--<el-radio :label="true">永久</el-radio>-->
              <!--<el-radio :label="false">自定义</el-radio>-->
            <!--</el-radio-group>-->
            <!--<el-date-picker-->
                    <!--v-if="!activeTime"-->
                    <!--v-model="timeRange"-->
                    <!--type="datetimerange"-->
                    <!--range-separator="至"-->
                    <!--start-placeholder="开始日期"-->
                    <!--end-placeholder="结束日期">-->
            <!--</el-date-picker>-->
          <!--</div>-->
          <div class="formItem">
            <p class="itemName">手机号码</p>
            <el-input class="itemContent" v-model="userData.phone"></el-input>
          </div>
          <div class="formItem">
            <p class="itemName">邮箱</p>
            <el-input class="itemContent" v-model="userData.email"></el-input>
          </div>
          <div class="formItem">
            <p class="itemName">密码（必填）</p>
            <el-input class="itemContent" type="password" v-model="password1"></el-input>
          </div>
          <div class="formItem">
            <p class="itemName">确认密码（必填）</p>
            <el-input class="itemContent" type="password" v-model="password2"></el-input>
          </div>
        </div>
        <div class="flex" style="padding-left: 10.6rem;margin-top: 1rem">
          <el-button type="primary" @click="submitData">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import SelectAuth from "./userGroup/selectAuth.vue";
  import AuthConfig from "./userGroup/authConfig.vue";

  export default {
    components: {
      AuthConfig,
      SelectAuth},
    name: 'newGroupUser',
    computed:{
      ...mapGetters({
        robotList: 'getRobotList',
      })
    },
    data(){
      return {
        edit: false,
        activeTime: true,
        timeRange:[],
        userData:{
          subUsername: '',
          subUserPwd: '',
          email: '',
          phone: '',
          groupId: ''
        },
        password1: '',
        password2: ''
      }
    },
    methods:{
      _initData: function () {
        if(this.$route.query.hasOwnProperty('type')&&this.$route.query.type === 'edit'){
          this.edit = true
          let userInfo = JSON.parse(window.sessionStorage.getItem('userEdit'))
          this.userData.subUsername = userInfo.username
          this.userData.email = userInfo.email
          this.userData.phone = userInfo.phone
        }
      },
      back: function () {
        this.$router.go(-1)
      },
      submitData: function () {
        if(!this.userData.subUsername.trim()||!this.password1.trim()||!this.password2.trim()){
          this.$message({
            message: '用户以及密码输入不能为空',
            type: 'info',
            duration: 1000
          });
        }else if(this.password1!==this.password2){
          this.$message({
            message: '两次密码输入不一致',
            type: 'info',
            duration: 1000
          });
        }else{
          if(!this.edit){
            this.userData.subUserPwd = this.password1
            this.userData.groupId = this.$route.query.groupId
            this.$api.user.userGroup.createGroupUser(this.userData).then((res)=>{
              if(res.status === 200){
                this.$message({
                  message: '创建成功',
                  type: 'success',
                  duration: 1000
                });
                this.$router.go(-1)
              }else{
                this.$message({
                  message: res.msg,
                  type: 'error',
                  duration: 1000
                });
              }
            })
          }else{
            this.userData.subUserPwd = this.password1
            this.userData.groupId = ''
            this.$api.user.userGroup.updateUser(this.userData).then((res)=>{
              if(res.status === 200){
                this.$message({
                  message: '更新成功',
                  type: 'success',
                  duration: 1000
                });
              }else{
                this.$message({
                  message: res.msg,
                  type: 'error',
                  duration: 1000
                });
              }
            })
          }
        }
      }
    },
    mounted(){
      this._initData()
    },
    watch:{
      '$route': function () {
        if(this.$route.name === 'newGroupUser'){
          this._initData()
        }
      }
    }
  }
</script>

<style lang="less">

</style>
