<template>
  <div class="transPerson container">
    <div class="top">
      <p class="title">转人工量</p>
    </div>
    <div class="bottom">
      <div class="content">
        <div class="tools">
          <div class="flexCenter">
            <p>时间</p>
            <el-select class="inputItem" placeholder="请选择时间"></el-select>
            <p>渠道</p>
            <el-select class="inputItem" placeholder="请选择渠道"></el-select>
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
                <th>渠道名称</th>
                <th>请求来源</th>
                <th>接收时间</th>
                <th>回复时间</th>
                <th>接收内容</th>
                <th>回复内容</th>
                <th>推荐</th>
                <th>是否有用</th>
                <th>是否人工咨询</th>
              </tr>
              <tr v-for="i in 5">
                <td>微信</td>
                <td>-</td>
                <td>2018-03-12 09:12</td>
                <td>2018-03-12 09:12</td>
                <td>说实话</td>
                <td >？？？</td>
                <td >-</td>
                <td >否</td>
                <td >否</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    name: 'transPerson',
    methods:{
      _initData: function () {
        let myChart1 = echarts.init(document.getElementById('pieBox'));
        let myChart2 = echarts.init(document.getElementById('lineBox'));
        let option1 = {
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
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
              data:[
                {value:1548, name:'自动答复'},
                {value:310, name:'转人工处理'},
                {value:50, name:'错误'},
              ]
            }
          ]
        };
        let option2= {
          color:['#ff6460','#00a9fb'],
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:['自动答复','转人工处理'],
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
            data: [0,3,6,9,12,15,18,21]
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name:'转人工处理',
              type:'line',
              stack: '总量',
              data:[10, 10, 10, 10, 10, 10, 10, 15]
            },
            {
              name:'自动答复',
              type:'line',
              stack: '总量',
              data:[180, 80, 101, 134, 90, 20, 20,20]
            }
          ]
        };
        myChart2.setOption(option2);
        myChart1.setOption(option1);
      }
    },
    mounted(){
      this._initData()
    }
  }
</script>

<style lang="less">
.transPerson{
  .bottom{
    .content{
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
    }
  }
}
</style>