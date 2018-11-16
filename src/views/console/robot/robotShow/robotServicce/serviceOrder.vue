<template>
  <div class="serviceOrder coverBack">
    <div class="centerBox">
      <div class="title"><p>订阅服务</p><i class="iconfont icon-guanbi" aria-hidden="true" @click="close()"></i></div>
      <div class="content">
        <table class="gtable" style="margin-bottom: 1rem">
          <tr class="gheader">
            <th>选择</th>
            <th>服务名</th>
            <th>服务类型</th>
            <th>服务创建时间</th>
          </tr>
          <tr v-for="(item,index) in serviceOrderList" @click="chose(item)">
            <td width="50"><input type="checkbox" value="item.serviceId" :checked="choseList.indexOf(item.serviceId)>-1" /></td>
            <td width="100">{{item.serviceName}}</td>
            <td width="50"><span v-if="item.userId">自建服务</span><span v-else>系统服务</span></td>
            <td width="100">{{new Date(item.createdTime).toLocaleString()}}</td>
          </tr>
        </table>
        <el-pagination
          @current-change="handleCurrentChange"
          :page-sizes="[6]"
          :current-page="orderFilter.page"
          :page-size="orderFilter.rows"
          layout="total, sizes, prev, pager, next, jumper"
          :total="orderCount">
        </el-pagination>
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
    name: 'serviceOrder',
    props:['robotId'],
    data(){
      return {
        orderFilter:{
          robotId: '',
          page: 1,
          rows: 6
        },
        serviceOrderList: [],
        orderCount: 0,
        choseList:[]
      }
    },
    methods:{
      getOrderList: function () {
        this.orderFilter.robotId = this.robotId
        this.$api.robotService.getRobotOrderList(this.orderFilter).then((res)=>{
          if(res.status === 200){
            this.serviceOrderList = res.data.rows
            this.orderCount = Number(res.data.total)
          }
        })
      },
      close: function () {
        this.$emit('close')
      },
      chose: function (item) {
        if(this.choseList.indexOf(item.serviceId)>-1){
          this.choseList.splice(this.choseList.indexOf(item.serviceId),1)
        }else{
          this.choseList.push(item.serviceId)
        }
      },
      submit: function () {
        this.$emit('submit',this.choseList)
      },
      handleCurrentChange: function (val) {
        this.orderFilter.page = val
        this.getOrderList()
      }
    },
    mounted(){
      this.getOrderList()
      this.choseList = []
    }
  }
</script>

<style lang="less">
  .serviceOrder{
    .centerBox{
      width: 45rem;
      .content{
        display: block;
      }
      .btnGroup{
        .el-button{
          height: 2.5rem;
        }
      }
    }
  }
</style>
