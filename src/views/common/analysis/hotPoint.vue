<template>
  <div class="hotPoint container">
    <div class="top">
      <p class="title">热点</p>
    </div>
    <div class="bottom">
      <div class="content">
        <div class="tools">
          <div class="flexCenter">
            <p>时间</p>
            <time-range @choseTime="timeChange"></time-range>
          </div>
          <div class="flexCenter">
            <el-select size="small" v-model="filterData.source">
              <el-option v-for="item in channelList" :key="item.value" :value="item.value" :label="item.name"></el-option>
            </el-select>
            <!--<el-input style="margin-left: 1rem;" size="small" placeholder="请输入关键词"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>-->
          </div>
        </div>
        <div class="showBox">
          <div class="form">

            <table class="gtable">
              <tr class="gheader">
                <th>序号</th>
                <th>热词</th>
                <th>时间</th>
                <th>问题数</th>
                <th>比例</th>
              </tr>
              <tr v-for="(item,index) in hotList">
                <td>
                  {{index+1}}
                </td>
                <td>
                  {{item.question}}
                </td>
                <td>{{item.request_time}}</td>
                <td style="color: #2B86F6" @click="viewDetail(item)">{{item.total}}</td>
                <td>
                  <div class="outer">
                    <div class="inner" :style="{'width': Math.round((item.total/totalQuestion)*100) + '%' }">{{Math.round((item.total/totalQuestion)*100)}}%</div>
                  </div>
                </td>
              </tr>
            </table>
            <p class="tips" v-if="hotList.length===0">暂无相关数据</p>

          </div>
          <div class="pageBox" v-if="hotList.length!=0">
            <el-pagination
                    background
                    layout="total, prev, pager, next"
                    @current-change="handleCurrentChange"
                    :page-size="10"
                    :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div class="coverBack detailBox" v-if="showDetail">
      <div class="centerBox">
        <div class="title">
          <span>{{choseItem}} 问题数</span>
          <i class="fas fa-times" aria-hidden="true" @click="showDetail = false"></i>
        </div>
        <div class="content">
          <p class="count">共{{detailList.length}}条</p>
          <div class="list">
            <div v-for="(item,index) in detailList" class="flex listItem">
              <p class="index">{{index+1}}</p>
              <div class="text">{{item.detail}}</div>
              <div class="time">{{item.request_time}}</div>
            </div>
          </div>
        </div>
        <div class="btnGroup">
          <el-button type="primary"  @click="showDetail = false">知道了</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TimeRange from "../../../components/common/timeRange.vue";

  export default {
    components: {TimeRange},
    name: 'hotPoint',
    data(){
      return {
        channelList:[{
          name: 'web',
          value: 'web'
        }],
        total: 0,
        filterData:{
          startTime: '',
          endTime: '',
          source: 'web',
          robotId: '',
          page: 1
        },
        hotList:[],
        totalQuestion: 0,
        showDetail: false,
        detailList:[],
        choseItem: ''
      }
    },
    methods:{
      _initData: function () {
        let now = new Date()
        let date = new Date()
        date.setHours(0,0,0)
        this.filterData.startTime = date.getTime()
        this.filterData.endTime = now.getTime()
        this.getHot()
      },
      timeChange: function (val) {
        this.filterData.startTime = val[0]
        this.filterData.endTime = val[1]
        this.getHot()
      },
      handleCurrentChange: function (val) {
        this.filterData.page = val
        this.getHot()
      },
      //获取问题
      getHot: function () {
        this.filterData.robotId = this.$route.query.robotId
        this.$api.robotAnalysis.statistics.getHotQuestion(this.filterData).then((res)=>{
          if(res.code === 200){
            this.hotList = res.data.list
            this.total = res.data.totalCount
            this.totalQuestion = 0
            this.hotList.forEach((e)=>{
              this.totalQuestion += e.total
            })
          }
        })
      },
      viewDetail: function (item) {
        this.choseItem = item.question
        this.$api.robotAnalysis.statistics.getHotQuestionDetail({
          hotIds: item.id
        }).then((res)=>{
          if(res.code === 200){
            this.detailList = res.data
            this.showDetail = true
          }
        })
      }
    },
    mounted(){
      this._initData()
    },
    watch:{
      '$route': function () {
        if(this.$route.name === 'hotPoint'){
          this._initData()
        }
      }
    }
  }
</script>

<style lang="less">
  .hotPoint{
    .bottom{
      padding: 0 1rem;
      .content{
        padding: 1rem;
        background: #fff;
        border: solid 1px #ddd;
        .showBox{
          .form{
            .outer{
              height: 2rem;
              width: 100%;
              .inner{
                height: 2rem;
                background: #D6E7FA;
                display: flex;
                align-items: center;
                padding: 0 0.5rem;
              }
            }
          }
          .pageBox{
            margin-top: 1rem;
          }
        }
      }
    }
    .detailBox{
      .centerBox{
        .content{
          padding: 1rem;
          display: flex;
          flex-flow: column;
          .count{
            height: 2rem;
            width: 100%;
            text-align: left;
            font-size: 14px;
          }
          .list{
            flex: 1;
            border: solid 1px #ddd;
            width: 100%;
            overflow: auto;
            .listItem{
              text-align: left;
              border-bottom: solid 1px #ddd;
              height: 3rem;
              line-height: 3rem;
              font-size: 14px;

              .index{
                width: 4rem;
                padding-left: 1rem;
              }
              .text{
                flex: 1;
              }
              .time{
                width: 6rem;
              }
            }
          }
        }
      }
    }
  }
</style>
