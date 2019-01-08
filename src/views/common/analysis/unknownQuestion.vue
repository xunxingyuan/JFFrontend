<template>
  <div class="unKnownQuestion container">
    <div class="top">
      <p class="title">未识别问题</p>
    </div>
    <div class="bottom">
      <div class="content">
        <div class="tools">
          <div class="flexCenter">
            <p>时间</p>
            <time-range @choseTime="timeChange"></time-range>
          </div>
        </div>
        <div class="dataBox">
          <div class="dataItem" v-for="item in dataList">
            <p>{{item.name}}</p>
            <span>{{item.value}}</span>
          </div>
        </div>
        <!--<div class="chartBox">-->
          <!--<div id="lineBox">-->

          <!--</div>-->
        <!--</div>-->
        <div class="showBox">
          <div class="form">
            <div class="rightTools" v-if="checkList.length>0">
              <div class="toolsBox">
                <el-checkbox v-model="checkPage" label="本页全选" @change="choseOrUnChose"></el-checkbox>
                <div class="flex" style="margin-left: 2rem">
                  <span class="toolsItem" v-for="item in checkTypeList">{{item.name}}</span>
                </div>
              </div>
            </div>
            <table class="gtable">
              <tr class="gheader">
                <th>序号</th>
                <th width="200">未识别问题</th>
                <th width="200">时间</th>
                <th>回答</th>
                <th width="180">回复状态</th>
                <th>来源</th>
                <th>操作</th>
              </tr>
              <tr v-for="(i,index) in showData">
                <td>
                  <!--<el-checkbox-group v-model="checkList">-->
                    <!--<el-checkbox :label="index+1"  :key="index+1"></el-checkbox>-->
                  <!--</el-checkbox-group>-->
                  {{index+1}}
                </td>
                <td :title="i.question">
                  <div class="text">
                    {{i.question}}
                  </div>
                </td>
                <td>{{new Date(i.create_time).toLocaleString()}}</td>
                <td :title="i.answer">
                  <div class="text">
                    {{i.answer}}
                  </div>
                </td>
                <td>
                  <span v-if="i.treat_type === -1">系统异常</span>
                  <span v-if="i.treat_type === 0">默认回复，没有命中答案</span>
                  <span v-if="i.treat_type === 1">命中FAQ一问一答</span>
                  <span v-if="i.treat_type === 2">命中寒暄</span>
                  <span v-if="i.treat_type === 3">命中场景</span>
                  <span v-if="i.treat_type === 1001">敏感词</span>
                  <span v-if="i.treat_type === 1002">业务敏感词</span>
                  <span v-if="i.treat_type === 1003">转人工</span>
                </td>
                <td width="100">{{i.source}}</td>
                <td width="100">
                  <div class="ctrl flex">
                    <div class="view">
                      <el-popover
                              placement="bottom"
                              width="150"
                              trigger="hover">
                        <div class="choseBox">
                          <p v-for="item in editList" style="height: 2rem;line-height: 2rem;cursor: pointer" @click="showAdd(item,i)">{{item.name}}</p>
                        </div>
                        <span slot="reference">编辑</span>
                      </el-popover>
                    </div>
                    <span class="view" @click="setSolve(i,2)">忽略</span>
                    <!--<span class="view">删除</span>-->
                  </div>
                </td>
              </tr>
            </table>
            <p class="tips" v-if="showData.length===0" style="margin-bottom: 2rem">暂无相关数据</p>
          </div>
          <div class="pageBox">
            <el-pagination
                    background
                    layout="total, prev, pager, next"
                    @current-change="handleCurrentChange"
                    :page-size="10"
                    :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <add-similar v-if="showAddStatus" @close="showAddStatus = false" :typeData="choseType" @addSuccess="setSolve(choseItem,1)" :questionData="choseItem"></add-similar>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import TimeRange from "../../../components/common/timeRange.vue";
  import utils from '../../../utils/index.js'
  import AddSimilar from "../../../components/console/robot/addSimilar.vue";


  export default {
    components: {
      AddSimilar,
      TimeRange},
    name: 'unKnownQuestion',
    data(){
      return {
        selectTime: [],
        filterData:{
          startTime: '',
          endTime: '',
          robotId: '',
          type: 3,
          page: 1
        },
        showData:[],
        total: 0,
        dataList:[{
          id: 1,
          name: '未识别',
          value: 0
        },{
          id: 2,
          name: '已处理',
          value: 0
        },{
          id: 3,
          name: '忽略',
          value: 0
        }],
        checkList:[],
        checkPage: false,
        checkTypeList:[{
          name: '忽略'
        },{
          name: '删除'
        }],
        editList:[{
          id: 1,
          name: '添加到多轮会话'
        },{
          id: 2,
          name: '添加到一问一答'
        },{
          id: 3,
          name: '添加到寒暄'
        }],
        choseType:'',
        choseItem: '',
        showAddStatus: false
      }
    },
    methods:{
      _initData: function () {
        let now = new Date()
        let date = new Date()
        date.setHours(0,0,0)
        this.filterData.startTime = date.getTime()
        this.filterData.endTime = now.getTime()
//        this.myChart1 = echarts.init(document.getElementById('lineBox'));
        this.getAnswer()
      },
      showAdd: function (item,data) {
        this.choseItem = data
        this.choseType = item
        this.showAddStatus = true
      },
      choseOrUnChose: function () {
        let len = this.showData.length
        if(this.checkList.length === len){
          this.checkList = []
        }else{
          this.showData.forEach((e,index)=>{
            if(this.checkList.indexOf(index+1) === -1){
              this.checkList.push(index+1)
            }
          })
        }
      },
      getAnswer: function () {
        this.filterData.robotId = this.$route.query.robotId
        this.$api.robotAnalysis.statistics.getAnswerList(this.filterData).then((res)=>{
          if(res.code === 200){
            this.showData = res.data.list
            this.total = res.data.totalCount
            this.dataList.forEach((e)=>{
              if(e.id === 1){
                e.value = res.data.totalCount
              }else if(e.id === 2){
                e.value = res.data.hasModifiedCount
              }else if(e.id === 3){
                e.value= res.data.hasIgnoredCount
              }
            })
          }
        })
        let timeRange = []
        timeRange.push(this.filterData.startTime)
        timeRange.push(this.filterData.endTime)
//        this.setChart(timeRange)
      },
      setSolve: function (item,type) {
        let reqData = {
          requestId: item.request_id,
          status: type,
          millis: new Date().getTime()
        }
        this.$api.robotAnalysis.statistics.setAnswerSolveInfo(reqData).then((res)=>{
          if(res.code === 200){
            this.$message({
              message: '处理成功',
              type: 'success',
              duration: 1000
            });
          }else{
            this.$message({
              message: res.message,
              type: 'error',
              duration: 1000
            });
          }
        })
      },
      timeChange: function (val) {
        this.filterData.startTime = val[0]
        this.filterData.endTime = val[1]
        this.getAnswer()
      },
      handleCurrentChange: function (val) {
        this.filterData.page = val
        this.getAnswer()
      },
      setChart: function (timeArr) {
        let step = 12
        let range = (timeArr[1]-timeArr[0])/(step-2)
        let timeRange = []
        let XArr = []
        let countData = []
        let count = 0
        let timeStr = ''
        while (count< (step-1)){
          timeRange.push(timeArr[0] + count*range)

          count++
        }
        timeRange.forEach((e,index)=>{
          if(index === 0){
            timeStr = e
          }else{
            timeStr += ','+ e
          }
        })

        this.$api.robotAnalysis.statistics.getAnswerListDetail({
          times: timeStr,
          type: 0,
          robotId: this.$route.query.robotId
        }).then((res)=>{
          if(res.code === 200){
            let result = res.data
            let option1 = {
              color:['#e1f3ff','#42c938','#ff6460'],
              tooltip : {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#6a7985'
                  }
                }
              },
              grid: {
                left: '6%',
                right: '4%',
                bottom: '7%',
                top: '3%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
              },
              yAxis: {
                type: 'value',
                axisLine:{
                  show: false
                },
                axisTick:{
                  show: false
                }
              },
              series: [{
                data: [],
                type: 'line',
                areaStyle: {},
                lineStyle: {
                  color: '#00A9Fb'
                },
                itemStyle:{
                  borderColor:'#00A9Fb'
                }
              }]
            };
            if(result.length===0){
              if(countData.length===0){
                option1.title={
                  text: '暂无数据',
                  left: 'center',
                  top: 'center',
                  fontFamily: 'Microsoft YaHei',
                  textStyle:{
                    color: '#999',
                    fontSize: '14'
                  },
                  fontWeight:'lighter'
                }
                option1.xAxis = {
                  show: false
                }
              }
              this.myChart1.setOption(option1);
            }else{
              option1.title = {}
              result.forEach((e)=>{
                let time = utils.parseTime(e.request_time,'{m}-{d} {h}:{i}')
                XArr.push(time)
                countData.push(e.cnt)
              })
              option1 = {
                color:['#e1f3ff','#42c938','#ff6460'],
                tooltip : {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'cross',
                    label: {
                      backgroundColor: '#6a7985'
                    }
                  }
                },
                grid: {
                  left: '6%',
                  right: '4%',
                  bottom: '7%',
                  top: '3%',
                  containLabel: true
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: XArr
                },
                yAxis: {
                  type: 'value',
                  axisLine:{
                    show: false
                  },
                  axisTick:{
                    show: false
                  }
                },
                series: [{
                  data: countData,
                  type: 'line',
                  areaStyle: {},
                  lineStyle: {
                    color: '#00A9Fb'
                  },
                  itemStyle:{
                    borderColor:'#00A9Fb'
                  }
                }]
              };
              if(countData.length===0){
                option1.title={
                  text: '暂无数据',
                  left: 'center',
                  top: 'center'
                }
              }else{
                option1.title= {}
              }
              this.myChart1.setOption(option1);
            }


          }
        })
      }
    },
    mounted(){
      this._initData()
    },
    watch:{
      '$route': function () {
        if(this.$route.name === 'unknownQuestion'){
          this._initData()
        }
      },
      checkList: function () {
        if(this.showData.length === this.checkList.length){
          this.checkPage = true
        }else{
          this.checkPage = false
        }
      }
    }
  }
</script>

<style lang="less">
  @import "../../../styles/common";
  .unKnownQuestion{
    .choseBox{
      p{
        height: 2rem;
        line-height: 2rem;
        text-align: left;
        padding: 0 10px;
      }
      p:hover{
        background: #EFF3F6;
      }
    }
    .bottom{
      padding: 0 1rem;
      .content{
        background: #fff;
        padding: 1rem;
        border: solid 1px #ddd;
        .tools{
          .timeBox{
            span{
              width: 5rem;
              height: 2rem;
              line-height: 2rem;
              margin-right: -1px;
              border: solid 1px #ddd;
              font-size: 14px;
              cursor: pointer;
            }
            .active{
              background: @blue;
              color: #fff;
              border: none;
            }
          }
        }
        .dataBox{
          margin: 1rem 0;
          background: #fff;
          border: solid 1px #ddd;
          height: 9rem;
          display: flex;
          padding: 0 2rem;
          align-items: center;
          .dataItem{
            flex: 1;
            padding-left: 4rem;
            border-left: solid 1px #ddd;
            height: 6rem;
            text-align: left;
            display: flex;
            flex-flow: column;
            justify-content: center;
            p{
              font-size: 16px;
              color: #666;
              margin-bottom: 10px;
            }
            span{
              font-size: 2rem;
              color: #000;
            }
          }
          .dataItem:nth-child(1){
            border: none;
          }
        }
        .chartBox{
          display: flex;
          height: 25rem;
          width: 100%;
          align-items: center;
          padding: 1rem;
          #pieBox{
            width: 30rem;
            height: 100%;
          }
          #lineBox{
            flex: 1;
            height: 100%;
          }
        }
        .showBox{

          .form{
            padding-top: 1rem;
            position: relative;
          }
          .pageBox{
            margin-top: 1rem;
          }
        }
      }
    }
  }
</style>