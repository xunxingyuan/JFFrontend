<template>
  <div class="newGroupAndUser container">
    <div class="top">
      <p class="title" v-if="!edit"><i class="fas fa-arrow-left" @click="back" ></i> 新建用户组</p>
      <p class="title" v-else><i class="fas fa-arrow-left" @click="back" ></i> 编辑用户组</p>

    </div>
    <div class="bottom">
      <div class="content">
        <div class="msgPart">
          <p class="intro">基本信息</p>
          <div class="formItem">
            <p class="itemName">用户组名称（必填）</p>
            <el-input class="itemContent" v-model="groupData.groupName"></el-input>
          </div>
          <div class="formItem">
            <p class="itemName">有效时间（必填）</p>
            <el-radio-group @change="typeChange" v-model="activeTime" style="margin-right: 10px">
              <el-radio :label="true">永久</el-radio>
              <el-radio :label="false">自定义</el-radio>
            </el-radio-group>
            <el-date-picker
                    v-if="!activeTime"
                    v-model="timeRange"
                    type="datetimerange"
                    @change="timeChange"
                    value-format="timestamp"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div class="formItem">
            <p class="itemName">备注</p>
            <el-input class="itemContent" v-model="groupData.remark"></el-input>
          </div>
        </div>
        <div class="msgPart" v-if="robotList.length>0">
          <p class="intro">设置与查看权限</p>
          <auth-config :robotList="robotList" @authChange="authChange" :edit="edit"></auth-config>
        </div>
        <div class="flex" style="padding-left: 10rem;margin-top: 1rem">
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
    name: 'newGroup',
    computed:{
      ...mapGetters({
        robotList: 'getRobotList',
        groupList: 'getUserGroupList',
      })
    },
    data(){
      return {
        edit: false,
        activeTime: true,
        timeRange:[],
        groupData:{
          groupName: '',
          permanent: 1,
          remark: ''
        },
        groupAuth:[],

      }
    },
    methods:{
      back: function () {
        this.$router.go(-1)
      },
      typeChange: function (val) {
        if(val){
          this.groupData.permanent = 1
        }else{
          this.groupData.permanent = 0
        }
      },
      timeChange: function (val) {

      },
      submitGroup: function () {
        this.$api.user.userGroup.addGroup(this.groupData).then((res)=>{
          if(res.status === 200){
            this.updateAuth(res.data)
          }else{
            this.$message({
              message: res.msg,
              type: 'info',
              duration: 1000
            });
          }
        })
      },
      updateGroup: function () {
        this.groupData.groupId = this.$route.query.groupId
        this.$api.user.userGroup.updateGroup(this.groupData).then((res)=>{
          if(res.status === 200){
            this.updateAuth(this.$route.query.groupId)
          }else{
            this.$message({
              message: res.msg,
              type: 'info',
              duration: 1000
            });
          }
        })
      },

      //更新权限
      updateAuth: function (groupId) {
        this.$api.user.userGroup.updateGroupAuth({
          groupId: groupId,
          permissions: JSON.stringify(this.groupAuth)
        }).then((res)=>{
          if(res.status === 200){
            if(this.edit){
              this.$message({
                message: '修改成功',
                type: 'success',
                duration: 1000
              });
            }else{
              this.$message({
                message: '新建成功',
                type: 'success',
                duration: 1000
              });
            }
            this.$router.go(-1)
          }else{
            this.$message({
              message: res.msg,
              type: 'info',
              duration: 1000
            });
          }
        })
      },

      submitData: function () {
        if(this.groupData.groupName.trim()){
          if(this.edit){
            if(this.groupData.permanent !== 1){
              if(this.timeRange.length===0){
                this.$message({
                  message: '请选择有效期',
                  type: 'info',
                  duration: 1000
                });
              }else{
                this.groupData.effectiveMillis = this.timeRange[0]
                this.groupData.ineffectiveMillis = this.timeRange[1]
                this.updateGroup()
              }
            }else{
              this.updateGroup()
            }
          }else{
            if(this.groupData.permanent !== 1){
              if(this.timeRange.length===0){
                this.$message({
                  message: '请选择有效期',
                  type: 'info',
                  duration: 1000
                });
              }else{
                this.groupData.effectiveMillis = this.timeRange[0]
                this.groupData.ineffectiveMillis = this.timeRange[1]
                this.submitGroup()
              }
            }else{
              this.submitGroup()
            }

          }
        }else{
          this.$message({
            message: '用户组名称不能为空',
            type: 'info',
            duration: 1000
          });
        }

      },
      _initData: function () {
        if(this.$route.query.hasOwnProperty('type')&&this.$route.query.type === 'edit'){
          this.edit = true
          this.groupList.forEach((e)=>{
            if(e.groupId === this.$route.query.groupId ){
              this.groupData.groupName = e.groupName
              this.groupData.remark = e.remark
              if(e.permanent === '1'){
                this.groupData.permanent = 1
              }else{
                this.groupData.permanent = 0
                this.timeRange = []
                this.activeTime = false
                this.timeRange.push(e.effectiveTime,e.ineffectiveTime)
              }
            }
          })
        }else{
          this.edit = false
          this.activeTime = true
          this.timeRange = []
          this.groupData = {
            groupName: '',
            permanent: 1,
            remark: ''
          }
        }
      },
      authChange: function (val) {
        console.log(val)
        this.groupAuth = val
      }
    },
    mounted(){
      this._initData()
    },
    watch:{
      '$route': function () {
        if(this.$route.name === 'newGroup'){
          this._initData()
        }
      }
    }
  }
</script>

<style lang="less">

</style>
