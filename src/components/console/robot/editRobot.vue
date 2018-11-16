<template>
  <div class="coverBack editRobot">
    <div class="centerBox">
      <div class="title">
        <span v-if="typeData.create">创建机器人</span>
        <span v-else>编辑机器人</span>
        <i class="iconfont icon-guanbi" aria-hidden="true" @click="close()"></i>
      </div>
      <div class="content">
        <div class="addItem">
          <p>机器人名称：</p>
          <div class="itemInput">
            <el-input v-model="robotName" placeholder="请输入内容" maxlength="10" minlength="1"></el-input>
            <!--<span class="tips">分类的名称</span>-->
          </div>
        </div>
        <div class="addItem">
          <p>机器人描述：</p>
          <div class="itemInput">
            <el-input v-model="robotDesc" placeholder="请输入内容"></el-input>
            <!--<span class="tips">分类的名称</span>-->
          </div>
        </div>
      </div>
      <div class="btnGroup">
        <el-button type="primary" @click="create()">确认</el-button>
        <el-button @click="close()">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'editRobot',
    props:['typeData'],
    methods:{
      close: function () {
        this.$emit('close')
      },
      create: function () {
        if(this.robotName.trim()!==''){
          this.$emit('save',{
            robotName: this.robotName,
            robotDesc: this.robotDesc
          })
          this.$emit('close')
        }
      }
    },
    data(){
      return {
        robotName: '',
        robotDesc: ''
      }
    },
    mounted(){
      if(!this.typeData.create){
        this.robotName = this.typeData.data.robotName
        this.robotDesc = this.typeData.data.robotDesc
      }
    }
  }
</script>

<style lang="less">
  .editRobot{
    .centerBox{
      height: 25rem;
    }
  }
</style>
