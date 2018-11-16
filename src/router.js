import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('./views/Home.vue')
    },{
      path: '/console',
      name: 'console',
      component: () => import('./views/console/console.vue'),
      children:[{
        path: 'robot',
        name: 'robot',
        component: () => import('./views/console/robot/robot.vue'),
        children:[{
          path: ':id',
          name: 'showRobot',
          component: () => import('./views/console/robot/robotShow.vue'),
          children:[{
            path: 'robotService',
            name: 'robotService',
            component: () => import('./views/console/robot/robotShow/robotService.vue'),
          },{
            path: 'scene',
            name: 'scene',
            component: () => import('./views/console/robot/robotShow/scene.vue')
          },{
            path: 'qa',
            name: 'qa',
            component: () => import('./views/console/robot/robotShow/qa.vue')
          },{
            path: 'greeting',
            name: 'greeting',
            component: () => import('./views/console/robot/robotShow/greeting.vue')
          },{
            path: 'qaSetting',
            name: 'qaSetting',
            component: () => import('./views/console/robot/robotShow/qaSetting.vue')
          },{
            path: 'analysis',
            name: 'analysis',
            component: () => import('./views/console/robot/robotShow/analysis.vue')
          },{
            path: 'ontology',
            name: 'ontology',
            component: () => import('./views/console/robot/robotShow/ontology.vue')
          },{
            path: 'robotSetting',
            name: 'robotSetting',
            component: () => import('./views/console/robot/robotShow/robotSetting.vue')
          },{
            path: 'commonSetting',
            name: 'commonSetting',
            component: () => import('./views/console/robot/robotShow/commonSetting.vue')
          },{
            path: 'serviceCount',
            name: 'serviceCount',
            component: () => import('./views/common/analysis/serviceCount'),
            // component: () => import('./views/common/iframeBox'),
          },{
            path: 'transPerson',
            name: 'transPerson',
            component: () => import('./views/common/analysis/transPerson'),
            // component: () => import('./views/common/iframeBox'),
          },{
            path: 'unknownQuestion',
            name: 'unknownQuestion',
            component: () => import('./views/common/analysis/unknownQuestion'),

            // component: () => import('./views/common/iframeBox'),
          },{
            path: 'nearWord',
            name: 'nearWord',
            component: () => import('./views/common/word/nearWord'),

            // component: () => import('./views/common/iframeBox'),
          },{
            path: 'sensitiveWord',
            name: 'sensitiveWord',
            component: () => import('./views/common/word/sensitiveWord'),

            // component: () => import('./views/common/iframeBox'),
          },{
            path: 'qualityAnalysis',
            name: 'qualityAnalysis',
            component: () => import('./views/common/analysis/qualityAnalysis'),
          }]
        }]
      },{
        path: 'manage',
        name: 'manage',
        component: () => import('./views/console/manage/manage.vue'),
        children:[{
          path: 'userLimit',
          name: 'userLimit',
          component: () => import('./views/console/manage/userLimit/userLimit.vue')
        },{
          path: 'robotManage',
          name: 'robotManage',
          component: () => import('./views/console/manage/robotManage/robotManage.vue')
        },{
          path: 'manageAnalysis',
          name: 'manageAnalysis',
          component: () => import('./views/console/manage/manageAnalysis/manageAnalysis.vue')
        },{
          path: 'manageOntology',
          name: 'manageOntology',
          component: () => import('./views/console/manage/manageOntology/manageOntology.vue')
        },{
          path: 'systemSetting',
          name: 'systemSetting',
          component: () => import('./views/console/manage/systemSetting/systemSetting.vue')
        },{
          path: 'robotMsg',
          name: 'robotMsg',
          component: () => import('./views/console/manage/robotManage/robotMsg.vue')
        },{
          path: 'totalView',
          name: 'totalView',
          component: () => import('./views/console/manage/totalView/totalView.vue')
        },{
          path: 'manageHistory',
          name: 'manageHistory',
          component: () => import('./views/console/manage/manageHistory/manageHistory.vue')
        }]
      }]
    },{
      path: '/login',
      name: 'login',
      component: () => import('./views/login/login.vue')
    },{
      path: '/register',
      name: 'register',
      component: () => import('./views/login/register.vue')
    },{
      path: '/common',
      name: 'common',
      component: () => import('./views/common/common.vue'),
      children:[{
        path: 'serviceCount',
        // name: 'serviceCount',
        component: () => import('./views/common/analysis/serviceCount'),
      },{
        path: 'transPerson',
        // name: 'transPerson',
        component: () => import('./views/common/analysis/transPerson'),
      },{
        path: 'unknownQuestion',
        // name: 'unknownQuestion',
        component: () => import('./views/common/analysis/unknownQuestion'),
      },{
        path: 'nearWord',
        // name: 'nearWord',
        component: () => import('./views/common/word/nearWord'),
      },{
        path: 'sensitiveWord',
        // name: 'sensitiveWord',
        component: () => import('./views/common/word/sensitiveWord'),
      }]
    }
  ]
})
