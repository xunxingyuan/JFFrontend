<template>
  <div class="timeRange">
    <span v-for="item in timeList" :class="{'active': selectTime === item.id}" @click="selectTime = item.id">{{item.name}}</span>
    <el-date-picker
            v-if="selectTime=== 5"
            class="timeArr"
            v-model="timeData"
            type="datetimerange"
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
