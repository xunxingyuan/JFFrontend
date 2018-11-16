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
                <th>会话标识</th>
                <th>来源</th>
                <th>渠道</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
              <tr v-for="i in 5">
                <td>工商报销费用</td>
                <td>直接访问</td>
                <td>微信</td>
                <td>2018-03-12 09:12</td>
                <td>
                  <span>编辑</span>
                </td>
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
    name: 'serviceCount',
    data(){
      return {

      }
    },
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
            data:['直接访问','搜索引擎','外部链接']
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
                {value:1548, name:'直接访问'},
                {value:310, name:'搜索引擎'},
                {value:50, name:'外部链接'},
              ]
            }
          ]
        };
        let option2= {
          color:['#ff6460','#42c938','#00a9fb'],
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:['直接访问','搜索引擎','外部链接'],
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
              name:'搜索引擎',
              type:'line',
              stack: '总量',
              data:[10, 10, 10, 10, 10, 10, 10, 15]
            },
            {
              name:'直接访问',
              type:'line',
              stack: '总量',
              data:[180, 80, 101, 134, 90, 20, 20,20]
            },
            {
              name:'外部链接',
              type:'line',
              stack: '总量',
              data:[18, 80, 11, 13, 90, 20, 21,20]
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
  .serviceCount{
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