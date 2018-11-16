<template>
  <div class="createService coverBack">
    <div class="centerBox">
      <div class="title"><p v-if="edit">编辑服务</p><p v-else>新增服务</p><i class="iconfont icon-guanbi" aria-hidden="true" @click="close()"></i></div>
      <div class="content">
        <div class="item">
          <p>服务名称：</p>
          <input v-model="serviceName" />
        </div>
        <div class="item">
          <p>服务路径：</p>
          <input v-model="servicePath" />
        </div>
        <div class="item">
          <p>请求方法：</p>
          <select class="select" v-model="serviceRequest">
            <option value="0" selected>ALL</option>
            <option value="1">GET</option>
            <option value="2">POST</option>
            <option value="3">PUT</option>
            <option value="4">DELETE</option>
            <option value="5">HEAD</option>

          </select>
        </div>
        <div class="item">
          <p>是否开放：</p>
          <el-switch
            v-model="openState"
            active-color="#2B86F6"
            inactive-color="#d6d6d6">
          </el-switch>
        </div>
        <!--<div class="item">-->
          <!--<p>发布状态：</p>-->
          <!--<el-switch-->
            <!--v-model="publishState"-->
            <!--active-color="#2B86F6"-->
            <!--inactive-color="#d6d6d6">-->
          <!--</el-switch>-->
        <!--</div>-->
      </div>
      <div class="btnGroup flex">
        <el-button type="primary" @click="submit()">确定</el-button>
        <el-button @click="close()">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'createService',
    props:['serviceData'],
    methods:{
      close: function () {
        this.$emit('close')
      },
      submit: function () {
        if(this.serviceName.trim()===''||this.servicePath.trim()===''){
          this.$message({
            message: '输入项不能为空',
            type: 'info',
            duration: 1000
          });
        }else{
          let data = {
            name: this.serviceName,
            path: encodeURIComponent(this.servicePath),
            request: this.serviceRequest,
            open: this.openState,
            edit: this.edit
          }
//          if(this.publishState){
//            data.status = 2
//          }else{
//            data.status = 1
//          }
          this.$emit('submit',data)
        }
      }
    },
    data(){
      return {
        openState: true,
        serviceRequest: '',
        serviceName: '',
        servicePath: '',
        publishState: '',
        edit: false
      }
    },
    mounted(){
      if(this.serviceData){
        this.serviceName = this.serviceData.serviceName
        this.servicePath = decodeURIComponent(this.serviceData.serviceUrl)
        this.serviceRequest = this.serviceData.serviceRequestMethod
        this.openState = this.serviceData.opened
//        this.publishState = this.serviceData.status
        this.edit = true
      }else{
        this.serviceName = ''
        this.servicePath = ''
        this.serviceRequest = 0
        this.openState = true
//        this.publishState = true
        this.edit = false
      }
    }
  }
</script>

<style lang="less">
  .createService{
    .centerBox{
      .btnGroup{
        .el-button{
          height: 2.5rem;
        }
      }
      .content{
        .item{
          display: flex;
          align-items: center;
          width: 100%;
          padding: 0 10%;
          margin-bottom: 1rem;
          height: 2.2rem;
          p{
            width: 5rem;
            text-align: left;
            font-size: 0.9rem;
            color: #666;
          }
          input{
            flex: 1;
            height: 2.2rem;
            padding: 0 10px;
            outline: none;
            border-radius: 2px;
            border: solid 1px #ddd;
          }
          input:focus{
            border: solid 1px #2B86F6;
          }
          .select{
            flex: 1;
            height: 2.2rem;
            outline: none;
            border: solid 1px #ddd;
            padding: 0 10px;
          }
          .select:focus{
            border: solid 1px #2B86F6;
          }
        }
      }
    }
  }
</style>
