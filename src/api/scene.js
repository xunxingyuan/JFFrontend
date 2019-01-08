
import http from './methods'


function addRobotId(data) {
  if(data){
    data['robotId'] =  window.sessionStorage.getItem('robotId')
  }else{
    data = {
      robotId: window.sessionStorage.getItem('robotId')
    }
  }
  return data
}

export default {
  category: {
    getTree: (data)=>{
      return http.get('/api/category/tree',data)
    },
    //删除分类
    deleteCategory: (data)=>{
      let url = '/api/category/'+ data.categoryId
      return http.deleteMethod(url,data)
    },
    //添加分类
    addCategory: (data)=>{
      return http.postForm('/api/category',data)
    },
    //更新分类
    editCategory:  (data)=> {
      let url = '/api/category/'+ data.categoryId
      return http.putMethod(url,data)
    },
    getModuleTree: (data)=>{
      let url = '/api/model/'+ data.moduleCode + '/category'
      return http.get(url,data)
    },
    //获取分类新
    getCategoryData: (data)=> {
      let url = '/api/category/'+ data.categoryId
      return http.get(url,data)
    }
  },
  scene: {
    getSceneList: (data)=>{
      return http.get('/api/scenes',data)
    },
    //搜索场景
    searchScenes:(data)=>{
      let url = '/api/scene/' + window.sessionStorage.getItem('robotId') + '/search'
      return http.get(url,data)
    },
    //添加场景
    addScenes:  (data)=> {
      return http.postForm('/api/scene',data)
    },
    //修改场景
    editScenes:  (data)=> {
      let url = "/api/scene/"+ data.sceneId
      return http.putMethod(url,data)
    },
    deleteScenes:  (data) =>{
      let url = "/api/scene/"+ data.sceneId
      return http.deleteMethod(url,data)
    },
    //发布场景
    releaseScene:  (data)=> {
      let url = '/api/scene/' + data.sceneId + '/release'
      return http.postForm(url,data)
    },
    //获取aiml
    getAimlList: (data)=>{
      return http.get('/api/scene/aimls',data)
    },
    //获取aiml内容
    getAimlContent: (data)=>{
      let url = '/api/scene/aiml/' + data.aimlId
      return http.get(url,data)
    },
    //删除aiml
    deleteAiml: (data)=>{
      let url = '/api/scene/aiml/' + data.aimlId
      return http.deleteMethod(url,data)
    },
    //保存aiml
    saveAiml: (data)=>{
      let url = '/api/scene/aiml/' + data.aimlId
      return http.postForm(url,data)
    },
    //上传aiml
    uploadAiml: (data)=>{
      return http.postForm('/api/scene/upload',data)
    },
    //发布aiml
    releaseAiml: (data)=>{
      let url = '/api/scene/'+ data.aimlId + '/release'
      return http.postForm(url,data)
    }
  },
  editor:{
    //入口问题相似
    getSimilarQuestion: (data)=>{
      data = addRobotId(data)
      let url = '/api/entry/similarity'
      return http.get(url,data)
    },
    //获取问题树
    getScenesById: (data) =>{
      let reqData ={}
      reqData.sceneId = data.id
      reqData = addRobotId(reqData)
      let url = '/api/node/'+ reqData.sceneId+ '/struct'
      return http.get(url,reqData)
    },
    //获取单个问题
    getSoloQuestionById: (data)=>{
      data = addRobotId(data)
      let url = '/api/node/' + data.nodeId
      return http.get(url,data)
    },
    //删除问题
    delQuestionById: (data) =>{
      data = addRobotId(data)
      let url = '/api/node/' + data.nodeId
      return http.deleteMethod(url,data)
    },
    //删除跳转场景
    delQuestionJump: (data) => {
      data = addRobotId(data)
      let url = '/api/react/' + data.reactId
      return http.putMethod(url,data)
    },
    //添加问题节点
    addQuestionNode: (data) =>{
      data = addRobotId(data)
      return http.postForm('/api/node/question',data)
    },
    //更新问题节点
    updateQuestionNode: (data)=>{
      data = addRobotId(data)
      return http.putMethod('/api/node/question',data)
    },
    //添加单选
    addSoloNode: (data)=>{
      data = addRobotId(data)
      return http.postForm('/api/node/radio',data)
    },
    //修改单选
    updateSoloNode: (data)=>{
      data = addRobotId(data)
      return http.putMethod('/api/node/radio',data)
    },
    //添加多选/输入节点
    addDuoNode: (data)=>{
      data = addRobotId(data)
      return http.postForm('/api/node/input',data)
    },
    //修改多选/输入节点
    updateDuoNode: (data)=>{
      data = addRobotId(data)
      return http.putMethod('/api/node/input',data)
    },

    //粘贴问题节点
    parseNode: (data)=>{
      return http.postForm('/api/react/copy',data)
    },
    //节点排序
    sortQuestionNode: (data)=>{
      data = addRobotId(data)
      return http.postForm('/api/react/sort',data)
    },
    //回答排序
    sortAnswerNode: (data)=>{
      data = addRobotId(data)
      return http.postForm('/api/answer/sort',data)
    },
    //撤销节点更改
    rollbackNode: (data)=>{
      data = addRobotId(data)
      return http.post("/api/react/rollback",'')
    },
    //添加回答
    addQuestionNodeAnswer: (data)=>{
      data = addRobotId(data)
      return http.postForm('/api/answer',data)
    },
    //获取回答
    getQuestionNodeAnswer: (data)=>{
      data = addRobotId(data)
      let url= '/api/answer/'+ data.answerId
      return http.get(url,data)
    },
    //更新回答
    updateQuestionNodeAnswer: (data)=>{
      data = addRobotId(data)
      let url= '/api/answer/'+ data.answerId
      return http.putMethod(url,data)
    },
    //删除回答
    deleteQuestionNodeAnswer: (data)=> {
      data = addRobotId(data)
      let url= '/api/answer/'+ data.answerId
      return http.deleteMethod(url,data)
    },
    //获取节点目录
    getNodePath: (data)=>{
      data = addRobotId(data)
      let url = "/api/api/details"
      return http.get(url,data)
    },
    //添加问题
    addQuestion: (data) =>{
      data = addRobotId(data)
      return http.postForm('/api/question/add1',data)
    },
    //生成场景测试
    testScenesCommit: function (data) {
      data = addRobotId(data)
      return http.postForm('/api/react/synchronize',data)
    },
    //添加入口问题
    addScenesRoot: function (data) {
      data = addRobotId(data)
      return http.postForm('/api/entry',data)
    },
    //修改入口问题
    editScenesRoot: function (data) {
      data = addRobotId(data)
      let url = '/api/entry/' + data.sceneId
      return http.putMethod(url,data)
    },
    //获取入口问题
    getScenesRoot: function (data) {
      data = addRobotId(data)
      let url = '/api/entry/' + data.sceneId
      return http.get(url,data)
    },
    //节点跳转
    nodeJump: function (data) {
      data = addRobotId(data)
      let url = '/api/node/skipNode'
      return http.get(url,data)
    },
    //跳转到回答
    nodeJumpAnswer: function (data) {
      data = addRobotId(data)
      let url = '/api/node/skipAnswer'
      return http.get(url,data)
    },
    //节点移动
    nodeMove: function (data) {
      data = addRobotId(data)
      let url = '/api/node/move'
      return http.postForm(url,data)
    }
  },
  variable: {
    //变量获取
    getVariable: (data)=>{
      data = addRobotId(data)
      let url = '/api/variables/' + data.scenesId
      return http.get(url,data)
    },
    //变量操作
    setVariable: (data,type)=>{
      data = addRobotId(data)
      let url= '/api/variable'
      if(type==='get'){
        url +=  '/'+ data.variableId
        return http.get(url,data)
      }else if(type === 'create'){
        return http.postForm(url,data)
      }else if(type === 'update'){
        url+= '/' + data.variableId
        return http.putMethod(url,data)
      }else if(type === 'delete'){
        url+= '/' + data.variableId
        return http.deleteMethod(url,data)
      }else if(type === 'push'){
        return http.postForm(url,data)
      }else if(type === 'getManage'){
        url = '/api/manage/'+ data.sceneId
        return http.get(url,data)
      }else if(type === 'pushManage'){
        url = '/api/manage/'+ data.sceneId
        return http.postForm(url,data)
      }else if(type === 'deleteManage'){
        url = '/api/manage/'+ data.sceneId
        return http.deleteMethod(url,data)
      }
    },
    //表达式操作
    ctrlExpression: (data,type)=>{
      data = addRobotId(data)
      let url = '/api/expression/' + data.variableId
      if(type==='get'){
        return http.get(url,data)
      }else if(type==='update'){
        return http.putMethod(url,data)
      }
    },
  }
}