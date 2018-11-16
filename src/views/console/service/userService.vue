<template>
  <div class="userService scrollbar">
    <div class="ctrlBox">
      <el-button type="primary" @click="addServiceItem()">新增服务</el-button>
    </div>
    <table class="gtable">
      <tr class="gheader">
        <th>序号</th>
        <th>服务名</th>
        <th>服务类型</th>
        <th>服务创建时间</th>
        <th>服务状态</th>
        <th>是否开放</th>
        <th>操作</th>
      </tr>
      <tr v-for="(item,index) in serviceList">
        <td width="50">{{index+1}}</td>
        <td width="100">{{item.serviceName}}</td>
        <td width="50"><span v-if="item.serviceType===0">自建服务</span><span v-else>系统服务</span></td>
        <td width="100">{{new Date(item.createdTime).toLocaleString()}}</td>
        <td width="50">
          <el-switch
            :disabled="item.serviceType!==0"
            v-model="item.status"
            @change="changeState(item)"
            :active-value="2"
            :inactive-value="1"
            active-color="#2B86F6"
            inactive-color="#d6d6d6">
          </el-switch>

        </td>
        <td width="100">
          <span v-if="item.opened" class="open"></span>
          <span v-else class="close"></span>
        </td>
        <td width="120">
          <span v-if="item.serviceType===0" class="edit" @click="editServiceItem(item)">编辑</span>
          <span v-if="item.serviceType===0" class="conf" @click="getServiceConfig(item)">配置</span>
          <span v-if="item.serviceType===0" class="del" @click="deleteService(item)">删除</span>
        </td>
      </tr>
    </table>
    <div class="block" v-if="count>10">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchFilter.page"
        :page-sizes="[ 10, 20, 50, 100, 200]"
        :page-size="searchFilter.rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
      </el-pagination>
    </div>
    <create-service v-if="showEdit" @close="showEdit = false" :serviceData="selectService" @submit="editService"></create-service>
    <service-config v-if="showConfig" @close="showConfig = false" :configData="selectConfig" @submit="saveServiceConfig"></service-config>
  </div>
</template>

<script>
  import CreateService from "./userService/createService.vue";
  import ServiceConfig from "./userService/serviceConfig.vue";

  export default {
    components: {
      ServiceConfig,
      CreateService},
    name: 'userService',
    data(){
      return{
        showEdit: false,
        showConfig: false,
        serviceList: [],
        selectService: '',
        selectConfig:'',
        searchFilter:{
          page: 1,
          rows: 10
        },
        count: ''
      }
    },
    methods:{
      _initData: function () {
        this.$api.robotService.getUserService(this.searchFilter).then((res)=>{
          if(res.status === 200){
            this.serviceList = res.data.rows
            this.count = res.data.total
          }
        })
      },
      editService: function (val) {
        if(val.edit){
          this.$api.robotService.updateService({
            serviceId: this.selectService.serviceId,
            serviceName: val.name,
            serviceUrl: val.path,
            serviceRequestMethod: val.request,
            status: val.status,
            opened: val.open,
          }).then((res)=>{
            if(res.status === 200){
              this.$message({
                message: '修改成功',
                type: 'success',
                duration: 1000
              });
              this.showEdit = false
              this._initData()
            }else{
              this.$message({
                message: res.msg,
                type: 'error',
                duration: 1000
              });
            }
          })
        }else{
          this.$api.robotService.createService({
            serviceName: val.name,
            serviceUrl: val.path,
            serviceRequestMethod: val.request,
            status: val.status,
            opened: val.open,
          }).then((res)=>{
            if(res.status === 200){
              this.$message({
                message: '创建成功',
                type: 'success',
                duration: 1000
              });
              this.showEdit = false
              this._initData()
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
      editServiceItem: function (item) {
        this.selectService = item
        this.showEdit = true
      },
      addServiceItem: function () {
        this.selectService = ''
        this.showEdit = true
      },
      deleteService: function (item) {
        this.$confirm('此操作将永久删除该服务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.robotService.deleteService({
            serviceId: item.serviceId
          }).then((res)=>{
            if(res.status === 200){
              this.$message({
                type: 'success',
                message: '删除成功!',
                duration: 1000
              });
              this._initData()
            }else{
              this.$message({
                message: res.msg,
                type: 'error',
                duration: 1000
              });
            }
          })

        })
      },
      //翻页
      handleSizeChange: function (val) {
        this.searchFilter.rows = val
        this._initData()
      },
      handleCurrentChange: function (val) {
        this.searchFilter.page = val
        this._initData()
      },
      //获取服务配置
      getServiceConfig: function (item) {
        this.$api.robotService.getServiceConfig({
          serviceId: item.serviceId
        }).then((res)=>{
          console.log(res)
          if(res.status === 200){
            this.showConfig = true
            this.selectConfig = res.data.data
          }
        })
      },
      //保存服务配置
      saveServiceConfig: function (item) {
        this.selectConfig.headerParams = item.headerParams
        this.selectConfig.requestParams = item.requestParams
        this.selectConfig.response = item.response
        this.selectConfig.serviceUrl = decodeURIComponent(this.selectConfig.serviceUrl)

        this.$api.robotService.updateServiceConfig({
          serviceJson: JSON.stringify(this.selectConfig)
        }).then((res)=>{
          if(res.status === 200){
            this.$message({
              message: '更新成功',
              type: 'success',
              duration: 1000
            });
            this.showConfig = false
          }else{
            this.$message({
              message: res.msg,
              type: 'error',
              duration: 1000
            });
          }
        })
      },
      //开启关闭服务
      changeState: function (item) {
        if(item.status === 2){
          this.$api.robotService.releaseService({
            serviceId: item.serviceId
          }).then((res)=>{
            if(res.status === 200){
              this.$message({
                message: '发布成功',
                type: 'success',
                duration: 1000
              });
              this.showEdit = false
              this._initData()
            }else{
              this.$message({
                message: res.msg,
                type: 'error',
                duration: 1000
              });
            }
          })
        }else{
          this.$api.robotService.cancelReleaseService({
            serviceId: item.serviceId
          }).then((res)=>{
            if(res.status === 200){
              this.$message({
                message: '取消发布成功',
                type: 'success',
                duration: 1000
              });
              this.showEdit = false
              this._initData()
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
    },
    mounted(){
      this._initData()
    }
  }
</script>

<style lang="less">
  .userService{
    padding: 1rem;
    width: 100%;
    display: block;
    overflow: auto;
    .ctrlBox{
      width: 100%;
      text-align: left;
    }
    table{
      .edit,.del,.conf{
        cursor: pointer;
      }
      .edit,.conf{
        margin-right: 1rem;
        color: #2B86F6;
      }
      .del{
        color: red;
      }
      .open{
        width: 20px;
        height: 20px;
        border-radius: 10px;
        background: #00aaec;
        display: block;
        margin-left: 1rem;
      }
      .close{
        width: 20px;
        height: 20px;
        border-radius: 10px;
        background: #ddd;
        display: block;
        margin-left: 1rem;
      }
    }
    .block{
      margin-top: 1rem;
    }
  }

</style>
