<template>
  <div class="totalView container">
    <div class="top">
      <p class="title">机器人概况</p>
      <el-select></el-select>
    </div>
    <div class="bottom">
      <div class="content">
        <div class="choseTime">
          <time-range></time-range>
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
            <p class="title">趋势</p>
            <div id="lineBox">

            </div>
          </div>
          <div class="hot detailContain">
            <p class="title">热词</p>
            <div id="wordCloudBox">

            </div>
          </div>

          <div class="unknowQa detailContain">
            <p class="title">未识别问题</p>
            <div class="intro flexCenter">
              <div class="introItem">
                <p>未识别</p>
                <span>100</span>
              </div>
              <div class="introItem">
                <p>已修改</p>
                <span>100</span>
              </div>
              <div class="introItem">
                <p>忽略</p>
                <span>100</span>
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
  import echarts from 'echarts'
  require('echarts-wordcloud')

  export default {
    components: {TimeRange},
    name: 'totalView',
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
        echart: ''
      }
    },
    methods: {
      transInit: function () {
        let myChart = echarts.init(document.getElementById('lineBox'));

        let option = {
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
            right: '10%',
            bottom: '7%',
            top: '10%',
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
        myChart.setOption(option);
      },
      //云图初始化
      wordCloudInit: function (data) {
        let _self = this
        let myChart = echarts.init(document.getElementById('wordCloudBox'));
        let arr = [{
          name: '社保赔偿',
          value: 10
        },{
          name: '电信移动',
          value: 15
        },{
          name: '中国游戏',
          value: 14
        },{
          name: '博物馆',
          value: 9
        },{
          name: '工商管理',
          value: 13
        },{
          name: '深度学习',
          value: 5
        },{
          name: 'NPL',
          value: 18
        }]
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
            data: arr
          }]
        }
        myChart.setOption(option)
      },
      unknownInit: function () {
        let option = {
          color:['#00a9fb','#42c938','#ff6460'],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['0','4','8','12','16','20']
          },
          yAxis: {
            type: 'value'
          },
          grid: {
            left: '6%',
            right: '10%',
            bottom: '7%',
            top: '10%',
            containLabel: true
          },
          series: [
            {
              name:'邮件营销',
              type:'line',
              stack: '总量',
              data:[120, 132, 101, 134, 90, 230]
            },
            {
              name:'联盟广告',
              type:'line',
              stack: '总量',
              data:[220, 182, 191, 234, 290, 330]
            },
            {
              name:'视频广告',
              type:'line',
              stack: '总量',
              data:[150, 232, 201, 154, 190, 330]
            }
          ]
        };
        let myChart = echarts.init(document.getElementById('lineBox2'));
        myChart.setOption(option);
      }
    },
    mounted(){
      this.transInit()
      this.wordCloudInit()
      this.unknownInit()
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
            height: 2rem;
            line-height: 2rem;
            text-align: left;
            padding-left: 1rem;
          }
          .hot{
            height: 100%;
            width: 22rem;
            background: #fff;
            margin: 0 1rem;
            #wordCloudBox{
              height: 20rem;
              width: 100%;
            }
          }
          .unknowQa{
            width: 22rem;
            height: 100%;
            background: #fff;
            .intro{
              height: 4rem;
              width: 100%;
              .introItem{
                flex: 1;
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
              height: 20rem;
              width: 100%;
            }
          }
        }
      }
    }
  }

</style>
