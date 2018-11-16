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
})