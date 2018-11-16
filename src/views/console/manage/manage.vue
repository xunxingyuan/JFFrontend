<template>
    <div class="manageTop">
        <manage-top></manage-top>
        <section class="manageContent">
            <div class="left">
                <common-nav :navList="navList" :testPart="false" theme="black"></common-nav>
            </div>
            <div class="right">
                <keep-alive>
                    <router-view />
                </keep-alive>
            </div>
        </section>
    </div>
</template>

<script>
  import ManageTop from "../../../components/header/manageTop.vue";
  import CommonNav from "../../../components/nav/commonNav.vue";

  export default {
    components: {
      CommonNav,
      ManageTop},
    name: 'manage',
    data(){
      return {
        navList: [{
          name:'首页',
          icon: 'icon-shouye',
          url: 'totalView',
          showChild: false,
          child:[]
        },{
          name:'机器人管理',
          icon: 'icon-jiqiren',
          url: 'robotManage',
          showChild: true,
          child:[]
        },{
          name:'统计分析',
          icon: 'icon-tongjiyouhua',
          url: 'manageAnalysis',
          child: []
        },{
          name:'语义网管理',
          icon: 'icon-changjinglinghuo',
          url: 'manageOntology',
          showChild: false,
          child: []
        },{
          name:'权限管理',
          icon: 'icon-yonghuquanxian1',
          url: 'userLimit',
          showChild: false,
          child: []
        },{
          name:'系统设置',
          icon: 'icon-shezhi',
          url: 'systemSetting',
          showChild: false,
          child: []
        },{
          name:'操作日志',
          icon: 'icon-caozuorizhi',
          url: 'manageHistory',
          showChild: false,
          child: []
        }],
      }
    }
  }
</script>

<style lang="less">
    .manageTop{
        height: 100%;
        display: flex;
        flex-flow: column;
        .manageContent{
            flex: 1;
            display: flex;
            position: relative;
            .right{
                flex: 1;
                padding-left: 4rem;
            }
            .left{
                position: absolute;
                z-index: 100;
                height: 100%;
                left: 0;
                top: 0;
            }
        }
    }
</style>
