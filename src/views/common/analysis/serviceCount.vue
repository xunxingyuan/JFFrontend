<template>
  <div class="serviceCount container">
    <div class="top">
      <p class="title">业务量统计</p>
    </div>
    <div class="bottom">
      <div class="content">
        <div class="tools">
          <div class="flexCenter">
            <p>时间</p>
            <time-range @choseTime="timeChange"></time-range>
          </div>
        </div>
        <div class="chartBox">
          <div id="pieBox">

          </div>
          <div id="lineBox">

          </div>
        </div>
        <div class="showBox">
          <div class="form">
            <table class="gtable">
              <tr class="gheader">
                <th>会话标识</th>
                <th>来源</th>
                <th>创建时间</th>
                <th>内容</th>
                <th width="150">操作</th>
              </tr>
              <tr v-for="item in showData">
                <td>{{item.session_id}}</td>
                <td>{{item.source}}</td>
                <td>{{new Date(item.create_time).toLocaleString()}}</td>
                <td :title="item.content">
                  <div class="text">
                    {{item.content}}
                  </div>
                </td>
                <td>
                  <span @click="viewHistory(item)">查看记录</span>
                </td>
              </tr>
            </table>
            <p class="tips" v-if="showData.length===0" style="margin-bottom: 2rem">暂无相关数据</p>
          </div>
          <!--<div class="pageBox">-->
            <!--<el-pagination-->
                    <!--background-->
                    <!--layout="total, prev, pager, next"-->
                    <!--@current-change="handleCurrentChange"-->
                    <!--:page-size="10"-->
                    <!--:total="total">-->
            <!--</el-pagination>-->
          <!--</div>-->
        </div>
      </div>
    </div>
    <talk-record :talkList="talkRecord" v-if="showRecord" @close="showRecord = false"></talk-record>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import TimeRange from "../../../components/common/timeRange.vue";
  import TalkRecord from "../../../components/common/talkRecord.vue";
  import utils from '../../../utils/index.js'

  export default {
    components: {
      TalkRecord,
      TimeRange},
    name: 'serviceCount',
    data(){
      return {
        filterData:{
          startTime: '',
          endTime: '',
          robotId: '',
          source: ''
        },
        showData:[],
        total: 0,
        typeList:[{
          name: '所有来源',
          value: 'all'
        },{
          name: 'web',
          value: 'web'
        }],
        selectType: 'all',
        talkRecord: [],
        showRecord: false,
        myChart1: '',
        myChart2: ''
      }
    },
    methods:{
      _initData: function () {
        let now = new Date()
        let date = new Date()
        date.setHours(0,0,0)
        this.filterData.startTime = date.getTime()
        this.filterData.endTime = now.getTime()
        this.getData()
        this.myChart1 = echarts.init(document.getElementById('pieBox'));
        this.myChart2 = echarts.init(document.getElementById('lineBox'));
      },
      getData: function () {
        this.filterData.robotId = this.$route.query.robotId
        this.$api.robotAnalysis.statistics.getSession(this.filterData).then((res)=>{
          if(res.code === 200){
            this.showData = res.data.list
            this.total = res.data.total
            let timeRange = []
            timeRange.push(this.filterData.startTime)
            timeRange.push(this.filterData.endTime)
            this.setChart1(res.data.list)
            this.setChart2(res.data.list,timeRange)
          }
        })
      },
      timeChange: function (val) {
        this.filterData.startTime = val[0]
        this.filterData.endTime = val[1]
        this.getData()
      },
      handleCurrentChange: function (val) {
        this.filterData.page = val
        this.getData()
      },
      choseType: function (val) {
        if(val === 'all'){
          this.filterData.source = ''
        }else{
          this.filterData.source = val
        }
        this.getData()
      },
      //查看记录
      viewHistory: function (item) {
        this.$api.robotAnalysis.statistics.viewHistory({
          sessionId: item.session_id,
          millis: new Date(item.create_time).getTime()
        }).then((res)=>{
          if(res.code === 200){
            let list = res.data
            this.talkRecord = []
            list.forEach((e)=>{
              this.talkRecord.push({
                text: e.question,
                type: 'user'
              })
              this.talkRecord.push({
                text: e.answer,
                type: 'robotPart',
              })
            })
            this.showRecord = true
          }
        })
      },
      //draw1
      setChart1: function (data) {
        let option1 = {
          title: {
            text: '来源',
            left: 'center',
            bottom: 10,
            textStyle: {
              color: '#666',
              fontSize: 14
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          color:['#00a9fb','#42c938','#ff6460'],
          legend: {
            orient: 'vertical',
            x: 'left',
            data: []
          },
          series: [
            {
              type:'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: true
                }
              },
              data:[]
            }
          ]
        };

        let typeList = []
        let dataObj = {}
        let countList = []
        data.forEach((e)=>{
          if(!dataObj.hasOwnProperty(e.source)){
            dataObj[e.source]={
              name: e.source,
              count: 1,
              arr: []
            }
          }else{
            dataObj[e.source].count += 1
          }
        })
        for (let val in dataObj){
          typeList.push(val)
          countList.push({
            name: val,
            value: dataObj[val].count
          })
        }

        if(countList.length>0){
          option1.legend.data = typeList
          option1.series[0].data = countList
        }else {
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
      },
      setChart2: function (data,timeArr) {
        let option2= {
          color:['#42c938','#00a9fb','#ff6460'],
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:typeList,
            bottom:0,
            left: 60
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '7%',
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
          series: []
        };

        let step = 12
        let range = (timeArr[1]-timeArr[0])/(step-2)
        let timeRange = []
        let XArr = []
        let count = 0
        let resultArr = []
        let typeList = []
        let dataObj = {}
        data.forEach((e)=>{
          if(!dataObj.hasOwnProperty(e.source)){
            dataObj[e.source]={
              name: e.source,
              arr: []
            }
          }
        })
        //处理数据
        while (count< (step-1)){
          timeRange.push(timeArr[0] + count*range)
          let time = utils.parseTime(timeArr[0] + count*range,'{m}-{d} {h}:{i}')
          XArr.push(time)
          for (let val in dataObj){
            dataObj[val].arr.push(0)
          }
          count++
        }
        //数据汇总
        data.forEach((e)=>{
          let num = new Date(e.create_time).getTime()
          let step = this.getStep(num,timeRange)
          for (let val in dataObj){
            if(val === e.source){
              dataObj[val].arr[step] += 1
            }
          }
        })
        for (let val in dataObj){
          typeList.push(val)
          resultArr.push({
            name: val,
            type: 'line',
//            stack: '总量',
            data: dataObj[val].arr
          })
        }
        if(resultArr.length!==0){
          option2.title = {}
          option2.xAxis.data = XArr
          option2.series = resultArr
        }else{
          option2.title={
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
          option2.xAxis = {
            show: false
          }
        }
        console.log(option2)
        this.myChart2.clear()
        this.myChart2.setOption(option2);
      },
      //区间判断
      getStep: function (num,arr) {
        let result = 0
        arr.forEach((e,index)=>{
          if(num>e&&num< arr[index+1]){
            result = index
          }
        })
        return result
      }

    },
    mounted(){
      this._initData()
    },
    watch:{
      '$route': function () {
        if(this.$route.name === 'serviceCount'){
          this._initData()
        }
      }
    }
  }
</script>

<style lang="less">
  .serviceCount{
    .bottom{
      padding: 0 1rem;
      .content{
        border: solid 1px #ddd;
        background: #fff;
        padding: 1rem;
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
          .pageBox{
            margin-top: 1rem;
          }
        }
      }
    }
  }
</style>