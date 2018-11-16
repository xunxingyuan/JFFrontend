<template>
  <div class="manageHistory container">
    <div class="top">
      <p class="title">操作日志</p>
    </div>
    <div class="bottom">
      <div class="content">
        <div class="topContain">
          <span class="title">时间</span>
          <time-range></time-range>
        </div>
        <div class="tableBox">
          <table class="gtable">
            <tr class="gheader">
              <th>序号</th>
              <th>事项</th>
              <th>分类</th>
              <th>操作时间</th>
              <th>操作用户</th>
              <th>所属用户组</th>
              <th>操作</th>
            </tr>
            <tr v-for="i in 5">
              <td>{{i}}</td>
              <td>删除场景</td>
              <td>删除</td>
              <td>2018-03-12 09:12</td>
              <td>admin</td>
              <td>admin</td>
              <td>
                <span class="edit">编辑</span>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TimeRange from "../../../../components/common/timeRange.vue";

  export default {
    components: {TimeRange},
    name: 'manageHistory'
  }
</script>

<style lang="less">
.manageHistory{
  .bottom{
    padding: 0 1rem;
    .content{
      background: #fff;
      padding: 1rem;
      .topContain{
        display: flex;
        align-items: center;
        color: #333;
        .title{
          margin-right: 10px;
        }
      }
      .tableBox{
        .edit{
          color: #2B86F6;
        }
      }
    }
  }
}
</style>