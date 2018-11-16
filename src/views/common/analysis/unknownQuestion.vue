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
            <div class="timeBox flexCenter">
              <span v-for="item in timeList" :class="{'active': selectTime === item.id}" @click="selectTime = item.id">{{item.name}}</span>
            </div>
          </div>
        </div>
        <div class="chartBox">
          <div id="lineBox">

          </div>
        </div>
        <div class="showBox">
          <div class="form">
            <table class="gtable">
              <tr class="gheader">
                <th>未识别问题</th>
                <th>时间</th>
                <th>渠道</th>
                <th>操作</th>
              </tr>
              <tr v-for="i in 5">
                <td width="100">工商报销费用</td>
                <td width="100">2018-03-12 09:12</td>
                <td width="50">微信</td>
                <td width="50">
                  <span>编辑</span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    name: 'unKnownQuestion',
    data(){
      return {
        timeList:[{
          id: 1,
          name: '今天'
        },{
          id: 2,
          name: '昨天'
        },{
          id: 3,
          name: '近7天'
        },{
          id: 4,
          name: '最近30天'
        },{
          id: 5,
          name: '自定义'
        }],
        selectTime: 1
      }
    },
    methods:{
      _initData: function () {
        let myChart2 = echarts.init(document.getElementById('lineBox'));

        let option2 = {
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
            data: ['2018/10/26', '2018/10/27', '2018/10/28', '2018/10/29', '2018/10/30', '2018/10/31', '2018/11/1']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
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
        myChart2.setOption(option2);
      }
    },
    mounted(){
      this._initData()
    }
  }
</script>

<style lang="less">
  @import "../../../styles/common";
  .unKnownQuestion{
    .bottom{
      .content{
        background: #fff;
        padding: 1rem;
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