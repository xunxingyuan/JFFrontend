<template>
  <div class="robotShow">
    <section class="leftNav">
      <common-nav :navList="navList" :testPart="true" @choseNav="recordNav"></common-nav>
    </section>
    <section class="right">
      <router-view/>
    </section>
  </div>
</template>

<script>
  import CommonNav from "@/components/nav/commonNav.vue";
  import { mapGetters, mapActions } from 'vuex'

  export default {
    components: {CommonNav},
    name: 'robotShow',
    data(){
      return {
        navList:[{
          name:'会话管理',
          icon: 'icon-huihuaguanli',
          url: '',
          showChild: true,
          child:[{
            name: '多轮会话',
            url: 'scene',
            path: 'robot'
          },{
            name: '一问一答',
            url: 'qa',
            path: 'robot'
          },{
            name: '寒暄',
            url: 'greeting',
            path: 'robot'
          },{
            name: '会话设置',
            url: 'qaSetting',
            path: 'robot'
          }]
        },{
          name:'服务管理',
          icon: 'icon-fuwuguanli',
          url: 'robotService',
          showChild: false,
          child: [],
          path: 'robot'
        },{
          name:'统计分析',
          icon: 'icon-tongjiyouhua',
          url: '',
          child: [{
            name: '未识别问题',
            url: 'unknownQuestion',
            src: 'robot',
            path: 'robot'
          },{
            name: '业务量统计',
            url: 'serviceCount',
            src: 'robot',
            path: 'robot'
          },{
            name: '转人工量',
            url: 'transPerson',
            src: 'robot',
            path: 'robot'
          },{
            name: '知识质量分析',
            url: 'qualityAnalysis',
            src: 'robot',
            path: 'robot'
          }]
        },{
          name:'语义网',
          icon: 'icon-changjinglinghuo',
          url: 'ontology',
          showChild: false,
          child: [],
          path: 'robot'
        },{
          name:'机器人设置',
          icon: 'icon-jiqiren',
          url: '',
          showChild: false,
          child: [{
            name: '敏感词管理',
            url: 'sensitiveWord',
            src: 'robot',
            path: 'robot'
          },{
            name: '同义词管理',
            url: 'nearWord',
            src: 'robot',
            path: 'robot'
          }]
        },{
          name:'通用设置',
          icon: 'icon-shezhi',
          url: 'commonSetting',
          showChild: false,
          child: [],
          path: 'robot'
        }],
      }
    },
    computed:{
      ...mapGetters({
        robotList: 'getRobotList',
        choseRobot: 'getSelectRobot'
      })
    },
    methods:{
      recordNav: function (val) {
        console.log(val)
        let robotList = this.robotList
        this.robotList.forEach((e)=>{
          if(e.robotId === this.choseRobot.robotId){
            e.recordPath = val
          }
        })
        this.$store.dispatch('setRobotList',robotList)
      }
    }
  }
</script>

<style lang="less">
  @import "../../../styles/common";
 .robotShow{
   display: flex;
   position: relative;
   flex: 1;
   .right{
     padding-left: 4rem;
     flex: 1;
     height: 100%;
     overflow: auto;
     background: @bg;

   }
   .leftNav{
     position: absolute;
     height: 100%;
     left: 0;
     top: 0;
     z-index: 100;
   }
 }
</style>
