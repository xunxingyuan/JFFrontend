<template>
  <div class="transPerson container">
    <div class="top">
      <p class="title">转人工量</p>
    </div>
    <div class="bottom">
      <div class="content">
        <div class="tools">
          <div class="flexCenter">
            <p>来源</p>
            <el-select class="inputItem" placeholder="请选择来源" v-model="selectType" @change="choseType">
              <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
            <p>时间</p>
            <time-range @choseTime="timeChange"></time-range>
          </div>
          <div>

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
                <th>请求来源</th>
                <th>接收时间</th>
                <!--<th>接收内容</th>-->
                <th>回复内容</th>
                <!--<th>推荐</th>-->
                <th>
                  <div class="flex">
                    <span>是否已解决</span>
                    <table-filter :options="tableFilterData" @selectFilter="choseFilter"></table-filter>
                  </div>
                </th>
                <th>是否人工咨询</th>
                <th width="200">操作</th>
              </tr>
              <tr v-for="item in showData">
                <td>{{item.source}}</td>
                <td>{{new Date(item.gmt_create).toLocaleString()}}</td>
                <!--<td></td>-->
                <td :title="item.hit_answer">
                  <div class="text">
                    {{item.hit_answer}}
                  </div>
                </td>
                <td>
                  <span v-if="item.status=== 1">已解决</span>
                  <span v-if="item.status=== 2">未解决</span>
                  <span v-if="item.status === 0">尚未处理</span>
                </td>
                <td>
                  <span v-if="item.manual === 1">是</span>
                  <span v-else>否</span>
                </td>
                <td>
                  <div class="ctrl">
                    <span class="view" @click="viewHistory(item)">查看对话</span>
                    <span class="view" v-if="item.status === 0" @click="ctrlQuestion(item,1)">已解决</span>
                    <span class="view" v-if="item.status === 0" @click="ctrlQuestion(item,2)">未解决</span>
                  </div>
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
  import utils from '../../../utils/index.js'
  import TalkRecord from "../../../components/common/talkRecord.vue";
  import TableFilter from "../../../components/common/filter.vue";

  export default {
    components: {
      TableFilter,
      TalkRecord,
      TimeRange},
    name: 'transPerson',
    data(){
      return {
        filterData:{
          startTime: '',
          endTime: '',
          manual: -1,
          status: '',
          robotId: '',
          source: '',
//          page: 1
        },
        showData:[],
        total: 0,
        talkRecord: [],
        showRecord: false,
        tableFilterData:[{
          id: 4,
          name:'全部'
        },{
          id: 0,
          name:'未处理'
        },{
          id: 1,
          name:'已解决'
        },{
          id: 2,
          name:'未解决'
        }],
        typeList:[{
          name: '所有来源',
          value: 'all'
        },{
          name: 'web',
          value: 'web'
        }],
        selectType: 'all',
        myChart1: '',
        myChart2: '',

      }
    },
    methods:{
      _initData: function () {
        let now = new Date()
        let date = new Date()
        date.setHours(0,0,0)
        this.filterData.startTime = date.getTime()
        this.filterData.endTime = now.getTime()
        this.myChart1 = echarts.init(document.getElementById('pieBox'));
        this.myChart2 = echarts.init(document.getElementById('lineBox'));
        this.getData()
      },
      timeChange: function (val) {
        this.filterData.startTime = val[0]
        this.filterData.endTime = val[1]
        this.getData()
      },
      getData: function () {
        this.filterData.robotId = this.$route.query.robotId
        this.$api.robotAnalysis.statistics.getSessionSummary(this.filterData).then((res)=>{
          if(res.code === 200){
            this.showData = res.data
            this.setChart1(res.data)
            let timeRange = []
            timeRange.push(this.filterData.startTime)
            timeRange.push(this.filterData.endTime)
            this.setChart2(res.data,timeRange)
            this.total = res.data.length
          }
        })
      },
      //查看记录
      viewHistory: function (item) {
        this.$api.robotAnalysis.statistics.viewHistory({
          sessionId: item.session_id,
          millis: new Date(item.gmt_create).getTime()
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
      //解决问题
      ctrlQuestion: function (item,val) {
        let type
        if(val === 1){
          type = '已解决'
        }else{
          type = '未解决'
        }
        this.$confirm('是否将该问题标记为'+ type +'?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$api.robotAnalysis.statistics.setQuestionHelpful({
            status: val,
            sessionId: item.session_id
          }).then((res)=>{
            if(res.code === 200){
              this.$message({
                type: 'success',
                message: '处理成功',
                duration: 1000
              });
              this.$api.robotAnalysis.statistics.getSessionSummary(this.filterData).then((res)=>{
                if(res.code === 200){
                  this.showData = res.data
                }
              })
            }
          })
        })
      },
      choseFilter: function (val) {
        if(val.id === 4){
          this.filterData.status = ''
        }else{
          this.filterData.status = val.id
        }
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
      //饼图
      setChart1: function (data) {

        let countData = {
          auto: 0,
          person: 0,
          error: 0
        }
        let result = []
        data.forEach((e)=>{
          if(e.manual === 0){
            countData.auto +=1
          }else if(e.manual === 1){
            countData.person +=1
          }else{
            countData.error +=1
          }
        })
        result.push({
          name: '自动答复',
          value: countData.auto
        })
        result.push({
          name: '转人工处理',
          value: countData.person
        })
        result.push({
          name: '错误',
          value: countData.error
        })

        let option1 = {
          tooltip: {
            trigger: 'item',
//            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          color:['#00a9fb','#42c938','#ff6460'],
          legend: {
            orient: 'vertical',
            x: 'left',
            data:['自动答复','转人工处理','错误']
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
              data: result
            }
          ]
        };

        this.myChart1.setOption(option1);
      },
      //折线图
      setChart2: function (data,timeArr) {

        let step = 12
        let range = (timeArr[1]-timeArr[0])/(step-2)
        let timeRange = []
        let XArr = []
        let AutoCount = []
        let PersonCount = []
        let ErrorCount = []
        let count = 0
        while (count< (step-1)){
          timeRange.push(timeArr[0] + count*range)
          let time = utils.parseTime(timeArr[0] + count*range,'{m}-{d} {h}:{i}')
          XArr.push(time)
          AutoCount.push(0)
          PersonCount.push(0)
          ErrorCount.push(0)
          count++
        }
        data.forEach((e)=>{
          let num = new Date(e.gmt_create).getTime()
          let step = this.getStep(num,timeRange)
          if(e.manual === 0){
            AutoCount[step]+=1
          }else if(e.manual === 1){
            PersonCount[step] += 1
          }else{
            ErrorCount[step] +=1
          }
        })
        let option2= {
          color:['#00a9fb','#42c938','#ff6460'],
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:['自动答复','转人工处理','错误'],
            bottom:0,
            left: 60
          },
          grid: {
            left: '3%',
            right: '8%',
            bottom: '7%',
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
          series: [
            {
              name:'自动答复',
              type:'line',
//              stack: '总量',
              smooth: true,
              data: AutoCount
            },
            {
              name:'转人工处理',
              type:'line',
//              stack: '总量',
              smooth: true,
              data: PersonCount
            },{
              name:'错误',
              type:'line',
//              stack: '总量',
              smooth: true,
              data:ErrorCount
            }

          ]
        };
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
        if(this.$route.name === 'transPerson'){
          this._initData()
        }
      }
    }
  }
</script>

<style lang="less">
.transPerson{
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
        margin-bottom: 3rem;
        .pageBox{
          margin-top: 1rem;
        }
      }
    }
  }
}
</style>