import http from './methods'

let url = '/api/robots'


export default {
  //新建
  create: (data) => {
    return http.postForm(url, data)
  },
  //获取所有
  getList: () => {
    return http.get(url)
  },
  //获取机器人语义网
  getRobotOntology: (data) => {
    let reqUrl = url + '/config/robotOntoInfo'
    return http.get(reqUrl, data)
  },
  //关联机器人和语义网
  setRobotOntology: (data) => {
    let reqUrl = url + '/config/robotOntoInfo'
    return http.postForm(reqUrl, data)
  },
  //删除
  delRobot: (data) => {
    let reqUrl = url + '/' + data.robotId
    return http.deleteMethod(reqUrl, data)
  },
  //修改
  editRobot: (data) => {
    return http.putMethod(url, data)
  },
  //发布机器人
  publishRobot: (data) => {
    let reqUrl = url + '/publish'
    return http.postForm(reqUrl, data)
  },
  //取消发布机器人
  unPublishRobot: (data) => {
    let reqUrl = url + '/unpublish'
    return http.postForm(reqUrl, data)
  },
  //同步机器人修改
  syncRobot: (data) => {
    let reqUrl = url + '/notify'
    return http.postForm(reqUrl, data)
  },
  //获取aiml树顶层节点
  getAimlTreeRoot: () => {
    return http.get('/api/model/module')
  },
  //获取aiml树子节点
  getAimlTreeChild: (code, data) => {
    return http.get('/api/model/' + code + '/category', data)
  },
  //获取aiml列表
  getAimlList: (data) => {
    return http.get('/api/model/dicision/aimls', data)
  },
  //获取单个aiml的代码
  getAimlCode: (id, data) => {
    return http.get('/api/model/dicision/aiml/' + id, data)
  },
  saveAimlCode: (data) => {
    return http.postForm('/api/model/dicision/aiml', data)
  },
  deleteAiml: (id, data) => {
    return http.deleteMethod('/api/model/dicision/aiml/' + id, data)
  },
  //机器人应答
  robotReply: (data) => {
    let url = '/api/robots/answer'
    return http.postForm(url, data)
  },
  //发布aiml
  publishAiml: function (data) {
    data = addRobotId(data)
    let url = '/api/model/dicision/' + data.aimlId + '/release'
    return http.postForm(url, data)
  },

}