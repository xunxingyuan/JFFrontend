let app = new Vue({
  el: '#app',
  data: {

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
})