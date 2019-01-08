<template>
  <div class="totalView container">
    <div class="top">
      <p class="title">机器人概况</p>
      <el-select v-model="selectType" @change="robotChange">
        <el-option
                v-for="item in robotListData"
                :key="item.robotId"
                :label="item.robotName"
                :value="item.robotId"
        ></el-option>
      </el-select>
    </div>
    <div class="bottom">
      <div class="content">
        <div class="choseTime">
          <time-range @choseTime="timeChange"></time-range>
        </div>
        <div class="dataBox">
          <p class="title">机器应答量</p>
          <div class="dataContain">
            <div class="dataItem" v-for="item in viewData">
              <p>{{item.name}}</p>
              <span>{{item.value + Math.floor(Math.random()*100)}}</span>
            </div>
          </div>
        </div>
        <div class="detailBox">
          <div class="trans detailContain">
            <p class="title">业务量统计</p>
            <div id="lineBox"></div>
          </div>
          <div class="hot detailContain">
            <p class="title">热词</p>
            <div id="wordCloudBox"></div>
          </div>
          <div class="unknowQa detailContain">
            <p class="title">未识别问题</p>
            <div class="intro flexCenter">
              <div class="introItem">
                <p>未识别</p>
                <span style="color: #2B86F6">{{unknowData.total}}</span>
              </div>
              <div class="introItem">
                <p>已修改</p>
                <span style="color: #6ce26c">{{unknowData.finish}}</span>
              </div>
              <div class="introItem">
                <p>忽略</p>
                <span style="color: #666;">{{unknowData.ignore}}</span>
              </div>
            </div>
            <div id="lineBox2">

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TimeRange from "../../../../components/common/timeRange.vue";
  import { mapGetters, mapActions } from 'vuex'
  import utils from '../../../../utils/index.js'

  import echarts from 'echarts'
  require('echarts-wordcloud')

  export default {
    components: {TimeRange},
    name: 'totalView',
    computed:{
      ...mapGetters({
        robotList: 'getRobotList',
      })
    },
    data(){
      return {
        viewData:[{
          name:'总应答',
          value: 9234
        },{
          name:'多轮会话',
          value: 6600
        },{
          name:'一问一答',
          value: 2345
        },{
          name:'寒暄',
          value: 234
        },{
          name:'转人工客服',
          value: 7
        },{
          name:'报错处理',
          value: 56
        }],
        echart: '',
        robotListData:[{
          robotName: '全部',
          robotId: 'all'
        }],
        selectType: 'all',

        //业务量
        serviceChart: '',
        serviceFilter:{
          startTime: '',
          endTime: '',
          robotId: '',
          source: ''
        },

        hotChart:'',
        hotPointFiler:{
          startTime: '',
          endTime: '',
          source: 'web',
          robotId: '',
          page: 1
        },

        unknownChart: '',
        unknownFilter:{
          startTime: '',
          endTime: '',
          robotId: '',
          type: 3,
          page: 1
        },
        unknowData:{
          total: '',
          finish: '',
          ignore: ''
        }
      }
    },
    methods: {
      _initData: function () {
        this.hotChart = echarts.init(document.getElementById('wordCloudBox'));
        this.serviceChart = echarts.init(document.getElementById('lineBox'));
        this.unknownChart = echarts.init(document.getElementById('lineBox2'));
        let now = new Date()
        let date = new Date()
        date.setHours(0,0,0)
        this.hotPointFiler.startTime = date.getTime()
        this.hotPointFiler.endTime = now.getTime()
        this.getHot()

        this.serviceFilter.startTime = date.getTime()
        this.serviceFilter.endTime = now.getTime()
        this.getServiceData()


        this.unknownFilter.startTime = date.getTime()
        this.unknownFilter.endTime = now.getTime()
        let timeRangeData = []
        timeRangeData.push(this.serviceFilter.startTime)
        timeRangeData.push(this.serviceFilter.endTime)
        this.setChart(timeRangeData)
        this.getUnknownData()
      },
      robotChange: function () {
        this.getHot()
        this.getServiceData()
        let timeRangeData = []
        timeRangeData.push(this.serviceFilter.startTime)
        timeRangeData.push(this.serviceFilter.endTime)
        this.setChart(timeRangeData)
      },

      timeChange: function (val) {
        this.hotPointFiler.startTime = val[0]
        this.hotPointFiler.endTime = val[1]
        this.getHot()

        this.serviceFilter.startTime = val[0]
        this.serviceFilter.endTime = val[1]
        this.getServiceData()


        this.unknownFilter.startTime = val[0]
        this.unknownFilter.endTime = val[1]
        this.getUnknownData()

        let timeRangeData = []
        timeRangeData.push(this.serviceFilter.startTime)
        timeRangeData.push(this.serviceFilter.endTime)
        this.setChart(timeRangeData)
      },
      //获取问题
      getHot: function () {
        if(this.selectType === 'all'){
          this.hotPointFiler.robotId = ''
        }else{
          this.hotPointFiler.robotId = this.selectType
        }
        this.$api.robotAnalysis.statistics.getHotQuestion(this.hotPointFiler).then((res)=>{
          if(res.code === 200){
            let hotList = res.data.list
            let result = []
            hotList.forEach((e)=>{
              result.push({
                name: e.question,
                value: e.weight
              })
            })
            this.wordCloudInit(result)
          }
        })
      },
      //获取未识别问题
      getUnknownData: function () {
        if(this.selectType === 'all'){
          this.unknownFilter.robotId = ''
        }else{
          this.unknownFilter.robotId = this.selectType
        }
        this.$api.robotAnalysis.statistics.getAnswerList(this.unknownFilter).then((res)=>{
          if(res.code === 200){
            this.unknowData.total = res.data.totalCount
            this.unknowData.finish = res.data.hasModifiedCount
            this.unknowData.ignore = res.data.hasIgnoredCount
          }
        })
      },
      //获取业务量数据
      getServiceData: function () {
        if(this.selectType === 'all'){
          this.serviceFilter.robotId = ''
        }else{
          this.serviceFilter.robotId = this.selectType
        }
        this.$api.robotAnalysis.statistics.getSession(this.serviceFilter).then((res)=>{
          if(res.code === 200){
            let timeRange = []
            timeRange.push(this.serviceFilter.startTime)
            timeRange.push(this.serviceFilter.endTime)
            this.setChart2(res.data.list,timeRange)
          }
        })
      },
      setChart2: function (data,timeArr) {
        let step = 12
        let range = (timeArr[1]-timeArr[0])/(step-2)
        let timeRange = []
        let XArr = []
        let count = 0
        let resultArr = []
        let typeList = []
        let dataObj = {}
        let option2= {
          color:['#42c938','#00a9fb','#ff6460'],
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:typeList,
            bottom:10,
            left: 60
          },
          grid: {
            top: '7%',
            left: '7%',
            right: '7%',
            bottom: '13%',
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
        this.serviceChart.clear()
        this.serviceChart.setOption(option2);
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
      },

      //云图初始化
      wordCloudInit: function (data) {
        let _self = this
        let option = {
          series: [{
            type: 'wordCloud',
            shape: 'circle',
            left: 'center',
            top: 'center',
            right: null,
            bottom: null,
            textStyle: {
              normal: {
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                // Color can be a callback function or a color string
                color: function () {
                  // Random color
                  return 'rgb(' + [
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160)
                  ].join(',') + ')';
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowColor: '#333'
              }
            },
////            sizeRange: [12, 60],
//            rotationRange: [0, 0],
//            rotationStep: 45,
//            gridSize: 80,
//            drawOutOfBound: false,

            // Data is an array. Each array item must have name and value property.
            data: data
          }]
        }

        if(data.length === 0){
          option.title={
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
        }else{
          option.title = {}
        }
        this.hotChart.clear()
        this.hotChart.setOption(option)
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
        let filter = {
          times: timeStr,
          type: 0,
          robotId: ''
        }
        if(this.selectType === 'all'){
          filter.robotId = ''
        }else{
          filter.robotId = this.selectType
        }

        this.$api.robotAnalysis.statistics.getAnswerListDetail(filter).then((res)=>{
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
              this.unknownChart.clear()
              this.unknownChart.setOption(option1);
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
              this.unknownChart.clear()
              this.unknownChart.setOption(option1);
            }
          }
        })
      },
    },
    mounted(){
      this.robotList.forEach((e)=>{
        this.robotListData.push(e)
      })
      this._initData()
    }
  }
</script>

<style lang="less">
  .totalView{
    .top{
      margin-top: 0.5rem;
      .title{
        margin-right: 1rem;
      }
    }
    .bottom{
      .content{
        padding-bottom: 1rem;
        .choseTime{
          margin-top: 10px;
          background: #fff;
        }
        .dataBox{
          margin-top: 1rem;
          background: #fff;
          height: 14rem;
          text-align: left;
          position: relative;
          .title{
            width: 100%;
            height: 3rem;
            padding: 0 1rem;
            line-height: 3rem;
          }
          .dataContain{
            width: 100%;
            display: flex;
            align-items: center;
            height: 11rem;
            padding: 0 1rem;
            .dataItem{
              margin-bottom: 2rem;
              flex: 1;
              height: 6rem;
              display: flex;
              align-items: flex-start;
              flex-flow: column;
              justify-content: center;
              padding-left: 1rem;
              border-left: solid 1px #ddd;
              p{
                color: #666;
              }
              span{
                font-size: 2rem;
                color: #000;
                margin-top: 10px;
              }
            }
            .dataItem:nth-child(1){
              border-left: none;
            }
          }
        }
        .detailBox{
          margin-top: 1rem;
          height: 22rem;
          display: flex;
          .title{
            width: 100%;
            height: 3rem;
            line-height: 3rem;
            text-align: left;
            padding-left: 1rem;
          }
          .hot{
            height: 100%;
            width: 21rem;
            background: #fff;
            margin: 0 1rem;
            #wordCloudBox{
              height: 20rem;
              width: 100%;
            }
          }
          .unknowQa{
            width: 21rem;
            height: 100%;
            background: #fff;
            .intro{
              height: 4rem;
              width: 100%;
              .introItem{
                flex: 1;
                p{
                  font-size: 14px;
                  margin-bottom: 10px;
                  color: #666;
                }
                span{
                  font-size: 16px;
                }
              }
            }
            #lineBox2{
              height: 16rem;
              width: 100%;
            }
          }
          .trans{
            flex: 1;
            background: #fff;

            #lineBox{
              height: 19rem;
              width: 100%;
            }
          }
        }
      }
    }
  }

</style>
