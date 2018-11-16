<template>
  <div class="robotServiceBox scrollbar">
    <div class="ctrlBox">
      <el-button type="primary" @click="addServiceItem()">订阅服务</el-button>
    </div>
    <table class="gtable">
      <tr class="gheader">
        <th>序号</th>
        <th>服务名</th>
        <th>服务类型</th>
        <th>服务创建时间</th>
        <th>启用状态</th>
        <th>操作</th>
      </tr>
      <tr v-for="(item,index) in serviceList">
        <td width="50">{{index+1}}</td>
        <td width="100">{{item.serviceName}}</td>
        <td width="50"><span v-if="item.userId">自建服务</span><span v-else>系统服务</span></td>
        <td width="100">{{new Date(item.createdTime).toLocaleString()}}</td>
        <td width="100">
          <el-switch
            v-model="item.status"
            @change="changeState(item)"
            :active-value="1"
            :inactive-value="2"
            active-color="#2B86F6"
            inactive-color="#d6d6d6">
          </el-switch>
        </td>
        <td width="120">
          <span class="del" @click="deleteService(item)">取消订阅</span>
        </td>
      </tr>
    </table>
    <p v-if="count===0" style="font-size: 0.8rem;margin-top: 2rem;color: #999;">当前未查找到相关服务</p>
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
    <service-order @submit="commitOrderList" @close="orderShow = false" v-if="orderShow" :robotId="choseRobot.robotId"></service-order>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import ServiceOrder from "./serviceOrder.vue";

  export default {
    components: {ServiceOrder},
    name: 'robotServiceBox',
    data(){
      return{
        serviceList: [],
        selectService: '',
        searchFilter:{
          robotId: '',
          page: 1,
          rows: 10
        },
        count: 0,
        orderShow: false,
      }
    },
    computed:{
      ...mapGetters({
        choseRobot: 'getSelectRobot'
      })
    },
    methods:{
      _initData: function () {
        this.searchFilter.robotId = this.choseRobot.robotId
        this.$api.robotService.getService(this.searchFilter).then((res)=>{
          if(res.status === 200){
            this.serviceList = res.data.rows
            this.count = res.data.total
          }
        })
      },
      addServiceItem: function () {
        this.orderShow = true
      },
      deleteService: function (item) {
        this.$confirm('此操作将取消订阅该服务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.robotService.robotSubCancel({
            robotId: this.choseRobot.robotId,
            serviceId: item.serviceId
          }).then((res)=>{
            if(res.status === 200){
              this.$message({
                type: 'success',
                message: '取消订阅成功!',
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
      //开启关闭服务
      changeState: function (item) {
        let msg
        if(item.status === 1){
          msg = '开启成功'
        }else if(item.status === 2){
          msg = '关闭成功'
        }
        this.$api.robotService.robotServiceStart({
          serviceId: item.serviceId,
          status: item.status,
          robotId: this.choseRobot.robotId
        }).then((res)=>{
          if(res.status === 200){
            this.$message({
              message: msg,
              type: 'success',
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
      },
      commitOrderList: function (data) {
        this.$api.robotService.robotSub({
          robotId: this.choseRobot.robotId,
          serviceIdJson: JSON.stringify(data)
        }).then((res)=>{
          if(res.status === 200){
            this.$message({
              type: 'success',
              message: '订阅成功!',
              duration: 1000
            });
            this.orderShow = false
            this._initData()
          }else{
            this.$message({
              type: 'error',
              message: res.msg,
              duration: 1000
            });
          }
        })
      }
    },
    mounted(){
      this._initData()
    },
    watch:{
      choseRobot: function () {
        this._initData()
      }
    }
  }
</script>

<style lang="less">
  .robotServiceBox{
    padding: 1rem;
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
    }
    .block{
      margin-top: 1rem;
    }
  }

</style>
