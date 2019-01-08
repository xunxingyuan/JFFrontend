<template>
  <div class="robotShow">
    <section class="leftNav">
      <common-nav :navList="userNav" :testPart="true" @choseNav="recordNav"></common-nav>
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
        resultNav:[],
        navList:[{
          name:'会话管理',
          icon: 'icon-huihuaguanli',
          url: '',
          showChild: true,
          id: 2,
          child:[{
            name: '多轮会话',
            url: 'scene',
            path: 'robot',
            id: 21
          },{
            name: '一问一答',
            url: 'qa',
            path: 'robot',
            id: 22
          },{
            name: '寒暄',
            url: 'greeting',
            path: 'robot',
            id: 23
          },
//            {
//              name: '会话设置',
//              url: 'qaSetting',
//              path: 'robot'
//            }
          ]
        },
//          {
//            name:'服务管理',
//            icon: 'icon-fuwuguanli',
//            url: 'robotService',
//            showChild: false,
//            child: [],
//            path: 'robot'
//          },
          {
            name:'统计分析',
            icon: 'icon-tongjiyouhua',
            showChild: true,
            id: 3,
            url: '',
            child: [{
              name: '未识别问题',
              url: 'unknownQuestion',
              src: 'robot',
              path: 'robot',
              id: 31,
            },{
              name: '业务量统计',
              url: 'serviceCount',
              src: 'robot',
              path: 'robot',
              id: 32,
            },{
              name: '转人工量',
              url: 'transPerson',
              src: 'robot',
              path: 'robot',
              id: 33,
            },{
              name: '热点',
              url: 'hotPoint',
              src: 'robot',
              path: 'robot',
              id: 34,
            },{
              name: '应答准确率自检',
              url: 'qualityAnalysis',
              src: 'robot',
              path: 'robot',
              id: 35,
            }]
          },
//          {
//          name:'语义网',
//          icon: 'icon-changjinglinghuo',
//          url: 'ontology',
//          showChild: false,
//          child: [],
//          path: 'robot'
//        },
          {
            name:'机器人设置',
            icon: 'icon-jiqiren',
            url: '',
            showChild: true,
            id: 4,
            child: [{
              name: '敏感词管理',
              url: 'sensitiveWord',
              src: 'robot',
              path: 'robot',
              id: 41,
            },{
              name: '同义词管理',
              url: 'nearWord',
              src: 'robot',
              path: 'robot',
              id: 42,
            }]
          },
//          {
//          name:'通用设置',
//          icon: 'icon-shezhi',
//          url: 'commonSetting',
//          showChild: false,
//          child: [],
//          path: 'robot'
//        }
        ],
      }
    },
    computed:{
      ...mapGetters({
        robotList: 'getRobotList',
        userAuth: 'getUserAuth',
        userNav: 'getUserMenu'
      })
    },
    methods:{
      recordNav: function (val) {
//        console.log(val)
        let robotId = window.sessionStorage.getItem('robotId')
        let robotList = this.robotList
        this.robotList.forEach((e)=>{
          if(e.robotId === robotId){
            e.recordPath = val
          }
        })
        this.$store.dispatch('setRobotList',robotList)
      },
      _initData: function () {
        let robotId = window.sessionStorage.getItem('robotId')||this.$route.query.robotId
        this.resultNav = []
        if(this.userAuth.admin){
          this.resultNav = this.navList
        }else{
          let list = this.userAuth.data.menuAuthority[robotId]
          this.navList.forEach((e)=>{
            if(list.indexOf(e.id.toString())!==-1){
              let result = JSON.parse(JSON.stringify(e))
              result.child = []
              e.child.forEach((ele)=>{
                if(list.indexOf(ele.id.toString())!==-1){
                  result.child.push(ele)
                }
              })
              if(e.id === '2'){
                let qaAuth = this.userAuth.data.categoryAuthority[robotId]
                if(qaAuth){
                  qaAuth.forEach((ele)=>{
                    if(ele.conversationType === 'scene'){
                      result.child.push({
                        name: '多轮会话',
                        url: 'scene',
                        path: 'robot',
                        id: 21
                      })
                    }else if(ele.conversationType === 'qa'){
                      result.child.push({
                        name: '一问一答',
                        url: 'qa',
                        path: 'robot',
                        id: 22
                      })
                    }else if(ele.conversationType === 'greeting'){
                      result.child.push({
                        name: '寒暄',
                        url: 'greeting',
                        path: 'robot',
                        id: 23
                      })
                    }
                  })
                }
              }
              this.resultNav.push(result)
            }
          })
        }

      }
    },
//    mounted(){
//      this._initData()
//    },
//    watch:{
//      '$route': function () {
//        this._initData()
//      }
//    }
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
