<template>
  <div class="timeRange">
    <span v-for="item in timeList" :class="{'active': selectTime === item.id}" @click="choseTime(item)">{{item.name}}</span>
    <el-date-picker
            v-if="selectTime=== 5"
            size="small"
            class="timeArr"
            v-model="timeData"
            value-format="timestamp"
            type="datetimerange"
            @change="selfTime"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
    </el-date-picker>
  </div>
</template>

<script>
  export default {
    name: 'timeRange',
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
        selectTime: 1,
        timeData: []
      }
    },
    methods:{
      choseTime: function (item) {
        this.selectTime = item.id
        let now = new Date()
        let date = new Date()
        date.setHours(0,0,0)
        this.timeData = []
        switch(item.id){
          case 1:
            this.timeData.push(date.getTime())
            this.timeData.push(now.getTime())
            break;
          case 2:
            this.timeData.push(date.getTime()-24*60*60*1000)
            this.timeData.push(date.getTime())
            break;
          case 3:
            this.timeData.push(date.getTime()-6*24*60*60*1000)
            this.timeData.push(now.getTime())
            break
          case 4:
            this.timeData.push(date.getTime()-29*24*60*60*1000)
            this.timeData.push(now.getTime())
            break
          case 5:
            break;
          default:
            break;
        }
        this.$emit('choseTime',this.timeData)
      },
      selfTime: function () {
        this.$emit('choseTime',this.timeData)
      }
    }
  }
</script>

<style lang="less">
  .timeRange{
    display: flex;
    align-items: center;
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
      background: #2B86F6;
      color: #fff;
      border: none;
    }
    .timeArr{
      height: 2rem;
      margin-left: 10px;
    }
  }
</style>
